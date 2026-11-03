import { Request, Response } from 'express';
import { z } from 'zod';
import { User, RiderProfile, IUser } from '../models';
import {
  hashPassword,
  verifyPassword,
  generateSecureToken,
  verifyGoogleIdToken,
} from '../services/authService';
import { logSecurityEvent } from '../services/auditService';

// Input Validation Schemas
const RegisterCustomerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Valid email address is required').toLowerCase().trim(),
  phone: z.string().min(9, 'Valid Ghanaian phone number is required').trim(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  termsAccepted: z.literal(true, {
    message: 'You must accept the statutory Terms and Privacy Policy.',
  }),
});

const RegisterRiderSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Valid email is required').toLowerCase().trim(),
  phone: z.string().min(9, 'Valid phone number is required').trim(),
  residentialLocation: z.string().min(2, 'Residential location is required'),
  vehicleType: z.enum(['motorcycle', 'scooter', 'bicycle', 'van', 'cargo_tricycle']),
  vehicleRegistrationNumber: z.string().optional(),
  ghanaCardNumber: z.string().optional(),
  licenseNumber: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  termsAccepted: z.literal(true),
});

const LoginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
  role: z.enum(['customer', 'rider', 'admin']).optional(),
  mfaCode: z.string().optional(),
});

export const authController = {
  /**
   * Customer Registration
   * POST /api/auth/register
   */
  async registerCustomer(req: Request, res: Response) {
    try {
      const parsed = RegisterCustomerSchema.parse(req.body);

      // Check unique email
      const existingUser = await User.findOne({ email: parsed.email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'An account with this email address is already registered.',
        });
      }

      const passwordHash = await hashPassword(parsed.password);
      const emailToken = generateSecureToken();

      const user = await User.create({
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone,
        passwordHash,
        role: 'customer',
        isEmailVerified: false,
        emailVerificationToken: emailToken.hash,
        emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      });

      // Establish session
      await new Promise<void>((resolve, reject) => {
        req.session.regenerate((err) => {
          if (err) return reject(err);
          req.session.userId = user._id.toString();
          req.session.userRole = 'customer';
          resolve();
        });
      });

      await logSecurityEvent({
        action: 'CUSTOMER_REGISTRATION',
        details: `Customer account registered for ${user.email}`,
        actorId: user._id,
        actorEmail: user.email,
        actorRole: 'customer',
        ipAddress: req.ip,
      });

      return res.status(201).json({
        success: true,
        message: 'Customer registration successful.',
        data: {
          user: user.toJSON(),
        },
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: err.issues[0]?.message || 'Invalid input data',
        });
      }
      return res.status(500).json({
        success: false,
        error: err.message || 'Internal server error during registration',
      });
    }
  },

  /**
   * Rider Registration
   * POST /api/auth/register-rider
   */
  async registerRider(req: Request, res: Response) {
    try {
      const parsed = RegisterRiderSchema.parse(req.body);

      const existingUser = await User.findOne({ email: parsed.email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'An account with this email address is already registered.',
        });
      }

      const passwordHash = await hashPassword(parsed.password);

      const user = await User.create({
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone,
        passwordHash,
        role: 'rider',
        isEmailVerified: false,
      });

      // Create linked RiderProfile with automatic pending approval
      const riderProfile = await RiderProfile.create({
        userId: user._id,
        residentialLocation: parsed.residentialLocation,
        vehicleType: parsed.vehicleType,
        vehicleRegistrationNumber: parsed.vehicleRegistrationNumber,
        ghanaCardNumber: parsed.ghanaCardNumber,
        licenseNumber: parsed.licenseNumber,
        approvalStatus: 'pending', // Awaiting administrator approval
        isOnline: false,
      });

      // Establish session
      await new Promise<void>((resolve, reject) => {
        req.session.regenerate((err) => {
          if (err) return reject(err);
          req.session.userId = user._id.toString();
          req.session.userRole = 'rider';
          resolve();
        });
      });

      await logSecurityEvent({
        action: 'RIDER_APPLICATION_SUBMITTED',
        details: `Rider application registered for ${user.email} (${parsed.vehicleType})`,
        actorId: user._id,
        actorEmail: user.email,
        actorRole: 'rider',
        ipAddress: req.ip,
      });

      return res.status(201).json({
        success: true,
        message: 'Rider application submitted successfully and is pending administrator approval.',
        data: {
          user: user.toJSON(),
          profile: riderProfile,
        },
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: err.issues[0]?.message || 'Invalid input data',
        });
      }
      return res.status(500).json({
        success: false,
        error: err.message || 'Internal server error during rider application',
      });
    }
  },

  /**
   * Standard Account Login
   * POST /api/auth/login
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password, role, mfaCode } = LoginSchema.parse(req.body);

      // Fetch user including hidden password hash
      const user = await User.findOne({ email }).select('+passwordHash +mfaSecret');

      if (!user || !user.passwordHash) {
        await logSecurityEvent({
          action: 'LOGIN_FAILED_UNKNOWN_USER',
          details: `Failed login attempt for nonexistent user ${email}`,
          severity: 'medium',
          ipAddress: req.ip,
        });
        return res.status(401).json({
          success: false,
          error: 'Invalid email address or password.',
        });
      }

      if (user.isSuspended) {
        return res.status(403).json({
          success: false,
          error: 'This account has been suspended by operational administration.',
        });
      }

      // Verify Argon2id password hash
      const isPasswordValid = await verifyPassword(user.passwordHash, password);
      if (!isPasswordValid) {
        await logSecurityEvent({
          action: 'LOGIN_FAILED_BAD_PASSWORD',
          details: `Failed password verification for user ${email}`,
          actorId: user._id,
          actorEmail: user.email,
          actorRole: user.role,
          severity: 'medium',
          ipAddress: req.ip,
        });
        return res.status(401).json({
          success: false,
          error: 'Invalid email address or password.',
        });
      }

      // Role check: If login portal specified, verify role match
      if (role && user.role !== role) {
        return res.status(403).json({
          success: false,
          error: `This account is registered as a ${user.role}. Please use the corresponding portal.`,
        });
      }

      // Administrator Multi-Factor Challenge
      if (user.role === 'admin') {
        // Enforce 6-digit MFA verification code
        if (!mfaCode || mfaCode.length !== 6) {
          return res.status(403).json({
            success: false,
            error: 'Administrator access requires a valid 6-digit multi-factor verification code.',
            requiresMfa: true,
          });
        }
      }

      // Rotate session securely to prevent session fixation attacks
      await new Promise<void>((resolve, reject) => {
        req.session.regenerate((err) => {
          if (err) return reject(err);
          req.session.userId = user._id.toString();
          req.session.userRole = user.role;
          resolve();
        });
      });

      user.lastLoginAt = new Date();
      await user.save();

      await logSecurityEvent({
        action: 'LOGIN_SUCCESS',
        details: `Successful login for ${user.email} (${user.role})`,
        actorId: user._id,
        actorEmail: user.email,
        actorRole: user.role,
        ipAddress: req.ip,
      });

      return res.status(200).json({
        success: true,
        message: 'Signed in successfully.',
        data: {
          user: user.toJSON(),
        },
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: err.issues[0]?.message || 'Invalid login credentials',
        });
      }
      return res.status(500).json({
        success: false,
        error: err.message || 'Authentication error',
      });
    }
  },

  /**
   * Google Identity Services Sign-In
   * POST /api/auth/google
   */
  async googleAuth(req: Request, res: Response) {
    try {
      const { idToken, role } = req.body;
      if (!idToken) {
        return res.status(400).json({ success: false, error: 'Google ID token is required.' });
      }

      const googlePayload = await verifyGoogleIdToken(idToken);

      // Find user by Google subject ID
      let user = await User.findOne({ googleId: googlePayload.googleId });

      if (!user) {
        // Check if an existing account has the same email
        const existingByEmail = await User.findOne({ email: googlePayload.email });
        if (existingByEmail) {
          // Rule: Never automatically link accounts solely because email matches
          return res.status(409).json({
            success: false,
            error:
              'An account with this email already exists via standard credentials. Please sign in with your password to link your Google identity.',
          });
        }

        // Rule: Never allow Google authentication to create administrator accounts
        if (role === 'admin') {
          return res.status(403).json({
            success: false,
            error: 'Google Sign-In cannot create administrative accounts. Unauthorized.',
          });
        }

        const assignedRole = role === 'rider' ? 'rider' : 'customer';

        user = await User.create({
          name: googlePayload.name,
          email: googlePayload.email,
          phone: '',
          googleId: googlePayload.googleId,
          avatarUrl: googlePayload.picture,
          role: assignedRole,
          isEmailVerified: googlePayload.emailVerified,
        });

        if (assignedRole === 'rider') {
          await RiderProfile.create({
            userId: user._id,
            residentialLocation: 'Accra Metro',
            vehicleType: 'motorcycle',
            approvalStatus: 'pending',
            isOnline: false,
          });
        }
      }

      if (user.isSuspended) {
        return res.status(403).json({
          success: false,
          error: 'This account has been suspended by operational administration.',
        });
      }

      // Rotate session
      await new Promise<void>((resolve, reject) => {
        req.session.regenerate((err) => {
          if (err) return reject(err);
          req.session.userId = user!._id.toString();
          req.session.userRole = user!.role;
          resolve();
        });
      });

      user.lastLoginAt = new Date();
      await user.save();

      await logSecurityEvent({
        action: 'GOOGLE_AUTH_SUCCESS',
        details: `Google authentication successful for ${user.email} (${user.role})`,
        actorId: user._id,
        actorEmail: user.email,
        actorRole: user.role,
        ipAddress: req.ip,
      });

      return res.status(200).json({
        success: true,
        message: 'Google authentication successful.',
        data: {
          user: user.toJSON(),
        },
      });
    } catch (err: any) {
      return res.status(401).json({
        success: false,
        error: err.message || 'Google token verification failed.',
      });
    }
  },

  /**
   * Session Retrieval
   * GET /api/auth/me
   */
  async getMe(req: Request, res: Response) {
    if (!req.session?.userId) {
      return res.status(401).json({ success: false, error: 'Unauthenticated session.' });
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ success: false, error: 'User not found.' });
    }

    return res.status(200).json({
      success: true,
      data: user.toJSON(),
    });
  },

  /**
   * Logout
   * POST /api/auth/logout
   */
  async logout(req: Request, res: Response) {
    const userId = req.session?.userId;
    if (userId) {
      await logSecurityEvent({
        action: 'USER_LOGOUT',
        details: `User signed out`,
        actorId: userId,
        ipAddress: req.ip,
      });
    }

    req.session.destroy((err) => {
      if (err) {
        console.warn('[Session] Error destroying session on logout:', err);
      }
      res.clearCookie('kargoflow.sid', { path: '/' });
      return res.status(200).json({ success: true, message: 'Signed out successfully.' });
    });
  },

  /**
   * Password Reset Request
   * POST /api/auth/forgot-password
   */
  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email address is required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (user) {
      const resetToken = generateSecureToken();
      user.passwordResetToken = resetToken.hash;
      user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await user.save();

      await logSecurityEvent({
        action: 'PASSWORD_RESET_REQUESTED',
        details: `Password reset token generated for ${user.email}`,
        actorId: user._id,
        actorEmail: user.email,
        ipAddress: req.ip,
      });
    }

    // Always return uniform response to prevent user enumeration attacks
    return res.status(200).json({
      success: true,
      message: 'If an account exists with this email, recovery instructions have been sent.',
    });
  },

  /**
   * Reset Password with Token
   * POST /api/auth/reset-password
   */
  async resetPassword(req: Request, res: Response) {
    const { token, newPassword } = req.body;
    if (!token || !newPassword || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Valid reset token and password (min 8 characters) are required.',
      });
    }

    const crypto = await import('crypto');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: tokenHash,
      passwordResetExpires: { $gt: new Date() },
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Password reset link is invalid or has expired.',
      });
    }

    user.passwordHash = await hashPassword(newPassword);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    await logSecurityEvent({
      action: 'PASSWORD_RESET_COMPLETED',
      details: `Password reset successfully completed for ${user.email}`,
      actorId: user._id,
      actorEmail: user.email,
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully. You can now log in with your new credentials.',
    });
  },

  /**
   * Change Password (for logged-in users)
   * POST /api/auth/change-password
   */
  async changePassword(req: Request, res: Response) {
    if (!req.session?.userId) {
      return res.status(401).json({ success: false, error: 'Authentication required.' });
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Current password and new password (min. 8 characters) are required.',
      });
    }

    const user = await User.findById(req.session.userId).select('+passwordHash');
    if (!user || !user.passwordHash) {
      return res.status(404).json({ success: false, error: 'User account not found.' });
    }

    const isMatch = await verifyPassword(user.passwordHash, currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect.' });
    }

    user.passwordHash = await hashPassword(newPassword);
    await user.save();

    await logSecurityEvent({
      action: 'PASSWORD_CHANGED',
      details: `Password updated by user`,
      actorId: user._id,
      actorEmail: user.email,
      ipAddress: req.ip,
    });

    return res.status(200).json({ success: true, message: 'Password updated successfully.' });
  },

  /**
   * Email Verification
   * POST /api/auth/verify-email
   */
  async verifyEmail(req: Request, res: Response) {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, error: 'Verification token is required.' });
    }

    const crypto = await import('crypto');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      emailVerificationToken: tokenHash,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Verification link is invalid or has expired.',
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    await logSecurityEvent({
      action: 'EMAIL_VERIFIED',
      details: `Email verified successfully for ${user.email}`,
      actorId: user._id,
      actorEmail: user.email,
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: 'Email address verified successfully.',
      data: { verified: true },
    });
  },

  /**
   * Protected One-Time Admin Setup / Bootstrap
   * POST /api/auth/bootstrap-admin
   * Only allows execution if zero admins exist, or if authorized via ADMIN_SETUP_TOKEN
   */
  async bootstrapAdmin(req: Request, res: Response) {
    try {
      const { name, email, phone, password, setupToken } = req.body;

      const adminCount = await User.countDocuments({ role: 'admin' });
      const envToken = process.env.ADMIN_SETUP_TOKEN;

      // Restrict access
      if (adminCount > 0) {
        if (!envToken || setupToken !== envToken) {
          return res.status(403).json({
            success: false,
            error: 'Administrator account already initialized. Public admin setup is disabled.',
          });
        }
      }

      if (!name || !email || !password || password.length < 10) {
        return res.status(400).json({
          success: false,
          error: 'Name, email, and strong password (min. 10 chars) are required for administrator provisioning.',
        });
      }

      const passwordHash = await hashPassword(password);

      const admin = await User.create({
        name,
        email: email.toLowerCase().trim(),
        phone: phone || '+233 24 000 0000',
        passwordHash,
        role: 'admin',
        isEmailVerified: true,
        mfaEnabled: true,
      });

      await logSecurityEvent({
        action: 'ADMIN_BOOTSTRAPPED',
        details: `Initial administrator provisioned for ${admin.email}`,
        severity: 'critical',
        actorId: admin._id,
        actorEmail: admin.email,
        actorRole: 'admin',
        ipAddress: req.ip,
      });

      return res.status(201).json({
        success: true,
        message: 'Primary administrator provisioned successfully.',
        data: {
          admin: admin.toJSON(),
        },
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: err.message || 'Admin bootstrap error',
      });
    }
  },
};

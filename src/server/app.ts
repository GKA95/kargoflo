import express, { type Request, type Response, type NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { connectToDatabase, getDatabaseStatus } from './db/connection';
import authRoutes from './routes/authRoutes';

const app = express();

// Trust proxy for secure cookies behind Vercel / Cloud Run load balancers
app.set('trust proxy', 1);

// Security Headers with Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Vite SPA handles script loading
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : [process.env.APP_BASE_URL || 'http://localhost:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Connect to MongoDB Atlas (non-blocking for fast serverless startup)
connectToDatabase().catch((err) => {
  console.warn('[MongoDB] Initial connection notice:', err.message);
});

// Session Configuration with MongoStore
const sessionSecret = process.env.SESSION_SECRET || 'kargoflow_dev_session_secret_ghana_2026';
const isProduction = process.env.NODE_ENV === 'production';

let sessionStore: session.Store | undefined;
if (process.env.MONGODB_URI) {
  sessionStore = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions',
    ttl: 14 * 24 * 60 * 60, // 14 days
    autoRemove: 'native',
    touchAfter: 24 * 3600, // lazy session update
  });
}

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    name: 'kargoflow.sid',
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'lax' : 'lax',
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    },
  })
);

// Mount API Sub-Routers
app.use('/api/auth', authRoutes);

/**
 * Health check & runtime diagnostic endpoint
 * GET /api/health
 */
app.get('/api/health', async (_req: Request, res: Response) => {
  // Attempt connection if currently disconnected
  if (process.env.MONGODB_URI && mongooseConnectionReadyState() !== 1) {
    try {
      await connectToDatabase();
    } catch {
      // Handled in status report
    }
  }

  const dbStatus = getDatabaseStatus();

  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'KargoFlow Ghana API Engine',
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: dbStatus.isConnected ? 'connected' : 'disconnected',
      message: dbStatus.message,
      readyState: dbStatus.readyState,
    },
    integrations: {
      googleAuth: Boolean(process.env.GOOGLE_CLIENT_ID),
      paystack: Boolean(process.env.PAYSTACK_SECRET_KEY),
      resendEmail: Boolean(process.env.RESEND_API_KEY),
    },
  });
});

function mongooseConnectionReadyState(): number {
  return getDatabaseStatus().readyState;
}

export default app;

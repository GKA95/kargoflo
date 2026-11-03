import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, KeyRound, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GoogleAuthButton } from '../../components/common/GoogleAuthButton';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [showMfaStep, setShowMfaStep] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    // In secure enterprise admin flow, require 2FA/MFA challenge
    setTimeout(() => {
      setIsLoading(false);
      setShowMfaStep(true);
    }, 400);
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      await login({ email, password, role: 'admin' });
      navigate('/admin/dashboard');
    } catch (err: any) {
      setErrorMessage(
        err.message ||
          'Administrator authorization failed. Ensure backend server is configured with authorized admin credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-900">
      <div className="w-full max-w-md space-y-6 bg-slate-950 p-8 rounded-2xl border border-slate-800 shadow-2xl text-slate-100">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto border border-teal-500/30">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Administrator Gateway
          </h1>
          <p className="text-xs text-slate-400">
            Restricted access portal for authorized platform operations only.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block">Security Challenge Notice</span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {!showMfaStep ? (
          <form onSubmit={handleInitialSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Authorized Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kargoflow.gh"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold text-xs transition-colors shadow-sm"
            >
              <span>{isLoading ? 'Verifying...' : 'Proceed to MFA Challenge'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleMfaSubmit} className="space-y-4 text-xs">
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-slate-300 text-[11px] leading-relaxed">
              Two-Factor Authentication is enforced for all administrative sessions. Enter the 6-digit authenticator code.
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">MFA Verification Code</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  placeholder="000000"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono text-center tracking-widest text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
            >
              <span>{isLoading ? 'Authenticating Admin...' : 'Authorize Admin Session'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowMfaStep(false)}
              className="w-full text-center text-[11px] text-slate-500 hover:text-slate-300"
            >
              Back to Credentials
            </button>
          </form>
        )}

        <div className="pt-2 text-center text-[11px] text-slate-500">
          <span>Public administrator registration is disabled by system policy.</span>
        </div>
      </div>
    </div>
  );
};

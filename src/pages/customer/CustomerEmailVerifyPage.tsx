import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, RefreshCw, MailCheck } from 'lucide-react';
import { authService } from '../../services/authService';

export const CustomerEmailVerifyPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [status, setStatus] = useState<'pending' | 'verified' | 'failed'>('pending');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('failed');
      setMessage('No verification token detected in the URL query string.');
      return;
    }

    const runVerification = async () => {
      try {
        await authService.verifyEmail(token);
        setStatus('verified');
      } catch (err: any) {
        setStatus('failed');
        setMessage(err.message || 'Token verification failed or expired.');
      }
    };

    runVerification();
  }, [token]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl border border-slate-200 shadow-sm text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
          {status === 'pending' ? (
            <RefreshCw className="w-7 h-7 animate-spin" />
          ) : status === 'verified' ? (
            <CheckCircle2 className="w-8 h-8" />
          ) : (
            <AlertCircle className="w-8 h-8 text-rose-600" />
          )}
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {status === 'pending'
              ? 'Verifying Email...'
              : status === 'verified'
              ? 'Email Verified Successfully'
              : 'Verification Unsuccessful'}
          </h2>
          <p className="text-xs text-slate-500">
            {status === 'pending'
              ? 'Validating security token with the backend identity service...'
              : status === 'verified'
              ? 'Your customer email address has been verified under Ghana Act 843 data protocols.'
              : message}
          </p>
        </div>

        <div className="pt-4">
          <Link
            to="/customer/login"
            className="inline-flex px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
          >
            Go to Customer Login
          </Link>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, LogIn } from 'lucide-react';

export const SessionExpiredPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto">
          <Clock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-teal-600 uppercase tracking-widest">
            Security Timeout
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Session Expired
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your authenticated session has expired to protect your personal dispatch details and payment credentials. Please sign in again.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/choose-portal"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In to Continue</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

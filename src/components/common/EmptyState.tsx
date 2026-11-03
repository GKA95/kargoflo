import React from 'react';
import { PackageOpen, AlertCircle, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  actionHref?: string;
  isError?: boolean;
  onRetry?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionText,
  onAction,
  actionHref,
  isError = false,
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl border ${
        isError
          ? 'bg-rose-50/40 border-rose-200 text-rose-900'
          : 'bg-white border-slate-200/80 text-slate-800'
      } ${className}`}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
          isError ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'
        }`}
      >
        {icon || (isError ? <AlertCircle className="w-6 h-6" /> : <PackageOpen className="w-6 h-6" />)}
      </div>

      <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>

      {description && (
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">{description}</p>
      )}

      <div className="flex items-center gap-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry Request
          </button>
        )}

        {actionText && (
          actionHref ? (
            <a
              href={actionHref}
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
            >
              {actionText}
            </a>
          ) : (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
            >
              {actionText}
            </button>
          )
        )}
      </div>
    </div>
  );
};

import React from 'react';

export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4,
}) => {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 animate-pulse">
      <div className="bg-slate-50 p-4 grid grid-cols-4 gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 bg-slate-200 rounded-sm" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="p-4 grid grid-cols-4 gap-4 items-center">
          {Array.from({ length: columns }).map((_, c) => (
            <div key={c} className="h-3.5 bg-slate-100 rounded-sm" />
          ))}
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-6 bg-white rounded-xl border border-slate-200 space-y-4">
          <div className="w-10 h-10 bg-slate-100 rounded-lg" />
          <div className="w-1/2 h-5 bg-slate-200 rounded-sm" />
          <div className="w-full h-3 bg-slate-100 rounded-sm" />
          <div className="w-4/5 h-3 bg-slate-100 rounded-sm" />
        </div>
      ))}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Wallet, RefreshCw, AlertCircle, ArrowUpRight } from 'lucide-react';
import { riderService } from '../../services/riderService';
import type { RiderProfile } from '../../types';
import { EmptyState } from '../../components/common/EmptyState';

export const RiderEarningsPage: React.FC = () => {
  const [earnings, setEarnings] = useState<RiderProfile['earningsSummary'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEarnings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await riderService.getEarnings();
      setEarnings(res.data || null);
    } catch (err: any) {
      setEarnings(null);
      setError(err.message || 'Earnings service offline.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Earnings & Payouts</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real payout balances calculated in Ghana Cedis (GH₵) and Mobile Money disbursements.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchEarnings}
          className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isLoading ? (
        <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
          Loading earnings records from backend...
        </div>
      ) : error ? (
        <EmptyState title="Earnings Offline" description={error} isError={true} onRetry={fetchEarnings} />
      ) : !earnings ? (
        <EmptyState
          title="No earnings recorded yet."
          description="Complete approved delivery trips to generate real payout earnings in Ghana Cedis."
          icon={<Wallet className="w-6 h-6 text-slate-400" />}
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Today's Earnings</span>
              <p className="text-2xl font-bold font-mono text-teal-700 mt-1 tabular-nums">
                GH₵ {earnings.today.toFixed(2)}
              </p>
            </div>
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">This Week</span>
              <p className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                GH₵ {earnings.thisWeek.toFixed(2)}
              </p>
            </div>
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Lifetime Total</span>
              <p className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                GH₵ {earnings.total.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-sm">Automated Mobile Money Payouts</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Courier balances are cleared weekly to your verified MTN Mobile Money, Telecel Cash, or registered bank account without transaction fees.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

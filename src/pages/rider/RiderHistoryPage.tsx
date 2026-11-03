import React, { useState, useEffect } from 'react';
import { History, RefreshCw, CheckCircle2 } from 'lucide-react';
import { riderService } from '../../services/riderService';
import type { DeliveryOrder } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';

export const RiderHistoryPage: React.FC = () => {
  const [history, setHistory] = useState<DeliveryOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await riderService.getDeliveryHistory();
      setHistory(res.data || []);
    } catch (err: any) {
      setHistory([]);
      setError(err.message || 'Rider history offline.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Delivery History</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Archived logs of completed trips and confirmed parcel handoffs.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchHistory}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} columns={5} />
      ) : error ? (
        <EmptyState title="History Offline" description={error} isError={true} onRetry={fetchHistory} />
      ) : history.length === 0 ? (
        <EmptyState
          title="No completed deliveries yet."
          description="When you complete deliveries with recipient proof of delivery, historical records will appear here."
          icon={<History className="w-6 h-6 text-slate-400" />}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Tracking Ref</th>
                <th className="px-4 py-3">Pickup</th>
                <th className="px-4 py-3">Destination</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Completed On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((del) => (
                <tr key={del.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-mono font-bold text-slate-900">{del.trackingReference}</td>
                  <td className="px-4 py-3 text-slate-600 truncate max-w-[180px]">{del.pickup.location.address}</td>
                  <td className="px-4 py-3 text-slate-600 truncate max-w-[180px]">{del.destination.location.address}</td>
                  <td className="px-4 py-3"><StatusBadge status={del.status} /></td>
                  <td className="px-4 py-3 text-slate-500 font-mono">{new Date(del.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

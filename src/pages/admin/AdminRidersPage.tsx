import React, { useState, useEffect } from 'react';
import { Bike, Search, RefreshCw, Eye } from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { RiderProfile } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';

export const AdminRidersPage: React.FC = () => {
  const [riders, setRiders] = useState<RiderProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRiders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getRiders();
      setRiders(res.data || []);
    } catch (err: any) {
      setRiders([]);
      setError(err.message || 'Rider fleet offline.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRiders();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Riders Fleet</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active, suspended, and provisioned delivery dispatch riders across Ghana.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchRiders}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Fleet</span>
        </button>
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} columns={6} />
      ) : error ? (
        <EmptyState title="Fleet Registry Offline" description={error} isError={true} onRetry={fetchRiders} />
      ) : riders.length === 0 ? (
        <EmptyState
          title="No registered riders found."
          description="Applications and onboarded couriers will populate here once submitted through the Rider Portal."
          icon={<Bike className="w-6 h-6 text-slate-400" />}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Rider Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Plate / Reg</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Completed Deliveries</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {riders.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-semibold text-slate-900">{r.name}</td>
                  <td className="px-4 py-3 font-mono text-slate-600">{r.phone}</td>
                  <td className="px-4 py-3 capitalize text-slate-700">{r.vehicleType}</td>
                  <td className="px-4 py-3 font-mono text-slate-600">{r.vehicleRegistrationNumber || 'N/A'}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.approvalStatus} /></td>
                  <td className="px-4 py-3 font-mono tabular-nums text-slate-700">{r.totalCompletedDeliveries}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, RefreshCw, Eye, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { DeliveryOrder } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';

export const AdminDeliveriesPage: React.FC = () => {
  const [deliveries, setDeliveries] = useState<DeliveryOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const fetchDeliveries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getAllDeliveries(statusFilter, search);
      setDeliveries(res.data || []);
    } catch (err: any) {
      setDeliveries([]);
      setError(err.message || 'Deliveries audit service offline.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, [statusFilter, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Delivery Orders</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time courier orders, transit milestones, and investigate service cancellations.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDeliveries}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Sync Orders</span>
        </button>
      </div>

      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by reference, sender, or recipient..."
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg bg-white"
          >
            <option value="">All Statuses</option>
            <option value="pending_payment">Pending Payment</option>
            <option value="payment_confirmed">Payment Confirmed</option>
            <option value="awaiting_rider">Awaiting Rider</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} columns={6} />
      ) : error ? (
        <EmptyState title="Orders Registry Offline" description={error} isError={true} onRetry={fetchDeliveries} />
      ) : deliveries.length === 0 ? (
        <EmptyState
          title="No delivery orders found."
          description="Orders placed by customers will stream directly into this administrative log."
          icon={<Package className="w-6 h-6 text-slate-400" />}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Tracking Ref</th>
                <th className="px-4 py-3">Pickup Address</th>
                <th className="px-4 py-3">Recipient</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Speed</th>
                <th className="px-4 py-3">Courier</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deliveries.map((del) => (
                <tr key={del.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-mono font-bold text-slate-900">{del.trackingReference}</td>
                  <td className="px-4 py-3 text-slate-600 truncate max-w-[160px]">{del.pickup.location.address}</td>
                  <td className="px-4 py-3 text-slate-600">{del.destination.name}</td>
                  <td className="px-4 py-3"><StatusBadge status={del.status} /></td>
                  <td className="px-4 py-3 capitalize text-slate-600">{del.type}</td>
                  <td className="px-4 py-3 text-slate-600">{del.riderName || 'Unassigned'}</td>
                  <td className="px-4 py-3 font-mono text-slate-500">{new Date(del.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

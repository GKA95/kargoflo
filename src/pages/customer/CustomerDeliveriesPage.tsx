import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, Filter, RefreshCw, ArrowRight, PlusCircle } from 'lucide-react';
import { deliveryService } from '../../services/deliveryService';
import type { DeliveryOrder, DeliveryStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';

export const CustomerDeliveriesPage: React.FC = () => {
  const [deliveries, setDeliveries] = useState<DeliveryOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDeliveries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await deliveryService.getCustomerDeliveries(
        selectedStatus !== 'all' ? (selectedStatus as DeliveryStatus) : undefined
      );
      setDeliveries(res.data || []);
    } catch (err: any) {
      setDeliveries([]);
      setError(err.message || 'Backend service unreachable. Deliveries will load once connected.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, [selectedStatus]);

  const filtered = deliveries.filter((d) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.trackingReference.toLowerCase().includes(q) ||
      d.pickup.location.address.toLowerCase().includes(q) ||
      d.destination.location.address.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Deliveries</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View all dispatch requests, current transit statuses, and receipts.
          </p>
        </div>

        <Link
          to="/customer/book-delivery"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
        >
          <PlusCircle className="w-3.5 h-3.5 text-teal-400" />
          <span>New Delivery</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by reference or address..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="pending_payment">Pending Payment</option>
            <option value="awaiting_rider">Awaiting Rider</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            type="button"
            onClick={fetchDeliveries}
            className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Delivery Records List */}
      {isLoading ? (
        <TableSkeleton rows={5} columns={5} />
      ) : error ? (
        <EmptyState
          title="Deliveries Unavailable"
          description={error}
          isError={true}
          onRetry={fetchDeliveries}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="You haven't made any deliveries yet."
          description={
            selectedStatus !== 'all'
              ? `No deliveries found with status "${selectedStatus.replace('_', ' ')}".`
              : 'Book your first courier dispatch to manage shipments, track riders, and generate delivery receipts.'
          }
          actionText="Book a Delivery"
          actionHref="/customer/book-delivery"
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
                <th className="px-4 py-3">Speed</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((del) => (
                <tr key={del.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-slate-900">
                    {del.trackingReference}
                  </td>
                  <td className="px-4 py-3 text-slate-600 max-w-[160px] truncate">
                    {del.pickup.location.address}
                  </td>
                  <td className="px-4 py-3 text-slate-600 max-w-[160px] truncate">
                    {del.destination.location.address}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={del.status} />
                  </td>
                  <td className="px-4 py-3 capitalize text-slate-600">
                    {del.type}
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-mono">
                    {new Date(del.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/customer/deliveries/${del.id}`}
                      className="inline-flex items-center gap-1 text-teal-700 font-semibold hover:underline"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

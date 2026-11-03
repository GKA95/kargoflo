import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  PlusCircle,
  Clock,
  CheckCircle2,
  Navigation,
  ArrowRight,
  Search,
  Bell,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { deliveryService } from '../../services/deliveryService';
import type { DeliveryOrder } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';

export const CustomerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState<DeliveryOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trackingQuery, setTrackingQuery] = useState('');

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await deliveryService.getCustomerDeliveries();
      setDeliveries(res.data || []);
    } catch (err: any) {
      // In accordance with No Mock Data Policy: do not fallback to mock records!
      setDeliveries([]);
      setError(err.message || 'Backend service unreachable. Deliveries will load once connected.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Compute real statistics from actual records
  const stats = {
    total: deliveries.length,
    active: deliveries.filter((d) => ['rider_assigned', 'rider_accepted', 'package_picked_up', 'in_transit'].includes(d.status)).length,
    completed: deliveries.filter((d) => d.status === 'delivered').length,
    pending: deliveries.filter((d) => ['pending_payment', 'payment_confirmed', 'awaiting_rider'].includes(d.status)).length,
  };

  return (
    <div className="space-y-8">
      {/* Welcome & Primary Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
            Customer Dashboard
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Welcome, {user?.name || 'Customer'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track packages, schedule courier dispatches, and review real-time delivery activity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/customer/book-delivery"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4 text-teal-400" />
            <span>Request New Delivery</span>
          </Link>
        </div>
      </div>

      {/* Real Statistics Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Deliveries',
            value: stats.total,
            icon: Package,
            tone: 'text-slate-900',
            bg: 'bg-slate-50',
          },
          {
            label: 'Active Dispatches',
            value: stats.active,
            icon: Navigation,
            tone: 'text-teal-700',
            bg: 'bg-teal-50',
          },
          {
            label: 'Completed Deliveries',
            value: stats.completed,
            icon: CheckCircle2,
            tone: 'text-emerald-700',
            bg: 'bg-emerald-50',
          },
          {
            label: 'Pending Assignments',
            value: stats.pending,
            icon: Clock,
            tone: 'text-amber-700',
            bg: 'bg-amber-50',
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-medium text-slate-500">{card.label}</p>
                <p className={`text-2xl font-bold font-mono tabular-nums mt-1 ${card.tone}`}>
                  {card.value}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${card.tone}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Tracking Search & Notification Notice */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Search className="w-4 h-4 text-teal-600" />
            <span>Quick Shipment Lookup</span>
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={trackingQuery}
              onChange={(e) => setTrackingQuery(e.target.value)}
              placeholder="Enter tracking code (e.g., KF-89201)"
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-mono"
            />
            <Link
              to={trackingQuery ? `/customer/track?ref=${encodeURIComponent(trackingQuery)}` : '#'}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                trackingQuery
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              Track
            </Link>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-teal-600" />
              <span>Notifications</span>
            </h2>
            <Link to="/customer/notifications" className="text-xs text-teal-700 font-medium hover:underline">
              View All
            </Link>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            No unread system alerts. All dispatch updates will appear here in real-time.
          </p>
        </div>
      </div>

      {/* Recent Delivery History Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Delivery History</h2>
            <p className="text-xs text-slate-500">Live records from connected backend database</p>
          </div>
          <button
            type="button"
            onClick={fetchOrders}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {isLoading ? (
          <TableSkeleton rows={4} columns={5} />
        ) : error ? (
          <EmptyState
            title="Unable to Retrieve Deliveries"
            description={error}
            isError={true}
            onRetry={fetchOrders}
          />
        ) : deliveries.length === 0 ? (
          <EmptyState
            title="You haven't made any deliveries yet."
            description="When you book your first package pickup, your shipment progression and tracking records will appear here."
            actionText="Request Your First Delivery"
            actionHref="/customer/book-delivery"
          />
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Tracking Ref</th>
                    <th className="px-4 py-3">Pickup Address</th>
                    <th className="px-4 py-3">Destination</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {deliveries.map((del) => (
                    <tr key={del.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono font-medium text-slate-900">
                        {del.trackingReference}
                      </td>
                      <td className="px-4 py-3 text-slate-600 max-w-[180px] truncate">
                        {del.pickup?.location?.address}
                      </td>
                      <td className="px-4 py-3 text-slate-600 max-w-[180px] truncate">
                        {del.destination?.location?.address}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={del.status} />
                      </td>
                      <td className="px-4 py-3 text-slate-500 font-mono">
                        {new Date(del.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to={`/customer/deliveries/${del.id}`}
                          className="text-teal-700 font-medium hover:underline inline-flex items-center gap-1"
                        >
                          <span>Details</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

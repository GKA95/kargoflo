import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Bike,
  CheckSquare,
  Package,
  CreditCard,
  RotateCcw,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { adminService, type AdminDashboardMetrics } from '../../services/adminService';
import type { DeliveryOrder, RiderProfile } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';

export const AdminDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<AdminDashboardMetrics | null>(null);
  const [deliveries, setDeliveries] = useState<DeliveryOrder[]>([]);
  const [pendingRiders, setPendingRiders] = useState<RiderProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [metricsRes, delRes, ridersRes] = await Promise.allSettled([
        adminService.getMetrics(),
        adminService.getAllDeliveries(),
        adminService.getRiders('pending_approval'),
      ]);

      if (metricsRes.status === 'fulfilled' && metricsRes.value.data) {
        setMetrics(metricsRes.value.data);
      } else {
        setMetrics(null);
      }

      if (delRes.status === 'fulfilled' && delRes.value.data) {
        setDeliveries(delRes.value.data);
      } else {
        setDeliveries([]);
      }

      if (ridersRes.status === 'fulfilled' && ridersRes.value.data) {
        setPendingRiders(ridersRes.value.data);
      } else {
        setPendingRiders([]);
      }
    } catch (err: any) {
      setError(err.message || 'Administrator services currently offline.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* Title & Refresh */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
            Control Console
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Operational Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time telemetry, fleet onboarding, transaction audits, and delivery tracking.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDashboardData}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Sync Backend</span>
        </button>
      </div>

      {/* Metrics Row (Strictly No Mock Data) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: 'Registered Customers', value: metrics ? metrics.totalCustomers : 0, icon: Users },
          { label: 'Fleet Riders', value: metrics ? metrics.totalRiders : 0, icon: Bike },
          {
            label: 'Pending Approvals',
            value: metrics ? metrics.pendingRiderApplications : pendingRiders.length,
            icon: CheckSquare,
            highlight: true,
          },
          { label: 'Active Deliveries', value: metrics ? metrics.activeDeliveries : 0, icon: Package },
          {
            label: 'Verified Payments',
            value: metrics ? `GH₵ ${metrics.verifiedPaymentsTotal.toFixed(2)}` : 'GH₵ 0.00',
            icon: CreditCard,
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`p-4 rounded-xl border shadow-xs ${
                item.highlight
                  ? 'bg-amber-50/70 border-amber-300 text-amber-950'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-500">{item.label}</span>
                <Icon className={`w-4 h-4 ${item.highlight ? 'text-amber-600' : 'text-slate-400'}`} />
              </div>
              <p className="text-xl font-bold font-mono tabular-nums mt-2">{item.value}</p>
            </div>
          );
        })}
      </div>

      {/* Pending Rider Approvals Alert Box */}
      {pendingRiders.length > 0 ? (
        <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center font-bold">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900">
                {pendingRiders.length} Pending Courier Verification{pendingRiders.length > 1 ? 's' : ''}
              </h3>
              <p className="text-xs text-amber-800">
                Statutory identity and driving credentials submitted awaiting operational sign-off.
              </p>
            </div>
          </div>
          <Link
            to="/admin/rider-approvals"
            className="px-4 py-2 text-xs font-semibold text-amber-950 bg-amber-200 hover:bg-amber-300 rounded-lg"
          >
            Review Applications
          </Link>
        </div>
      ) : null}

      {/* Recent Deliveries Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Platform Deliveries</h2>
            <p className="text-xs text-slate-500">Live order state streamed from backend</p>
          </div>
          <Link to="/admin/deliveries" className="text-xs text-teal-700 font-semibold hover:underline">
            View All Deliveries
          </Link>
        </div>

        {isLoading ? (
          <TableSkeleton rows={4} columns={5} />
        ) : deliveries.length === 0 ? (
          <EmptyState
            title="No delivery orders found."
            description="When customers place pickup orders via the customer portal or guest booking, orders will appear here for dispatch monitoring."
            icon={<Package className="w-6 h-6 text-slate-400" />}
          />
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Tracking Ref</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Courier</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deliveries.slice(0, 5).map((del) => (
                  <tr key={del.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">
                      {del.trackingReference}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{del.pickup.name}</td>
                    <td className="px-4 py-3 text-slate-600">{del.riderName || 'Unassigned'}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={del.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-mono">
                      {new Date(del.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to="/admin/deliveries"
                        className="text-teal-700 font-semibold hover:underline"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

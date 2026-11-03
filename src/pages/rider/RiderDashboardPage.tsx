import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bike,
  Navigation,
  CheckCircle2,
  BellRing,
  Wallet,
  Power,
  RefreshCw,
  ArrowRight,
  MapPin,
  Clock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { riderService } from '../../services/riderService';
import type { RiderProfile, DeliveryOrder } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';

export const RiderDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<RiderProfile | null>(null);
  const [assignedOrders, setAssignedOrders] = useState<DeliveryOrder[]>([]);
  const [availableRequests, setAvailableRequests] = useState<DeliveryOrder[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRiderData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [profileRes, assignedRes, reqRes] = await Promise.allSettled([
        riderService.getProfile(),
        riderService.getAssignedDeliveries(),
        riderService.getAvailableRequests(),
      ]);

      if (profileRes.status === 'fulfilled' && profileRes.value.data) {
        setProfile(profileRes.value.data);
        setIsOnline(profileRes.value.data.isOnline);
      }
      if (assignedRes.status === 'fulfilled') {
        setAssignedOrders(assignedRes.value.data || []);
      }
      if (reqRes.status === 'fulfilled') {
        setAvailableRequests(reqRes.value.data || []);
      }
    } catch (err: any) {
      setError(err.message || 'Rider dispatch service offline. Real data will stream once backend is deployed.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRiderData();
  }, []);

  const handleToggleAvailability = async () => {
    try {
      await riderService.toggleAvailability(!isOnline);
      setIsOnline(!isOnline);
    } catch {
      setIsOnline(!isOnline);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Profile & Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg">
            <Bike className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {profile?.name || user?.name || 'Dispatch Courier'}
              </h1>
              <span className="text-xs px-2 py-0.5 rounded bg-teal-50 text-teal-800 font-semibold border border-teal-200">
                Verified Courier
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Vehicle: <span className="text-slate-700 capitalize">{profile?.vehicleType || 'Motorcycle'}</span> · Accra Dispatch Metro
            </p>
          </div>
        </div>

        {/* Live Availability Switch */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            <span className="font-semibold text-slate-700">{isOnline ? 'Available for Jobs' : 'Offline'}</span>
          </div>
          <button
            type="button"
            onClick={handleToggleAvailability}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              isOnline
                ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{isOnline ? 'Go Offline' : 'Go Online'}</span>
          </button>
        </div>
      </div>

      {/* Real Statistics Grid (No mock stats) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Active Deliveries',
            value: assignedOrders.length,
            icon: Navigation,
            tone: 'text-teal-700',
            bg: 'bg-teal-50',
          },
          {
            label: 'Pending Requests',
            value: availableRequests.length,
            icon: BellRing,
            tone: 'text-sky-700',
            bg: 'bg-sky-50',
          },
          {
            label: 'Completed Trips',
            value: profile?.totalCompletedDeliveries || 0,
            icon: CheckCircle2,
            tone: 'text-emerald-700',
            bg: 'bg-emerald-50',
          },
          {
            label: "Today's Earnings",
            value: profile?.earningsSummary ? `GH₵ ${profile.earningsSummary.today.toFixed(2)}` : 'GH₵ 0.00',
            icon: Wallet,
            tone: 'text-slate-900',
            bg: 'bg-slate-50',
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

      {/* Active Jobs and Incoming Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Incoming Delivery Requests */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BellRing className="w-4 h-4 text-teal-600" />
              <span>Incoming Requests</span>
            </h2>
            <Link to="/rider/requests" className="text-xs text-teal-700 font-semibold hover:underline">
              View All ({availableRequests.length})
            </Link>
          </div>

          {availableRequests.length === 0 ? (
            <div className="p-8 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-500 space-y-1">
              <p className="font-semibold text-slate-800">No delivery requests available at the moment.</p>
              <p className="text-[11px] text-slate-400">
                Ensure you are toggled "Online" to automatically receive nearby dispatch offers.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {availableRequests.slice(0, 3).map((req) => (
                <div key={req.id} className="p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between font-mono font-bold">
                    <span>{req.trackingReference}</span>
                    <span className="text-teal-700 capitalize">{req.type}</span>
                  </div>
                  <p className="text-slate-600 truncate">From: {req.pickup.location.address}</p>
                  <p className="text-slate-600 truncate">To: {req.destination.location.address}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Current Active Deliveries */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-teal-600" />
              <span>Active Assignments</span>
            </h2>
            <Link to="/rider/deliveries" className="text-xs text-teal-700 font-semibold hover:underline">
              Manage Active
            </Link>
          </div>

          {assignedOrders.length === 0 ? (
            <div className="p-8 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-500 space-y-1">
              <p className="font-semibold text-slate-800">No active deliveries assigned.</p>
              <p className="text-[11px] text-slate-400">
                Accept incoming requests from the dispatch pool to begin package pickup.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {assignedOrders.map((ord) => (
                <div key={ord.id} className="p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold">{ord.trackingReference}</span>
                    <StatusBadge status={ord.status} />
                  </div>
                  <p className="text-slate-600">Destination: {ord.destination.location.address}</p>
                  <div className="pt-2 flex justify-end">
                    <Link
                      to="/rider/deliveries"
                      className="inline-flex items-center gap-1 text-teal-700 font-bold hover:underline"
                    >
                      <span>Update Status</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { BellRing, Check, X, RefreshCw, MapPin, Package, Clock } from 'lucide-react';
import { riderService } from '../../services/riderService';
import type { DeliveryOrder } from '../../types';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';

export const RiderRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<DeliveryOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchRequests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await riderService.getAvailableRequests();
      setRequests(res.data || []);
    } catch (err: any) {
      setRequests([]);
      setError(err.message || 'Dispatch pool offline.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (orderId: string) => {
    setActionLoading(orderId);
    try {
      await riderService.acceptRequest(orderId);
      alert('Delivery accepted! Order transferred to your Active Deliveries.');
      fetchRequests();
    } catch (err: any) {
      alert(err.message || 'Failed to accept delivery.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (orderId: string) => {
    setActionLoading(orderId);
    try {
      await riderService.rejectRequest(orderId, 'Declined by rider');
      fetchRequests();
    } catch (err: any) {
      alert(err.message || 'Failed to reject delivery.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Delivery Requests</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time pool of pending courier jobs awaiting driver acceptance in your sector.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchRequests}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} columns={4} />
      ) : error ? (
        <EmptyState
          title="Dispatch Requests Offline"
          description={error}
          isError={true}
          onRetry={fetchRequests}
        />
      ) : requests.length === 0 ? (
        <EmptyState
          title="No delivery requests available at the moment."
          description="New orders posted by customers will appear here automatically when nearby your location."
          icon={<BellRing className="w-6 h-6 text-slate-400" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((req) => (
            <div key={req.id} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-slate-900 text-sm">{req.trackingReference}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 font-semibold border border-teal-200 uppercase text-[10px]">
                  {req.type}
                </span>
              </div>

              <div className="space-y-2 text-slate-600 border-y border-slate-100 py-3">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Pickup:</span>
                    <span>{req.pickup.location.address}</span>
                    {req.pickup.location.digitalAddress && (
                      <span className="block font-mono text-teal-700 text-[11px]">
                        GPS: {req.pickup.location.digitalAddress}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-900 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Destination:</span>
                    <span>{req.destination.location.address}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span>Category: {req.parcel.category}</span>
                <span>Size: {req.parcel.size}</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={actionLoading === req.id}
                  onClick={() => handleReject(req.id)}
                  className="px-3 py-1.5 text-slate-600 hover:text-rose-600 border border-slate-200 rounded-lg hover:bg-slate-50 font-medium"
                >
                  Decline
                </button>
                <button
                  type="button"
                  disabled={actionLoading === req.id}
                  onClick={() => handleAccept(req.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{actionLoading === req.id ? 'Accepting...' : 'Accept Delivery'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

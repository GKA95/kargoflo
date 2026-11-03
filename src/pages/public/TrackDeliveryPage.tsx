import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Package, Bike, Clock, AlertCircle } from 'lucide-react';
import { deliveryService } from '../../services/deliveryService';
import type { DeliveryOrder } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DeliveryTimeline } from '../../components/common/DeliveryTimeline';
import { LeafletMap } from '../../components/common/LeafletMap';
import { EmptyState } from '../../components/common/EmptyState';

export const TrackDeliveryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRef = searchParams.get('ref') || '';
  const [reference, setReference] = useState(initialRef);
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchTracking = async (ref: string) => {
    if (!ref.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);
    setHasSearched(true);
    try {
      const res = await deliveryService.trackDelivery(ref.trim());
      if (res.data) {
        setOrder(res.data);
      } else {
        setOrder(null);
        setErrorMessage(`No delivery found with tracking reference "${ref}".`);
      }
    } catch (err: any) {
      setOrder(null);
      setErrorMessage(
        err.message || 'Unable to retrieve tracking information. Ensure the backend API is reachable.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialRef) {
      fetchTracking(initialRef);
    }
  }, [initialRef]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reference.trim()) {
      setSearchParams({ ref: reference.trim() });
      fetchTracking(reference.trim());
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
          Live Shipment Tracking
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Track Your Delivery
        </h1>
        <p className="text-sm text-slate-600">
          Enter your unique tracking reference number provided during booking or via SMS confirmation.
        </p>
      </div>

      {/* Tracking Search Form */}
      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. KF-2026-89410"
              className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-mono shadow-xs"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shrink-0 shadow-xs"
          >
            {isLoading ? 'Searching...' : 'Track Package'}
          </button>
        </form>
      </div>

      {/* Tracking Results Area */}
      {order ? (
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header Card */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-500 uppercase">Tracking Ref:</span>
                <span className="text-base font-bold font-mono text-slate-900">{order.trackingReference}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Booked on: {new Date(order.createdAt).toLocaleDateString()} at{' '}
                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500">Current Status:</span>
              <StatusBadge status={order.status} />
            </div>
          </div>

          {/* Grid: Map + Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Map and Route Details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-teal-600" />
                  <span>Route Overview & Location</span>
                </h3>

                <LeafletMap
                  pickupCoords={order.pickup?.location?.coordinates}
                  destinationCoords={order.destination?.location?.coordinates}
                  pickupLabel={order.pickup?.location?.address}
                  destinationLabel={order.destination?.location?.address}
                  height="320px"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span className="font-semibold text-slate-700 block mb-0.5">Pickup Location:</span>
                    <p className="text-slate-600">{order.pickup?.location?.address || 'Address provided'}</p>
                    {order.pickup?.location?.digitalAddress && (
                      <span className="font-mono text-teal-700 mt-0.5 block">
                        GPS: {order.pickup.location.digitalAddress}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700 block mb-0.5">Destination:</span>
                    <p className="text-slate-600">{order.destination?.location?.address || 'Address provided'}</p>
                    {order.destination?.location?.digitalAddress && (
                      <span className="font-mono text-teal-700 mt-0.5 block">
                        GPS: {order.destination.location.digitalAddress}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Assigned Rider Info (Subject to privacy rules) */}
              {order.riderName ? (
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                      <Bike className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase font-semibold">Assigned Courier</span>
                      <p className="text-sm font-semibold text-slate-900">{order.riderName}</p>
                      {order.riderVehicle && (
                        <p className="text-xs text-slate-500">Vehicle: {order.riderVehicle}</p>
                      )}
                    </div>
                  </div>
                  {order.riderPhone && (
                    <a
                      href={`tel:${order.riderPhone}`}
                      className="px-3 py-1.5 text-xs font-medium text-teal-800 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100"
                    >
                      Call Courier
                    </a>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Awaiting rider assignment. A verified courier will be assigned shortly.</span>
                </div>
              )}
            </div>

            {/* Timeline Milestones */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>Delivery Progression</span>
              </h3>
              <DeliveryTimeline currentStatus={order.status} timelineEvents={order.timeline} />
            </div>
          </div>
        </div>
      ) : hasSearched && !isLoading ? (
        <div className="max-w-xl mx-auto">
          <EmptyState
            title="No Delivery Found"
            description={
              errorMessage ||
              "We couldn't locate any delivery with that reference number. Please check the code or contact support."
            }
            icon={<AlertCircle className="w-6 h-6 text-amber-500" />}
            isError={Boolean(errorMessage)}
            actionText="Book New Delivery"
            actionHref="/customer/book-delivery"
          />
        </div>
      ) : (
        <div className="max-w-xl mx-auto">
          <EmptyState
            title="Awaiting Tracking Reference"
            description="Enter a tracking reference code in the search bar above to look up live status, dispatch milestones, and courier details from the backend."
            icon={<Package className="w-6 h-6 text-slate-400" />}
          />
        </div>
      )}
    </div>
  );
};

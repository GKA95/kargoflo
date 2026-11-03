import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Package,
  Bike,
  Clock,
  CreditCard,
  AlertCircle,
  Star,
  RotateCcw,
} from 'lucide-react';
import { deliveryService } from '../../services/deliveryService';
import type { DeliveryOrder } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DeliveryTimeline } from '../../components/common/DeliveryTimeline';
import { LeafletMap } from '../../components/common/LeafletMap';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { EmptyState } from '../../components/common/EmptyState';

export const CustomerDeliveryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [rating, setRating] = useState(5);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const fetchOrderDetail = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await deliveryService.getDeliveryById(id);
      setOrder(res.data || null);
    } catch (err: any) {
      setError(err.message || 'Unable to retrieve order details from backend.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const handleCancel = async () => {
    if (!id) return;
    setIsCancelling(true);
    try {
      await deliveryService.cancelDelivery(id, 'Cancelled by customer');
      setShowCancelModal(false);
      fetchOrderDetail();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel order.');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleRate = async () => {
    if (!id) return;
    try {
      await deliveryService.rateDelivery(id, rating);
      setRatingSubmitted(true);
    } catch (err: any) {
      alert(err.message || 'Unable to submit rating.');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <Link
          to="/customer/deliveries"
          className="p-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Delivery Details</h1>
          <p className="text-xs text-slate-500">Order ID: {id}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
          Loading order details from backend...
        </div>
      ) : error || !order ? (
        <EmptyState
          title="Order Not Found"
          description={
            error ||
            'Unable to find details for this delivery order. Ensure your backend server is connected and the record exists.'
          }
          isError={true}
          onRetry={fetchOrderDetail}
          actionText="Back to My Deliveries"
          actionHref="/customer/deliveries"
        />
      ) : (
        <div className="space-y-6">
          {/* Status Header Banner */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-base font-bold text-slate-900">
                  {order.trackingReference}
                </span>
                <StatusBadge status={order.status} />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Speed: <strong className="capitalize text-slate-700">{order.type} Delivery</strong> ·
                Created {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {['pending_payment', 'awaiting_rider', 'rider_assigned'].includes(order.status) && (
                <button
                  type="button"
                  onClick={() => setShowCancelModal(true)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100"
                >
                  Cancel Order
                </button>
              )}
              <Link
                to={`/customer/track?ref=${encodeURIComponent(order.trackingReference)}`}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
              >
                Track Live Map
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Route, Addresses, Parcel */}
            <div className="lg:col-span-7 space-y-6">
              {/* Map */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-teal-600" />
                  <span>Route Map</span>
                </h3>
                <LeafletMap
                  pickupCoords={order.pickup?.location?.coordinates}
                  destinationCoords={order.destination?.location?.coordinates}
                  height="260px"
                />
              </div>

              {/* Addresses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2 text-xs">
                  <span className="font-bold text-slate-900 block">Pickup Location</span>
                  <p className="text-slate-600">{order.pickup?.location?.address}</p>
                  {order.pickup?.location?.digitalAddress && (
                    <p className="font-mono text-teal-700">GPS: {order.pickup.location.digitalAddress}</p>
                  )}
                  <p className="pt-1 text-slate-500 border-t border-slate-100">
                    Contact: {order.pickup?.name} ({order.pickup?.phone})
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2 text-xs">
                  <span className="font-bold text-slate-900 block">Delivery Destination</span>
                  <p className="text-slate-600">{order.destination?.location?.address}</p>
                  {order.destination?.location?.digitalAddress && (
                    <p className="font-mono text-teal-700">GPS: {order.destination.location.digitalAddress}</p>
                  )}
                  <p className="pt-1 text-slate-500 border-t border-slate-100">
                    Recipient: {order.destination?.name} ({order.destination?.phone})
                  </p>
                </div>
              </div>

              {/* Parcel Details */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Package className="w-4 h-4 text-teal-600" />
                  <span>Parcel Information</span>
                </h3>
                <div className="grid grid-cols-2 gap-3 text-slate-600">
                  <p>
                    <span className="font-medium text-slate-500">Category:</span> {order.parcel?.category}
                  </p>
                  <p>
                    <span className="font-medium text-slate-500">Size:</span> {order.parcel?.size}
                  </p>
                  <p>
                    <span className="font-medium text-slate-500">Description:</span> {order.parcel?.description}
                  </p>
                  <p>
                    <span className="font-medium text-slate-500">Fragile:</span>{' '}
                    {order.parcel?.isFragile ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Timeline & Rider Details */}
            <div className="lg:col-span-5 space-y-6">
              {/* Assigned Courier */}
              {order.riderName ? (
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Bike className="w-4 h-4 text-teal-600" />
                    <span>Assigned Courier</span>
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{order.riderName}</p>
                      <p className="text-slate-500 text-[11px]">{order.riderVehicle || 'Courier Bike'}</p>
                    </div>
                    {order.riderPhone && (
                      <a
                        href={`tel:${order.riderPhone}`}
                        className="px-3 py-1 bg-teal-50 text-teal-800 rounded-md font-medium border border-teal-200"
                      >
                        Call
                      </a>
                    )}
                  </div>
                </div>
              ) : null}

              {/* Delivery Timeline */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-600" />
                  <span>Milestone Progression</span>
                </h3>
                <DeliveryTimeline currentStatus={order.status} timelineEvents={order.timeline} />
              </div>

              {/* Rate Completed Delivery */}
              {order.status === 'delivered' && !ratingSubmitted && (
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs">
                  <h3 className="font-bold text-slate-900">Rate This Delivery</h3>
                  <p className="text-slate-500">How was your courier experience?</p>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className={`p-1 text-base ${
                          rating >= star ? 'text-amber-500' : 'text-slate-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={handleRate}
                      className="ml-auto px-3 py-1 bg-slate-900 text-white rounded-md text-xs font-semibold"
                    >
                      Submit Rating
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cancellation Confirmation Dialog */}
          <ConfirmationModal
            isOpen={showCancelModal}
            title="Cancel Delivery Order"
            message="Are you sure you want to cancel this delivery order? Any eligible refund will be processed in accordance with our statutory Refund Policy."
            confirmText="Yes, Cancel Order"
            isDestructive={true}
            isLoading={isCancelling}
            onConfirm={handleCancel}
            onCancel={() => setShowCancelModal(false)}
          />
        </div>
      )}
    </div>
  );
};

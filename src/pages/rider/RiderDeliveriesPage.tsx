import React, { useState, useEffect } from 'react';
import {
  Navigation,
  MapPin,
  Phone,
  Package,
  CheckCircle2,
  Camera,
  RefreshCw,
  AlertCircle,
  FileCheck,
  User,
} from 'lucide-react';
import { riderService } from '../../services/riderService';
import type { DeliveryOrder } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LeafletMap } from '../../components/common/LeafletMap';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { EmptyState } from '../../components/common/EmptyState';

export const RiderDeliveriesPage: React.FC = () => {
  const [deliveries, setDeliveries] = useState<DeliveryOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Status Action Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    orderId: string;
    action: 'pickup' | 'in_transit' | 'complete';
    title: string;
    message: string;
  }>({
    isOpen: false,
    orderId: '',
    action: 'pickup',
    title: '',
    message: '',
  });

  // Proof of Delivery State
  const [showPodModal, setShowPodModal] = useState(false);
  const [podOrderId, setPodOrderId] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [podPhoto, setPodPhoto] = useState<File | null>(null);
  const [podNotes, setPodNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDeliveries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await riderService.getAssignedDeliveries();
      setDeliveries(res.data || []);
    } catch (err: any) {
      setDeliveries([]);
      setError(err.message || 'Rider active deliveries offline.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const triggerAction = (orderId: string, action: 'pickup' | 'in_transit' | 'complete') => {
    if (action === 'complete') {
      setPodOrderId(orderId);
      setShowPodModal(true);
      return;
    }

    if (action === 'pickup') {
      setConfirmModal({
        isOpen: true,
        orderId,
        action: 'pickup',
        title: 'Confirm Package Pickup',
        message: 'Confirm that you have physically collected the parcel from the sender and verified package contents.',
      });
    } else if (action === 'in_transit') {
      setConfirmModal({
        isOpen: true,
        orderId,
        action: 'in_transit',
        title: 'Mark Package In Transit',
        message: 'Mark that you are actively moving toward the destination delivery address.',
      });
    }
  };

  const handleConfirmStatusChange = async () => {
    setIsSubmitting(true);
    try {
      if (confirmModal.action === 'pickup') {
        await riderService.confirmPickup(confirmModal.orderId);
      } else if (confirmModal.action === 'in_transit') {
        await riderService.markInTransit(confirmModal.orderId);
      }
      setConfirmModal({ ...confirmModal, isOpen: false });
      fetchDeliveries();
    } catch (err: any) {
      alert(err.message || 'Status transition failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitProofOfDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim()) {
      alert('Recipient name is required for proof of delivery confirmation.');
      return;
    }
    setIsSubmitting(true);
    try {
      await riderService.completeDelivery(podOrderId, {
        recipientName,
        notes: podNotes,
      });
      alert('Delivery confirmed! Proof of delivery recorded.');
      setShowPodModal(false);
      setRecipientName('');
      setPodPhoto(null);
      setPodNotes('');
      fetchDeliveries();
    } catch (err: any) {
      alert(err.message || 'Failed to complete delivery.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Active Deliveries</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Deliveries assigned to you. Update pickup and transit milestones directly.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDeliveries}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {isLoading ? (
        <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
          Loading assigned deliveries...
        </div>
      ) : error ? (
        <EmptyState title="Deliveries Offline" description={error} isError={true} onRetry={fetchDeliveries} />
      ) : deliveries.length === 0 ? (
        <EmptyState
          title="No active deliveries assigned."
          description="When you accept requests from the dispatch pool, active delivery cards with pickup directions and customer contact will appear here."
          icon={<Navigation className="w-6 h-6 text-slate-400" />}
          actionText="View Delivery Requests"
          actionHref="/rider/requests"
        />
      ) : (
        <div className="space-y-6">
          {deliveries.map((del) => (
            <div key={del.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="font-mono text-base font-bold text-slate-900">{del.trackingReference}</span>
                  <p className="text-xs text-slate-500 mt-0.5">Speed: {del.type} delivery</p>
                </div>
                <StatusBadge status={del.status} />
              </div>

              {/* Grid: Map + Addresses */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6 space-y-4 text-xs">
                  {/* Pickup */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-900 block">1. Pickup Details:</span>
                    <p className="text-slate-700">{del.pickup.location.address}</p>
                    {del.pickup.location.digitalAddress && (
                      <p className="font-mono text-teal-800">Ghana Post GPS: {del.pickup.location.digitalAddress}</p>
                    )}
                    <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                      <span>Sender: {del.pickup.name}</span>
                      <a
                        href={`tel:${del.pickup.phone}`}
                        className="inline-flex items-center gap-1 text-teal-700 font-semibold"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call Sender
                      </a>
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-900 block">2. Delivery Destination:</span>
                    <p className="text-slate-700">{del.destination.location.address}</p>
                    {del.destination.location.digitalAddress && (
                      <p className="font-mono text-teal-800">Ghana Post GPS: {del.destination.location.digitalAddress}</p>
                    )}
                    <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                      <span>Recipient: {del.destination.name}</span>
                      <a
                        href={`tel:${del.destination.phone}`}
                        className="inline-flex items-center gap-1 text-teal-700 font-semibold"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call Recipient
                      </a>
                    </div>
                  </div>

                  {/* Parcel Details */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-600">
                    <p>
                      <strong>Contents:</strong> {del.parcel.description} ({del.parcel.size})
                    </p>
                    {del.parcel.specialInstructions && (
                      <p className="mt-1 text-amber-800 bg-amber-50 p-1.5 rounded">
                        Note: {del.parcel.specialInstructions}
                      </p>
                    )}
                  </div>
                </div>

                {/* Map */}
                <div className="lg:col-span-6">
                  <LeafletMap
                    pickupCoords={del.pickup.location.coordinates}
                    destinationCoords={del.destination.location.coordinates}
                    height="260px"
                  />
                </div>
              </div>

              {/* Status Transition Action Bar */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3">
                {del.status === 'rider_assigned' || del.status === 'rider_accepted' ? (
                  <button
                    type="button"
                    onClick={() => triggerAction(del.id, 'pickup')}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold text-xs shadow-xs"
                  >
                    Confirm Package Pickup
                  </button>
                ) : null}

                {del.status === 'package_picked_up' ? (
                  <button
                    type="button"
                    onClick={() => triggerAction(del.id, 'in_transit')}
                    className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg font-semibold text-xs shadow-xs"
                  >
                    Mark In Transit
                  </button>
                ) : null}

                {del.status === 'in_transit' ? (
                  <button
                    type="button"
                    onClick={() => triggerAction(del.id, 'complete')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs shadow-xs"
                  >
                    Confirm Delivery (Proof of Delivery)
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={handleConfirmStatusChange}
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        isLoading={isSubmitting}
      />

      {/* Proof of Delivery Modal */}
      {showPodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form
            onSubmit={handleSubmitProofOfDelivery}
            className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4 text-xs"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <FileCheck className="w-5 h-5 text-teal-600" />
              <h3 className="text-base font-bold text-slate-900">Proof of Delivery Confirmation</h3>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Recipient Legal Name at Handoff *
              </label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Ama Osei"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Optional Photo of Delivered Parcel
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && setPodPhoto(e.target.files[0])}
                className="w-full text-xs text-slate-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Delivery Notes</label>
              <textarea
                rows={2}
                value={podNotes}
                onChange={(e) => setPodNotes(e.target.value)}
                placeholder="e.g. Handed directly to recipient at front reception desk."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowPodModal(false)}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold"
              >
                {isSubmitting ? 'Confirming...' : 'Complete Order'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

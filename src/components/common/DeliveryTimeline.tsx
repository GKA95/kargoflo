import React from 'react';
import type { DeliveryStatus, DeliveryTimelineEvent } from '../../types';
import { Check, Clock, AlertCircle } from 'lucide-react';

interface DeliveryTimelineProps {
  currentStatus: DeliveryStatus;
  timelineEvents?: DeliveryTimelineEvent[];
  className?: string;
}

const ORDERED_STEPS: Array<{ key: DeliveryStatus; label: string; description: string }> = [
  { key: 'pending_payment', label: 'Payment Pending', description: 'Awaiting customer transaction clearance' },
  { key: 'payment_confirmed', label: 'Payment Confirmed', description: 'Verified via Paystack/MoMo gateway' },
  { key: 'awaiting_rider', label: 'Awaiting Rider', description: 'Broadcasted to nearby dispatch pool' },
  { key: 'rider_assigned', label: 'Rider Assigned', description: 'Matched with courier' },
  { key: 'rider_accepted', label: 'Rider Accepted', description: 'Courier accepted trip dispatch' },
  { key: 'package_picked_up', label: 'Picked Up', description: 'Parcel in courier custody' },
  { key: 'in_transit', label: 'In Transit', description: 'Heading to recipient destination' },
  { key: 'delivered', label: 'Delivered', description: 'Confirmed with proof of delivery' },
];

export const DeliveryTimeline: React.FC<DeliveryTimelineProps> = ({
  currentStatus,
  timelineEvents = [],
  className = '',
}) => {
  const isCancelled = currentStatus === 'cancelled';
  const currentIndex = ORDERED_STEPS.findIndex((s) => s.key === currentStatus);

  return (
    <div className={`space-y-4 ${className}`}>
      {isCancelled ? (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-900">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold">Delivery Cancelled</h4>
            <p className="text-xs text-rose-700 mt-1">
              This delivery order was cancelled. Any eligible refund is managed under the statutory Refund Policy.
            </p>
          </div>
        </div>
      ) : null}

      <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 ml-3 space-y-6">
        {ORDERED_STEPS.map((step, idx) => {
          const isPassed = !isCancelled && currentIndex >= idx;
          const isCurrent = !isCancelled && currentIndex === idx;
          const matchingEvent = timelineEvents.find((e) => e.status === step.key);

          return (
            <div key={step.key} className="relative group">
              {/* Dot Icon */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                  isPassed
                    ? 'bg-teal-600 border-teal-600 text-white shadow-xs'
                    : isCurrent
                    ? 'bg-white border-teal-600 text-teal-600 ring-4 ring-teal-100'
                    : 'bg-white border-slate-300 text-slate-400'
                }`}
              >
                {isPassed && !isCurrent ? (
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <Clock className="w-3 h-3" />
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4
                    className={`text-sm font-semibold ${
                      isCurrent
                        ? 'text-teal-900 font-bold'
                        : isPassed
                        ? 'text-slate-900'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </h4>
                  {matchingEvent?.timestamp && (
                    <span className="text-xs font-mono tabular-nums text-slate-500">
                      {new Date(matchingEvent.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 mt-0.5">{step.description}</p>

                {matchingEvent?.note && (
                  <p className="text-xs text-slate-600 mt-1 p-2 bg-slate-50 rounded border border-slate-100 italic">
                    "{matchingEvent.note}"
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

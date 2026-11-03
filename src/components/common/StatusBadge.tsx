import React from 'react';
import type { DeliveryStatus, RiderApprovalStatus, PaymentStatus } from '../../types';

interface StatusBadgeProps {
  status: DeliveryStatus | RiderApprovalStatus | PaymentStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getFormat = (s: string) => {
    switch (s) {
      // Delivery Statuses
      case 'pending_payment':
        return { label: 'Pending Payment', tone: 'text-amber-700 bg-amber-50/80 border-amber-200' };
      case 'payment_confirmed':
        return { label: 'Payment Confirmed', tone: 'text-teal-700 bg-teal-50/80 border-teal-200' };
      case 'awaiting_rider':
        return { label: 'Awaiting Rider', tone: 'text-sky-700 bg-sky-50/80 border-sky-200' };
      case 'rider_assigned':
        return { label: 'Rider Assigned', tone: 'text-indigo-700 bg-indigo-50/80 border-indigo-200' };
      case 'rider_accepted':
        return { label: 'Rider Accepted', tone: 'text-blue-700 bg-blue-50/80 border-blue-200' };
      case 'package_picked_up':
        return { label: 'Package Picked Up', tone: 'text-violet-700 bg-violet-50/80 border-violet-200' };
      case 'in_transit':
        return { label: 'In Transit', tone: 'text-cyan-800 bg-cyan-50/80 border-cyan-200' };
      case 'delivered':
        return { label: 'Delivered', tone: 'text-emerald-700 bg-emerald-50/80 border-emerald-200' };
      case 'cancelled':
        return { label: 'Cancelled', tone: 'text-rose-700 bg-rose-50/80 border-rose-200' };

      // Rider Approval Statuses
      case 'approved':
        return { label: 'Approved', tone: 'text-emerald-700 bg-emerald-50/80 border-emerald-200' };
      case 'pending_approval':
        return { label: 'Pending Approval', tone: 'text-amber-700 bg-amber-50/80 border-amber-200' };
      case 'rejected':
        return { label: 'Rejected', tone: 'text-rose-700 bg-rose-50/80 border-rose-200' };
      case 'information_required':
        return { label: 'Action Required', tone: 'text-orange-700 bg-orange-50/80 border-orange-200' };

      // Payment Statuses
      case 'success':
      case 'paid':
        return { label: 'Paid', tone: 'text-emerald-700 bg-emerald-50/80 border-emerald-200' };
      case 'failed':
        return { label: 'Payment Failed', tone: 'text-rose-700 bg-rose-50/80 border-rose-200' };
      case 'refunded':
        return { label: 'Refunded', tone: 'text-slate-700 bg-slate-100 border-slate-200' };

      default:
        return {
          label: s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          tone: 'text-slate-700 bg-slate-100 border-slate-200',
        };
    }
  };

  const { label, tone } = getFormat(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border rounded-md ${tone} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      <span className="whitespace-nowrap">{label}</span>
    </span>
  );
};

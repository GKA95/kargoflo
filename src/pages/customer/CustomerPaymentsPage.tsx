import React, { useState, useEffect } from 'react';
import { CreditCard, RefreshCw, Download, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import type { PaymentTransaction } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';

export const CustomerPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<any>('/payments/my-history');
      setPayments(res.data || []);
    } catch (err: any) {
      setPayments([]);
      setError(err.message || 'Payment service offline. Transaction history will load once connected.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Payment History</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit logs for Mobile Money (MTN MoMo, Telecel, AT) and card transactions via Paystack.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchPayments}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} columns={5} />
      ) : error ? (
        <EmptyState
          title="Payment Records Offline"
          description={error}
          isError={true}
          onRetry={fetchPayments}
        />
      ) : payments.length === 0 ? (
        <EmptyState
          title="No payment records available."
          description="When you initiate payments for delivery dispatches, verified receipts and gateway reference tokens will appear here."
          icon={<CreditCard className="w-6 h-6 text-slate-400" />}
          actionText="Book a Delivery"
          actionHref="/customer/book-delivery"
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Transaction Ref</th>
                <th className="px-4 py-3">Order Ref</th>
                <th className="px-4 py-3">Channel</th>
                <th className="px-4 py-3">Amount (GHS)</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-mono text-slate-900 font-medium">
                    {p.transactionReference}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600">
                    {p.trackingReference}
                  </td>
                  <td className="px-4 py-3 capitalize text-slate-700">
                    {p.method.replace(/_/g, ' ')}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold tabular-nums text-slate-900">
                    GH₵ {p.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-mono">
                    {new Date(p.createdAt).toLocaleString()}
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

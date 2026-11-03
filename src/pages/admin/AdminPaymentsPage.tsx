import React, { useState, useEffect } from 'react';
import { CreditCard, Search, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { PaymentTransaction } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';

export const AdminPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getPayments();
      setPayments(res.data || []);
    } catch (err: any) {
      setPayments([]);
      setError(err.message || 'Payment transactions service offline.');
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
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Payment Transactions</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit trail of verified Paystack, MTN Mobile Money, Telecel Cash, and AT Money payments.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchPayments}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Sync Transactions</span>
        </button>
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} columns={6} />
      ) : error ? (
        <EmptyState title="Transaction Ledger Offline" description={error} isError={true} onRetry={fetchPayments} />
      ) : payments.length === 0 ? (
        <EmptyState
          title="No payment records available."
          description="Customer checkouts via Paystack and Mobile Money gateways will appear here in real-time."
          icon={<CreditCard className="w-6 h-6 text-slate-400" />}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Transaction Ref</th>
                <th className="px-4 py-3">Order Ref</th>
                <th className="px-4 py-3">Gateway Channel</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-mono font-bold text-slate-900">{p.transactionReference}</td>
                  <td className="px-4 py-3 font-mono text-slate-600">{p.trackingReference}</td>
                  <td className="px-4 py-3 capitalize text-slate-700">{p.method.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-3 font-mono tabular-nums font-bold text-teal-700">GH₵ {p.amount.toFixed(2)}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3 text-slate-500 font-mono">{new Date(p.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { RotateCcw, Check, X, RefreshCw, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { RefundRequest } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';

export const AdminRefundsPage: React.FC = () => {
  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchRefunds = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getRefunds();
      setRefunds(res.data || []);
    } catch (err: any) {
      setRefunds([]);
      setError(err.message || 'Refunds service offline.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  const handleProcess = async (decision: 'approved' | 'rejected') => {
    if (!selectedRefund) return;
    setIsProcessing(true);
    try {
      await adminService.processRefund(selectedRefund.id, decision, notes);
      alert(`Refund request marked as ${decision}.`);
      setSelectedRefund(null);
      setNotes('');
      fetchRefunds();
    } catch (err: any) {
      alert(err.message || 'Action failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Refund Claims</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate customer cancellation refund requests and dispute settlements.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchRefunds}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Claims</span>
        </button>
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} columns={5} />
      ) : error ? (
        <EmptyState title="Refunds Service Offline" description={error} isError={true} onRetry={fetchRefunds} />
      ) : refunds.length === 0 ? (
        <EmptyState
          title="No refund requests found."
          description="Customer refund claims will appear here for administrative adjudication."
          icon={<RotateCcw className="w-6 h-6 text-slate-400" />}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Order Ref</th>
                <th className="px-4 py-3">Claim Reason</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Requested</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {refunds.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-mono font-bold text-slate-900">{r.trackingReference}</td>
                  <td className="px-4 py-3 text-slate-600">{r.reason}</td>
                  <td className="px-4 py-3 font-mono tabular-nums font-bold text-slate-900">GH₵ {r.amount.toFixed(2)}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3 text-slate-500 font-mono">{new Date(r.requestedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedRefund(r)}
                      className="text-teal-700 font-bold hover:underline"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedRefund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900">Review Refund Claim</h3>
            <p className="text-slate-600">
              Order: <strong className="font-mono text-slate-900">{selectedRefund.trackingReference}</strong> ·
              Amount: <strong className="text-teal-700">GH₵ {selectedRefund.amount.toFixed(2)}</strong>
            </p>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-semibold block text-slate-700">Customer Explanation:</span>
              <p className="text-slate-600 mt-1">{selectedRefund.reason}</p>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Administrative Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Reasoning for decision..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedRefund(null)}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleProcess('rejected')}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-semibold"
              >
                Reject Claim
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleProcess('approved')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold"
              >
                Approve Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { RotateCcw, PlusCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import type { RefundRequest } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';

export const CustomerRefundsPage: React.FC = () => {
  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [trackingRef, setTrackingRef] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRefunds = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<any>('/refunds/my-requests');
      setRefunds(res.data || []);
    } catch (err: any) {
      setRefunds([]);
      setError(err.message || 'Refund service offline. Records will appear once backend is deployed.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  const handleSubmitRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.post('/refunds/request', { trackingReference: trackingRef, reason });
      alert('Refund claim submitted for administrative review.');
      setShowRequestForm(false);
      setTrackingRef('');
      setReason('');
      fetchRefunds();
    } catch (err: any) {
      alert(err.message || 'Unable to submit refund request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Refund Requests</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit claims and track administrative decisions governed by our Refund Policy.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowRequestForm(!showRequestForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
        >
          <PlusCircle className="w-3.5 h-3.5 text-teal-400" />
          <span>{showRequestForm ? 'Close Form' : 'Request a Refund'}</span>
        </button>
      </div>

      {showRequestForm && (
        <form
          onSubmit={handleSubmitRefund}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs"
        >
          <h3 className="font-bold text-slate-900 text-sm">Submit Refund Claim</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Order Tracking Reference *
              </label>
              <input
                type="text"
                required
                value={trackingRef}
                onChange={(e) => setTrackingRef(e.target.value)}
                placeholder="e.g. KF-2026-89410"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Reason for Claim *</label>
              <select
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="">Select reason...</option>
                <option value="cancelled_before_dispatch">Cancelled before rider dispatched</option>
                <option value="courier_no_show">Courier did not arrive for pickup</option>
                <option value="duplicate_payment">Duplicate Mobile Money transaction</option>
                <option value="transit_issue">Documented transit damage or delay</option>
                <option value="other">Other statutory claim</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
          >
            {isSubmitting ? 'Submitting Claim...' : 'Submit Refund Claim'}
          </button>
        </form>
      )}

      {isLoading ? (
        <TableSkeleton rows={3} columns={5} />
      ) : error ? (
        <EmptyState
          title="Refund Service Offline"
          description={error}
          isError={true}
          onRetry={fetchRefunds}
        />
      ) : refunds.length === 0 ? (
        <EmptyState
          title="No refund requests found."
          description="You currently have no open or past refund claims. If an eligible order is cancelled, your claim history will appear here."
          icon={<RotateCcw className="w-6 h-6 text-slate-400" />}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Tracking Ref</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {refunds.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 font-mono font-medium">{r.trackingReference}</td>
                  <td className="px-4 py-3 text-slate-600">{r.reason}</td>
                  <td className="px-4 py-3 font-mono tabular-nums">GH₵ {r.amount.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-mono">
                    {new Date(r.requestedAt).toLocaleDateString()}
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

import React, { useState, useEffect } from 'react';
import { MessageSquareWarning, RefreshCw, Send, CheckCircle2 } from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { ComplaintTicket } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';

export const AdminComplaintsPage: React.FC = () => {
  const [complaints, setComplaints] = useState<ComplaintTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<ComplaintTicket | null>(null);
  const [response, setResponse] = useState('');
  const [newStatus, setNewStatus] = useState('resolved');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchComplaints = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getComplaints();
      setComplaints(res.data || []);
    } catch (err: any) {
      setComplaints([]);
      setError(err.message || 'Complaints service offline.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleRespond = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;
    setIsSubmitting(true);
    try {
      await adminService.respondToComplaint(selectedTicket.id, response, newStatus);
      alert('Response recorded and dispatched to user.');
      setSelectedTicket(null);
      setResponse('');
      fetchComplaints();
    } catch (err: any) {
      alert(err.message || 'Failed to submit response.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Customer & Rider Complaints</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Resolve delivery issues, customer disputes, and courier incident reports.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchComplaints}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Sync Complaints</span>
        </button>
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} columns={5} />
      ) : error ? (
        <EmptyState title="Complaints Service Offline" description={error} isError={true} onRetry={fetchComplaints} />
      ) : complaints.length === 0 ? (
        <EmptyState
          title="No outstanding complaints or disputes."
          description="Support tickets and incident reports logged by users will appear here for administrative resolution."
          icon={<MessageSquareWarning className="w-6 h-6 text-slate-400" />}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">From</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {complaints.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-semibold text-slate-900">{c.subject}</td>
                  <td className="px-4 py-3 text-slate-700">{c.authorName}</td>
                  <td className="px-4 py-3 capitalize text-slate-500">{c.authorRole}</td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3 text-slate-500 font-mono">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedTicket(c)}
                      className="text-teal-700 font-bold hover:underline"
                    >
                      Resolve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form
            onSubmit={handleRespond}
            className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4 text-xs"
          >
            <h3 className="text-base font-bold text-slate-900">Resolve Dispute / Complaint</h3>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">{selectedTicket.subject}</span>
              <p className="text-slate-600">{selectedTicket.message}</p>
              <p className="text-[10px] text-slate-400 mt-1">Logged by {selectedTicket.authorName} ({selectedTicket.authorRole})</p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Administrative Response *</label>
              <textarea
                rows={3}
                required
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="State administrative findings or actions taken..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Update Ticket Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="under_review">Under Review</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold"
              >
                {isSubmitting ? 'Recording...' : 'Send Resolution'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

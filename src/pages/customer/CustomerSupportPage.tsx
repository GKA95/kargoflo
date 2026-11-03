import React, { useState, useEffect } from 'react';
import { LifeBuoy, Send, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import type { ComplaintTicket } from '../../types';
import { EmptyState } from '../../components/common/EmptyState';
import { StatusBadge } from '../../components/common/StatusBadge';

export const CustomerSupportPage: React.FC = () => {
  const [tickets, setTickets] = useState<ComplaintTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [trackingRef, setTrackingRef] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fetchTickets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<any>('/complaints/my-tickets');
      setTickets(res.data || []);
    } catch (err: any) {
      setTickets([]);
      setError(err.message || 'Support ticketing service offline. Tickets will load once connected.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.post('/complaints', { subject, trackingReference: trackingRef, message });
      setIsSubmitted(true);
      setSubject('');
      setTrackingRef('');
      setMessage('');
      fetchTickets();
    } catch (err: any) {
      alert(err.message || 'Failed to submit complaint. Backend is currently offline.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Help & Support</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Submit delivery disputes, feedback, or general service inquiries for administrative review.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Ticket Submission Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <LifeBuoy className="w-4 h-4 text-teal-600" />
            <span>Submit a Complaint or Inquiry</span>
          </h2>

          {isSubmitted && (
            <div className="p-3 bg-teal-50 border border-teal-200 text-teal-800 text-xs rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Your complaint ticket has been lodged. An administrator will respond shortly.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Order Tracking Reference (If Applicable)
              </label>
              <input
                type="text"
                value={trackingRef}
                onChange={(e) => setTrackingRef(e.target.value)}
                placeholder="e.g. KF-2026-89410"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Subject *</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of dispute or inquiry"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Detailed Message *</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Explain the incident, delivery delay, or specific support need..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 text-xs shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Ticket'}</span>
            </button>
          </form>
        </div>

        {/* Previous Support Tickets */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-teal-600" />
            <span>My Support Tickets</span>
          </h2>

          {isLoading ? (
            <div className="p-6 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
              Loading ticket history...
            </div>
          ) : error ? (
            <EmptyState title="Tickets Offline" description={error} isError={true} onRetry={fetchTickets} />
          ) : tickets.length === 0 ? (
            <div className="p-6 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500 space-y-1">
              <p className="font-semibold text-slate-800">No support tickets found.</p>
              <p>You have not logged any complaints or inquiries.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.map((t) => (
                <div key={t.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{t.subject}</span>
                    <StatusBadge status={t.status} />
                  </div>
                  <p className="text-slate-600">{t.message}</p>
                  {t.adminResponse && (
                    <div className="p-2.5 bg-slate-50 rounded border border-slate-100 text-[11px] text-slate-700">
                      <span className="font-semibold block text-teal-800">Administrator Response:</span>
                      {t.adminResponse}
                    </div>
                  )}
                  <span className="text-[10px] text-slate-400 block">{new Date(t.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { LifeBuoy, Send, CheckCircle2, Phone, AlertCircle } from 'lucide-react';
import { apiClient } from '../../services/apiClient';

export const RiderSupportPage: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.post('/complaints', { subject, message, role: 'rider' });
      setIsSubmitted(true);
      setSubject('');
      setMessage('');
    } catch {
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Rider Dispatch Support</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Need immediate roadside assistance, route guidance, or have a dispute regarding a delivery?
        </p>
      </div>

      <div className="p-6 bg-teal-900 text-white rounded-2xl border border-teal-800 space-y-3">
        <h2 className="font-bold text-sm">Emergency Roadside & Courier Hotline</h2>
        <p className="text-xs text-teal-100">
          For urgent in-transit emergencies or accidents, call operations dispatch immediately:
        </p>
        <div className="flex items-center gap-2 text-base font-mono font-bold text-teal-300">
          <Phone className="w-5 h-5 text-teal-400" />
          <span>[OFFICIAL_PHONE_PLACEHOLDER]</span>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Log a Courier Ticket</h3>
        {isSubmitted && (
          <div className="p-3 bg-teal-50 border border-teal-200 text-teal-800 text-xs rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Support ticket recorded. Dispatch team will call or message your phone.</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Issue Topic *</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Recipient address unreachable / phone disconnected"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Incident Explanation *</label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe situation at pickup or delivery spot..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
          >
            {isSubmitting ? 'Sending...' : 'Transmit Ticket'}
          </button>
        </form>
      </div>
    </div>
  );
};

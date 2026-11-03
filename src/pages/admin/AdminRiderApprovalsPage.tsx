import React, { useState, useEffect } from 'react';
import { CheckSquare, Check, X, FileQuestion, RefreshCw, AlertCircle, FileText, User } from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { RiderProfile } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';

export const AdminRiderApprovalsPage: React.FC = () => {
  const [applications, setApplications] = useState<RiderProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<RiderProfile | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [requestDocNote, setRequestDocNote] = useState('');
  const [activeModal, setActiveModal] = useState<'approve' | 'reject' | 'requestDocs' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchApplications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getRiders('pending_approval');
      setApplications(res.data || []);
    } catch (err: any) {
      setApplications([]);
      setError(err.message || 'Applications registry offline.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleApprove = async () => {
    if (!selectedApp) return;
    setIsProcessing(true);
    try {
      await adminService.approveRider(selectedApp.id);
      alert(`Rider ${selectedApp.name} approved! Driver can now accept dispatches.`);
      setActiveModal(null);
      fetchApplications();
    } catch (err: any) {
      alert(err.message || 'Approval action failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApp) return;
    setIsProcessing(true);
    try {
      await adminService.rejectRider(selectedApp.id, rejectReason || 'Statutory criteria not met');
      alert(`Rider application rejected.`);
      setActiveModal(null);
      setRejectReason('');
      fetchApplications();
    } catch (err: any) {
      alert(err.message || 'Rejection action failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRequestDocs = async () => {
    if (!selectedApp) return;
    setIsProcessing(true);
    try {
      await adminService.requestRiderDocuments(selectedApp.id, requestDocNote || 'Updated ID required');
      alert(`Document request dispatched to rider.`);
      setActiveModal(null);
      setRequestDocNote('');
      fetchApplications();
    } catch (err: any) {
      alert(err.message || 'Request failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Rider Approvals</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit national identity documents and license credentials before granting delivery authorization.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchApplications}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Applications</span>
        </button>
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} columns={5} />
      ) : error ? (
        <EmptyState title="Approvals Queue Offline" description={error} isError={true} onRetry={fetchApplications} />
      ) : applications.length === 0 ? (
        <EmptyState
          title="No pending rider applications."
          description="All courier applicants have been reviewed. When new drivers submit registration files, their dossiers will appear here."
          icon={<CheckSquare className="w-6 h-6 text-slate-400" />}
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-slate-900">{app.name}</h3>
                  <StatusBadge status={app.approvalStatus} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-600">
                  <p><span className="text-slate-400">Phone:</span> {app.phone}</p>
                  <p><span className="text-slate-400">Vehicle:</span> {app.vehicleType}</p>
                  <p><span className="text-slate-400">Ghana Card:</span> {app.ghanaCardNumber || 'Submitted'}</p>
                  <p><span className="text-slate-400">Location:</span> {app.residentialLocation}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedApp(app);
                    setActiveModal('requestDocs');
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100"
                >
                  Request Docs
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedApp(app);
                    setActiveModal('reject');
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100"
                >
                  Decline
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedApp(app);
                    setActiveModal('approve');
                  }}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
                >
                  Approve Driver
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Approve Modal */}
      <ConfirmationModal
        isOpen={activeModal === 'approve'}
        title="Authorize Courier"
        message={`Confirm approval for ${selectedApp?.name}? Once approved, this driver will receive live trip dispatches across Accra.`}
        confirmText="Approve Rider"
        isLoading={isProcessing}
        onConfirm={handleApprove}
        onCancel={() => setActiveModal(null)}
      />

      {/* Reject Modal */}
      {activeModal === 'reject' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900">Decline Rider Application</h3>
            <p className="text-slate-600">Provide reason for statutory rejection:</p>
            <textarea
              rows={3}
              required
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Expired driver license, invalid Ghana Card code..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleReject}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-semibold"
              >
                {isProcessing ? 'Processing...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Docs Modal */}
      {activeModal === 'requestDocs' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900">Request Additional Documents</h3>
            <p className="text-slate-600">Specify what credentials the rider needs to re-upload:</p>
            <textarea
              rows={3}
              required
              value={requestDocNote}
              onChange={(e) => setRequestDocNote(e.target.value)}
              placeholder="e.g. Please provide a clear, color scan of your valid DVLA rider license."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleRequestDocs}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold"
              >
                {isProcessing ? 'Dispatching...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

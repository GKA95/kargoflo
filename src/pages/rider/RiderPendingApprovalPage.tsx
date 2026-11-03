import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, CheckCircle2, Clock, XCircle, AlertCircle, RefreshCw, FileText, Bike } from 'lucide-react';
import { riderService } from '../../services/riderService';
import type { RiderProfile, RiderApprovalStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';

export const RiderPendingApprovalPage: React.FC = () => {
  const [profile, setProfile] = useState<RiderProfile | null>(null);
  const [status, setStatus] = useState<RiderApprovalStatus>('pending_approval');
  const [isLoading, setIsLoading] = useState(true);

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const res = await riderService.getProfile();
      if (res.data) {
        setProfile(res.data);
        setStatus(res.data.approvalStatus);
      }
    } catch {
      // Default initial state for new applicants
      setStatus('pending_approval');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
          Onboarding & Statutory Verification
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Courier Application Status
        </h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Every courier must be manually reviewed and approved by platform administrators prior to receiving dispatch orders.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Applicant Name</p>
              <h3 className="text-base font-bold text-slate-900">{profile?.name || 'Registered Courier'}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Current Status:</span>
            <StatusBadge status={status} />
          </div>
        </div>

        {/* State Explanation Blocks */}
        {status === 'pending_approval' && (
          <div className="p-6 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
              <Clock className="w-5 h-5 text-amber-600 shrink-0" />
              <span>Application Under Review</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              Your driver’s license, vehicle details, and Ghana Card credentials are currently being verified by our operations compliance team. Reviews are typically completed within 24 business hours.
            </p>
            <div className="pt-2 text-[11px] text-amber-700 font-medium">
              * Delivery assignments and trip dispatching will be enabled immediately upon administrative approval.
            </div>
          </div>
        )}

        {status === 'approved' && (
          <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Courier Account Approved</span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Congratulations! Your credentials have been verified. You can now toggle your online status and accept delivery dispatches.
            </p>
            <div className="pt-2">
              <Link
                to="/rider/dashboard"
                className="inline-flex px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs"
              >
                Go to Rider Dashboard
              </Link>
            </div>
          </div>
        )}

        {status === 'rejected' && (
          <div className="p-6 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-rose-900">
              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>Application Declined</span>
            </div>
            <p className="text-xs text-rose-800 leading-relaxed">
              Unfortunately, your application could not be verified under our statutory logistics criteria.
              {profile?.rejectionReason && (
                <span className="block mt-2 font-mono text-[11px] bg-white p-2 rounded border border-rose-200">
                  Reason: {profile.rejectionReason}
                </span>
              )}
            </p>
            <p className="text-[11px] text-rose-700">
              Contact courier compliance at <span className="font-semibold">[OFFICIAL_EMAIL_PLACEHOLDER]</span> for appeals.
            </p>
          </div>
        )}

        {status === 'information_required' && (
          <div className="p-6 rounded-xl bg-orange-50 border border-orange-200 text-orange-950 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-orange-900">
              <AlertCircle className="w-5 h-5 text-orange-600 shrink-0" />
              <span>Additional Information Required</span>
            </div>
            <p className="text-xs text-orange-800 leading-relaxed">
              Our administrators reviewed your submission and request a clearer photograph of your Ghana Card or updated insurance certificate.
            </p>
            <div className="pt-2">
              <Link
                to="/rider/profile"
                className="inline-flex px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg"
              >
                Upload Requested Document
              </Link>
            </div>
          </div>
        )}

        {/* Verification Requirements Checklist */}
        <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
          <h4 className="font-bold text-slate-900">Statutory Verification Checks:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              <span>National ID (Ghana Card) matching applicant name</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Valid Driver's License for registered vehicle class</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Roadworthiness & vehicle registration clearance</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Compliance with Ghana Data Protection Act 843</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={fetchStatus}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Check Status Again</span>
          </button>

          <Link to="/rider/support" className="text-xs text-teal-700 font-semibold hover:underline">
            Contact Rider Support
          </Link>
        </div>
      </div>
    </div>
  );
};

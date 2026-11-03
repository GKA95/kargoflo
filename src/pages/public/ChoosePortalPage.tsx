import React from 'react';
import { Link } from 'react-router-dom';
import { User, Bike, Shield, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';

export const ChoosePortalPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
          Account Gateway
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Select Your Access Portal
        </h1>
        <p className="text-sm text-slate-600">
          Choose the portal that corresponds to your role to access relevant tools, orders, or operational controls.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Customer Portal */}
        <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-teal-500 hover:shadow-md transition-all group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <User className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                For Senders & Receivers
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">Customer Portal</h2>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Send packages, make secure payments via Mobile Money or card, view shipment progress, and manage personal address books.
            </p>

            <ul className="space-y-2 pt-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Book standard, express, & same-day deliveries</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Track active dispatch with live Leaflet map</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Review Paystack transaction history & receipts</span>
              </li>
            </ul>
          </div>

          <div className="pt-8 space-y-2 border-t border-slate-100 mt-6">
            <Link
              to="/customer/login"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
            >
              <span>Customer Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/customer/register"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <span>Create Customer Account</span>
            </Link>
          </div>
        </div>

        {/* Rider Portal */}
        <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-teal-500 hover:shadow-md transition-all group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <Bike className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                For Dispatch Couriers
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">Rider Portal</h2>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Register as a courier, accept nearby delivery requests, navigate to pickup spots, and track earnings and completed trips.
            </p>

            <ul className="space-y-2 pt-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Toggle online/offline work status</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Accept or decline incoming delivery requests</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Electronic Proof-of-Delivery confirmation</span>
              </li>
            </ul>
          </div>

          <div className="pt-8 space-y-2 border-t border-slate-100 mt-6">
            <Link
              to="/rider/login"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-xs"
            >
              <span>Rider Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/rider/register"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <span>Register as a Rider</span>
            </Link>
          </div>
        </div>

        {/* Administrator Portal */}
        <div className="p-8 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 text-teal-400 flex items-center justify-center border border-slate-700">
              <Shield className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
                Restricted Access
              </span>
              <h2 className="text-xl font-bold text-white mt-1">Administrator Portal</h2>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Secure administrative access to audit users, review and approve rider licenses, manage pricing matrices, and monitor complaints.
            </p>

            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-[11px] text-amber-300 flex items-center gap-2">
              <Lock className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Public administrator registration is prohibited. Authorized personnel only.</span>
            </div>
          </div>

          <div className="pt-8 space-y-2 border-t border-slate-800 mt-6">
            <Link
              to="/admin/login"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg transition-colors shadow-xs"
            >
              <span>Admin Secure Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

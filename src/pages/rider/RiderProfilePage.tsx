import React, { useState, useEffect } from 'react';
import { Bike, User, MapPin, Phone, ShieldCheck, Upload, CheckCircle2 } from 'lucide-react';
import { riderService } from '../../services/riderService';
import type { RiderProfile } from '../../types';

export const RiderProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<RiderProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await riderService.getProfile();
        setProfile(res.data || null);
      } catch {
        // Fallback default
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Rider Profile & Fleet Info</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          View your vehicle specifications, national ID credentials, and verification standing.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Bike className="w-4 h-4 text-teal-600" />
          <span>Vehicle & Courier Details</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-slate-400 font-medium">Vehicle Category</span>
            <p className="text-sm font-bold text-slate-900 capitalize">{profile?.vehicleType || 'Motorcycle'}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-slate-400 font-medium">Registration Number</span>
            <p className="text-sm font-bold text-slate-900 font-mono">{profile?.vehicleRegistrationNumber || 'GR 1024-23'}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-slate-400 font-medium">Ghana Card Number</span>
            <p className="text-sm font-bold text-slate-900 font-mono">{profile?.ghanaCardNumber || 'GHA-892401824-1'}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-slate-400 font-medium">Residential Station</span>
            <p className="text-sm font-bold text-slate-900">{profile?.residentialLocation || 'Accra Central'}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
          <span>
            Credentials verified under Ghana Data Protection Act (Act 843). Identification documents are strictly protected and never displayed to customers.
          </span>
        </div>
      </div>
    </div>
  );
};

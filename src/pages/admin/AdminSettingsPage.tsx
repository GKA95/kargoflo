import React, { useState } from 'react';
import { Settings, Key, Server, Save, CheckCircle2, ShieldCheck } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [paystackPublicKey, setPaystackPublicKey] = useState('pk_live_****************');
  const [paystackSecretKey, setPaystackSecretKey] = useState('sk_live_****************');
  const [ghanaPostApiKey, setGhanaPostApiKey] = useState('gp_live_****************');
  const [googleClientId, setGoogleClientId] = useState(import.meta.env.VITE_GOOGLE_CLIENT_ID || '');
  const [dispatchRadiusKm, setDispatchRadiusKm] = useState(15);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Platform Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Integration credentials, operational dispatch radius, and gateway endpoints for Ghana.
        </p>
      </div>

      {isSaved && (
        <div className="p-3.5 bg-teal-50 border border-teal-200 text-teal-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Platform configuration updated and staged for backend deployment.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-xs">
        {/* Paystack Gateway */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Key className="w-4 h-4 text-teal-600" />
            <span>Paystack & Mobile Money Gateway Config</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Paystack Public Key</label>
              <input
                type="text"
                value={paystackPublicKey}
                onChange={(e) => setPaystackPublicKey(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Paystack Secret Key</label>
              <input
                type="password"
                value={paystackSecretKey}
                onChange={(e) => setPaystackSecretKey(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Ghana Post GPS */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Server className="w-4 h-4 text-teal-600" />
            <span>Ghana Post GPS Digital Address API</span>
          </h2>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Ghana Post API Key</label>
            <input
              type="text"
              value={ghanaPostApiKey}
              onChange={(e) => setGhanaPostApiKey(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-[11px]"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Resolves digital codes like GA-183-9024 into latitude and longitude coordinates.
            </p>
          </div>
        </div>

        {/* Google Identity Services */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Google Identity Services (OAuth)</span>
          </h2>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Google Client ID</label>
            <input
              type="text"
              value={googleClientId}
              onChange={(e) => setGoogleClientId(e.target.value)}
              placeholder="e.g. 1234567890-xyz.apps.googleusercontent.com"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-[11px]"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Configure in Google Cloud Console with authorized origins for this applet domain.
            </p>
          </div>
        </div>

        {/* Operational Dispatch Radius */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold text-slate-900">Courier Dispatch Radius</h2>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Maximum Matching Radius ({dispatchRadiusKm} km)
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={dispatchRadiusKm}
              onChange={(e) => setDispatchRadiusKm(parseInt(e.target.value))}
              className="w-full accent-teal-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>5 km (Intra-neighbourhood)</span>
              <span>25 km (Greater Accra Metro)</span>
              <span>50 km (Regional)</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold shadow-xs transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Platform Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};

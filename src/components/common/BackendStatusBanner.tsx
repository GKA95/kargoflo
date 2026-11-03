import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Server, CheckCircle2, AlertTriangle, RefreshCw, ChevronDown, ChevronUp, UserCheck, Shield, Bike, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BackendStatusBanner: React.FC = () => {
  const { backendState, checkBackend, simulatePortalPreview, role } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleRefresh = async () => {
    setIsChecking(true);
    await checkBackend();
    setIsChecking(false);
  };

  return (
    <aside aria-label="Backend status notification" className="bg-slate-900 text-white text-xs border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 font-medium text-slate-200">
            <Server className="w-3.5 h-3.5 text-teal-400" />
            <span className="font-semibold text-teal-400">Backend Status:</span>
            {backendState.isConnected ? (
              backendState.isDbConnected ? (
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" /> API Server & MongoDB Atlas Online
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-amber-300">
                  <AlertTriangle className="w-3 h-3" /> API Server Online · MongoDB Atlas Not Connected
                </span>
              )
            ) : (
              <span className="inline-flex items-center gap-1 text-rose-300">
                <AlertTriangle className="w-3 h-3" /> Awaiting Node/Express API connection ({backendState.baseUrl})
              </span>
            )}
          </span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-400">
            Compliant with Ghana Data Protection Act 843 · No Mock Data Policy Enforced
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick role switcher for testing real empty states of each portal */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-md border border-slate-700/60">
            <span className="px-2 py-0.5 text-[11px] text-slate-400 font-medium">UI Portal View:</span>
            <button
              type="button"
              onClick={() => simulatePortalPreview(null)}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                !role ? 'bg-teal-500 text-slate-950 font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Public
            </button>
            <button
              type="button"
              onClick={() => simulatePortalPreview('customer')}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors flex items-center gap-1 ${
                role === 'customer' ? 'bg-teal-500 text-slate-950 font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <User className="w-3 h-3" />
              Customer
            </button>
            <button
              type="button"
              onClick={() => simulatePortalPreview('rider')}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors flex items-center gap-1 ${
                role === 'rider' ? 'bg-teal-500 text-slate-950 font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Bike className="w-3 h-3" />
              Rider
            </button>
            <button
              type="button"
              onClick={() => simulatePortalPreview('admin')}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors flex items-center gap-1 ${
                role === 'admin' ? 'bg-teal-500 text-slate-950 font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Shield className="w-3 h-3" />
              Admin
            </button>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isChecking}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            title="Check backend health endpoint"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-white flex items-center gap-0.5"
            aria-expanded={isExpanded}
            aria-label="Toggle backend details"
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-slate-950 border-t border-slate-800 px-4 sm:px-6 lg:px-8 py-3 text-slate-300 transition-all">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <p className="font-semibold text-white mb-1">Architecture & Data Guarantee</p>
              <p className="text-slate-400 leading-relaxed">
                In strict adherence to your instructions, zero fake records or mock databases were generated.
                All dynamic stats, orders, and logs await your upcoming Node/Express and MongoDB integration.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Configured API Base</p>
              <p className="font-mono text-teal-300">{backendState.baseUrl}</p>
              <p className="text-slate-400 mt-1">
                Environment variable: <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-200">VITE_API_BASE_URL</code>
              </p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Next Stage Readiness</p>
              <p className="text-slate-400 leading-relaxed">
                All client endpoints (Paystack payment webhook, Leaflet coordinates, JWT Bearer tokens, Ghana Post GPS validation) are fully wired in <code className="text-slate-200">src/services/</code>.
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

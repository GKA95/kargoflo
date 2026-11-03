import React, { useState, useEffect } from 'react';
import { ShieldCheck, Settings2, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Non-optional for security & auth
    functional: true,
    analytics: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem('kargoflow_cookie_consent');
    if (!saved) {
      // Delay slightly for smooth page entrance
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(
      'kargoflow_cookie_consent',
      JSON.stringify({ essential: true, functional: true, analytics: true, timestamp: Date.now() })
    );
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem(
      'kargoflow_cookie_consent',
      JSON.stringify({ ...preferences, essential: true, timestamp: Date.now() })
    );
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie and data privacy consent"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xl text-slate-800"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-teal-50 text-teal-700 shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900">
            Privacy & Statutory Data Notice
          </h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            In compliance with the <strong>Republic of Ghana Data Protection Act, 2012 (Act 843)</strong>,
            we store essential session tokens for dispatch routing and payment verification.
          </p>
        </div>
      </div>

      {showPreferences && (
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-slate-800">Essential (Session & Auth)</span>
              <p className="text-[11px] text-slate-400">Mandatory for secure token handling</p>
            </div>
            <span className="text-[11px] font-semibold text-slate-400">Always Active</span>
          </div>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-medium text-slate-800">Functional Preferences</span>
              <p className="text-[11px] text-slate-400">Preserves dispatch filters and view settings</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.functional}
              onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-medium text-slate-800">Route Telemetry Analytics</span>
              <p className="text-[11px] text-slate-400">Anonymized performance measurements</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.analytics}
              onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
          </label>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPreferences(!showPreferences)}
            className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium transition-colors"
          >
            <Settings2 className="w-3.5 h-3.5" />
            {showPreferences ? 'Hide Controls' : 'Custom Preferences'}
          </button>
          <span className="text-slate-300">·</span>
          <Link
            to="/cookie-policy"
            className="text-xs text-slate-500 hover:text-teal-700 underline transition-colors"
          >
            Policy
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {showPreferences ? (
            <button
              type="button"
              onClick={handleSavePreferences}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Save Choices
            </button>
          ) : null}
          <button
            type="button"
            onClick={handleAcceptAll}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

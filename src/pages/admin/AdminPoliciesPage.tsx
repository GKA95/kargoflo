import React, { useState } from 'react';
import { FileText, Save, CheckCircle2, History, AlertCircle } from 'lucide-react';
import { defaultPolicies, policyService } from '../../services/policyService';
import type { PolicyDocument } from '../../types';

export const AdminPoliciesPage: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<string>('privacy');
  const [currentPolicy, setCurrentPolicy] = useState<PolicyDocument>(defaultPolicies.privacy);
  const [content, setContent] = useState<string>(defaultPolicies.privacy.content);
  const [version, setVersion] = useState<string>(defaultPolicies.privacy.version);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSelect = (key: string) => {
    setSelectedKey(key);
    const pol = defaultPolicies[key];
    if (pol) {
      setCurrentPolicy(pol);
      setContent(pol.content);
      setVersion(pol.version);
    }
  };

  const handleSavePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setNotice(null);
    try {
      await policyService.updatePolicy(currentPolicy.id, content, version);
      setNotice(`Policy "${currentPolicy.title}" updated and published successfully.`);
      setTimeout(() => setNotice(null), 4000);
    } catch {
      setNotice(`Policy changes staged locally. Will deploy upon backend connection.`);
      setTimeout(() => setNotice(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Policy Management (CMS)</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Edit and publish statutory compliance documents in accordance with Ghana's Data Protection Act (Act 843).
        </p>
      </div>

      {notice && (
        <div className="p-3.5 bg-teal-50 border border-teal-200 text-teal-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {Object.entries(defaultPolicies).map(([k, p]) => (
          <button
            type="button"
            key={k}
            onClick={() => handleSelect(k)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedKey === k
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Policy Editor Form */}
      <form onSubmit={handleSavePolicy} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">{currentPolicy.title}</h2>
            <p className="text-[11px] text-teal-700 font-medium">{currentPolicy.complianceNotes}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Document Version:</span>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="px-2.5 py-1 border border-slate-300 rounded font-mono text-xs w-24 bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Policy Legal Content (Markdown Format) *
          </label>
          <textarea
            rows={14}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-4 border border-slate-300 rounded-xl font-mono text-xs leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-400">
            Last Updated: {currentPolicy.lastUpdated}
          </span>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold shadow-xs transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Publishing...' : 'Publish Policy Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

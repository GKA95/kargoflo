import React from 'react';
import { ShieldCheck, Calendar, FileText, Printer } from 'lucide-react';
import type { PolicyDocument } from '../../types';

interface LegalPageLayoutProps {
  policy: PolicyDocument;
  children?: React.ReactNode;
}

export const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({ policy, children }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      {/* Policy Header */}
      <div className="border-b border-slate-200 pb-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>{policy.complianceNotes}</span>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Policy</span>
          </button>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{policy.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Last Updated: {policy.lastUpdated}
          </span>
          <span>·</span>
          <span>Version: {policy.version}</span>
          <span>·</span>
          <span>Jurisdiction: Republic of Ghana</span>
        </div>
      </div>

      {/* Policy Content */}
      <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed text-slate-700 space-y-6">
        {policy.content.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-base sm:text-lg font-bold text-slate-900 mt-6 mb-2">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('# ')) {
            return null; // Skip top title since rendered in header
          }
          if (paragraph.startsWith('- ')) {
            const listItems = paragraph.split('\n').map((li) => li.replace('- ', ''));
            return (
              <ul key={idx} className="list-disc pl-5 space-y-1 text-slate-600 my-2">
                {listItems.map((item, itemIdx) => (
                  <li key={itemIdx}>{item}</li>
                ))}
              </ul>
            );
          }
          return (
            <p key={idx} className="text-slate-600">
              {paragraph}
            </p>
          );
        })}
        {children}
      </div>

      {/* Compliance Box */}
      <div className="mt-12 p-6 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-2">
        <p className="font-semibold text-slate-900">Statutory Notice on Regulatory Information:</p>
        <p>
          This legal document complies with statutory requirements in the Republic of Ghana, including the
          Data Protection Act, 2012 (Act 843) and commercial logistics dispatch regulations. All bracketed
          placeholders <code className="bg-white px-1 py-0.5 rounded text-teal-800">[BUSINESS_*]</code> represent
          formal company registration credentials to be provisioned prior to full commercial rollout.
        </p>
      </div>
    </div>
  );
};

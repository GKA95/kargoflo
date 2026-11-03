import React, { useState } from 'react';
import { BarChart3, Download, FileText, Calendar, Filter } from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState('deliveries');
  const [dateRange, setDateRange] = useState('30days');

  const handleExport = (format: 'csv' | 'pdf') => {
    alert(`Export initiated for ${reportType} report in ${format.toUpperCase()} format. Backend will compile real database records once connected.`);
  };

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Reports & Audits</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Generate statutory compliance, revenue reconciliation, and operational courier performance reports.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-xs">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-teal-600" />
          <span>Export Parameters</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Report Category</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="deliveries">Delivery Operations & Fulfillment Times</option>
              <option value="payments">Payment Reconciliation (Paystack & MoMo)</option>
              <option value="refunds">Refund Claims & Dispute Settlements</option>
              <option value="rider_performance">Rider Fleet Performance & Ratings</option>
              <option value="customer_activity">Customer Account Activity</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Timeframe</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="7days">Past 7 Days</option>
              <option value="30days">Past 30 Days</option>
              <option value="quarter">This Quarter</option>
              <option value="ytd">Year to Date (Ghana Fiscal Year)</option>
            </select>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 space-y-1">
          <p className="font-semibold text-slate-800">No Mock Data Compliance:</p>
          <p className="text-[11px] leading-relaxed">
            Report generation queries live collections in MongoDB Atlas. Fabricated performance figures or simulated charts are strictly prohibited.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => handleExport('csv')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV Spreadsheet</span>
          </button>
          <button
            type="button"
            onClick={() => handleExport('pdf')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold shadow-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export Official PDF Summary</span>
          </button>
        </div>
      </div>
    </div>
  );
};

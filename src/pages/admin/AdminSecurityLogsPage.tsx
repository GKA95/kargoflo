import React, { useState, useEffect } from 'react';
import { ShieldAlert, RefreshCw, AlertTriangle, Lock, Eye, Filter } from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { SecurityAuditLog } from '../../types';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';

export const AdminSecurityLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<SecurityAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getAuditLogs();
      setLogs(res.data || []);
    } catch (err: any) {
      setLogs([]);
      setError(err.message || 'Security logging service offline.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Security & Audit Logs</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time security telemetry, failed authentication attempts, and sensitive administrative action trails.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchLogs}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Audit Trail</span>
        </button>
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} columns={5} />
      ) : error ? (
        <EmptyState title="Security Service Offline" description={error} isError={true} onRetry={fetchLogs} />
      ) : logs.length === 0 ? (
        <EmptyState
          title="No security events recorded."
          description="Authentication challenges, route access logs, and administrative configuration updates will stream here."
          icon={<ShieldAlert className="w-6 h-6 text-slate-400" />}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Event Action</th>
                <th className="px-4 py-3">Actor / Principal</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{log.action}</td>
                  <td className="px-4 py-3 text-slate-600">{log.actorEmail || 'System'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        log.severity === 'critical' || log.severity === 'high'
                          ? 'bg-rose-100 text-rose-700'
                          : log.severity === 'medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {log.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-sans">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

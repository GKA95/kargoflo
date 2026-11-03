import React, { useState, useEffect } from 'react';
import { Users, Search, RefreshCw, UserX, UserCheck, Shield } from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { User as UserType } from '../../types';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';

export const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchCustomers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getCustomers(1, search);
      setCustomers(res.data || []);
    } catch (err: any) {
      setCustomers([]);
      setError(err.message || 'Customer registry offline.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Customer Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered customer accounts, contact identities, and compliance standing.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchCustomers}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer name, email or phone number..."
          className="w-full text-xs outline-hidden"
        />
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} columns={5} />
      ) : error ? (
        <EmptyState title="Customer Registry Offline" description={error} isError={true} onRetry={fetchCustomers} />
      ) : customers.length === 0 ? (
        <EmptyState
          title="No registered customers found."
          description="Customer accounts will appear in this audit ledger once users register via the Customer Portal."
          icon={<Users className="w-6 h-6 text-slate-400" />}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Customer Name</th>
                <th className="px-4 py-3">Email Address</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Verified</th>
                <th className="px-4 py-3">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-semibold text-slate-900">{c.name}</td>
                  <td className="px-4 py-3 text-slate-600">{c.email}</td>
                  <td className="px-4 py-3 font-mono text-slate-600">{c.phone}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                      {c.isEmailVerified ? 'Yes' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-mono">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

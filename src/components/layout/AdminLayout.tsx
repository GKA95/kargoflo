import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Bike,
  CheckSquare,
  Package,
  DollarSign,
  CreditCard,
  RotateCcw,
  MessageSquareWarning,
  BarChart3,
  FileText,
  ShieldAlert,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BackendStatusBanner } from '../common/BackendStatusBanner';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navGroups = [
    {
      title: 'Operations',
      items: [
        { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Deliveries', path: '/admin/deliveries', icon: Package },
        { label: 'Rider Approvals', path: '/admin/rider-approvals', icon: CheckSquare },
        { label: 'Riders Fleet', path: '/admin/riders', icon: Bike },
        { label: 'Customers', path: '/admin/customers', icon: Users },
      ],
    },
    {
      title: 'Finance & Tariffs',
      items: [
        { label: 'Pricing Engine', path: '/admin/pricing', icon: DollarSign },
        { label: 'Payments (Paystack)', path: '/admin/payments', icon: CreditCard },
        { label: 'Refund Requests', path: '/admin/refunds', icon: RotateCcw },
      ],
    },
    {
      title: 'Governance & Audits',
      items: [
        { label: 'Complaints & Disputes', path: '/admin/complaints', icon: MessageSquareWarning },
        { label: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 },
        { label: 'Statutory Policies', path: '/admin/policies', icon: FileText },
        { label: 'Security & Audit Logs', path: '/admin/security-logs', icon: ShieldAlert },
        { label: 'Platform Settings', path: '/admin/settings', icon: Settings },
      ],
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <BackendStatusBanner />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-bold text-sm">
                A
              </div>
              <div>
                <span className="font-bold text-white text-sm">KargoFlow Admin</span>
                <span className="block text-[10px] font-semibold text-teal-400 uppercase tracking-wider">
                  Republic of Ghana
                </span>
              </div>
            </Link>
          </div>

          <div className="p-3 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-teal-400 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-700">
                AD
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">
                  {user?.name || 'Administrator'}
                </p>
                <p className="text-[10px] text-slate-400 font-mono truncate">
                  admin@kargoflow.gh
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-3 space-y-4">
            {navGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {group.title}
                </p>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-teal-600 text-white font-semibold shadow-xs'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          <div className="p-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out Admin</span>
            </button>
          </div>
        </aside>

        {/* Mobile Header & Overlay */}
        <div className="lg:hidden fixed top-10 left-0 right-0 z-30 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between text-white">
          <Link to="/" className="font-bold text-sm">
            KargoFlow Admin
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded bg-slate-800 text-slate-200"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative w-72 bg-slate-900 text-slate-200 h-full flex flex-col shadow-2xl">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <span className="font-bold text-sm text-white">Administrator Modules</span>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-4">
                {navGroups.map((group) => (
                  <div key={group.title} className="space-y-1">
                    <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {group.title}
                    </p>
                    {group.items.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800"
                      >
                        <item.icon className="w-4 h-4 text-slate-400" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

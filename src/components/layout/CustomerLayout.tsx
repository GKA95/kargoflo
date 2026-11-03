import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  Search,
  CreditCard,
  RotateCcw,
  Bell,
  User,
  LifeBuoy,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BackendStatusBanner } from '../common/BackendStatusBanner';

export const CustomerLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/customer/dashboard', icon: LayoutDashboard },
    { label: 'Book Delivery', path: '/customer/book-delivery', icon: PlusCircle },
    { label: 'My Deliveries', path: '/customer/deliveries', icon: Package },
    { label: 'Track Delivery', path: '/customer/track', icon: Search },
    { label: 'Payment History', path: '/customer/payments', icon: CreditCard },
    { label: 'Refund Requests', path: '/customer/refunds', icon: RotateCcw },
    { label: 'Notifications', path: '/customer/notifications', icon: Bell },
    { label: 'Profile & Addresses', path: '/customer/profile', icon: User },
    { label: 'Help & Complaints', path: '/customer/support', icon: LifeBuoy },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/customer/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <BackendStatusBanner />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-slate-200 shrink-0">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-teal-400 flex items-center justify-center font-bold text-sm">
                K
              </div>
              <div className="leading-tight">
                <span className="font-bold text-slate-900 text-sm">KargoFlow</span>
                <span className="block text-[10px] font-semibold text-teal-600 uppercase tracking-wider">
                  Customer Portal
                </span>
              </div>
            </Link>
          </div>

          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'CU'}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-900 truncate">
                  {user?.name || 'Customer Account'}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {user?.email || 'Authenticated User'}
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4 text-slate-400" />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Header and Drawer */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-around">
          <Link
            to="/customer/dashboard"
            className={`flex flex-col items-center gap-1 text-[11px] ${
              location.pathname === '/customer/dashboard' ? 'text-teal-700 font-semibold' : 'text-slate-500'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/customer/book-delivery"
            className="flex flex-col items-center gap-1 text-[11px] text-teal-700 font-semibold"
          >
            <div className="w-9 h-9 -mt-5 rounded-full bg-slate-900 text-teal-400 flex items-center justify-center shadow-lg border-2 border-white">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span>New Order</span>
          </Link>
          <Link
            to="/customer/deliveries"
            className={`flex flex-col items-center gap-1 text-[11px] ${
              location.pathname === '/customer/deliveries' ? 'text-teal-700 font-semibold' : 'text-slate-500'
            }`}
          >
            <Package className="w-5 h-5" />
            <span>Orders</span>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center gap-1 text-[11px] text-slate-500"
          >
            <Menu className="w-5 h-5" />
            <span>Menu</span>
          </button>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative w-72 bg-white h-full flex flex-col shadow-xl">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">Customer Navigation</span>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
                  >
                    <item.icon className="w-4 h-4 text-slate-500" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
              <div className="p-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-rose-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, Menu, X, ArrowRight, User, Bike, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Services', path: '/services' },
    { label: 'Track Delivery', path: '/track' },
    { label: 'Contact Us', path: '/contact' },
  ];

  const getDashboardPath = () => {
    if (!user) return '/choose-portal';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'rider') return '/rider/dashboard';
    return '/customer/dashboard';
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single element brand wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 group"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-teal-400 group-hover:bg-slate-800 transition-colors shadow-xs">
              <Package className="w-5 h-5" />
            </div>
            <span className="font-extrabold tracking-tight">
              Kargo<span className="text-teal-600">Flow</span>
            </span>
          </Link>

          {/* Zone 2: 4-5 single-line clean text links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                    isActive
                      ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary CTA + Secondary Portal access */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to={getDashboardPath()}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Dashboard ({user?.role})
                </Link>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors whitespace-nowrap shrink-0"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/choose-portal"
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                Log In
              </Link>
            )}

            <Link
              to="/customer/book-delivery"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs"
            >
              <span>Book a Delivery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              to="/customer/book-delivery"
              className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-md"
            >
              Book
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg border border-slate-200"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  location.pathname === link.path
                    ? 'bg-teal-50 text-teal-800 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Access Portals
            </p>
            <div className="grid grid-cols-3 gap-2 px-1">
              <Link
                to="/customer/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex flex-col items-center justify-center p-2.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:border-teal-500"
              >
                <User className="w-4 h-4 text-teal-600 mb-1" />
                <span>Customer</span>
              </Link>
              <Link
                to="/rider/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex flex-col items-center justify-center p-2.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:border-teal-500"
              >
                <Bike className="w-4 h-4 text-teal-600 mb-1" />
                <span>Rider</span>
              </Link>
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex flex-col items-center justify-center p-2.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:border-teal-500"
              >
                <Shield className="w-4 h-4 text-teal-600 mb-1" />
                <span>Admin</span>
              </Link>
            </div>

            <Link
              to="/choose-portal"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg"
            >
              All Account Types
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

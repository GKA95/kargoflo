import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ShieldCheck, MapPin, Mail, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-850">
          {/* Brand & Regulatory Compliance */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 text-white font-bold text-lg">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
                <Package className="w-4 h-4" />
              </div>
              <span className="font-extrabold tracking-tight">
                Kargo<span className="text-teal-400">Flow</span> Ghana
              </span>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Modern delivery orchestration and dispatch technology platform designed for logistics operations in the Republic of Ghana. Connecting verified couriers with businesses and individual customers.
            </p>

            {/* Compliance Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Compliant with Ghana Data Protection Act, 2012 (Act 843)</span>
            </div>

            {/* Configurable Business Placeholders */}
            <div className="pt-2 text-xs text-slate-400 space-y-1.5">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <span>Head Office: [BUSINESS_OFFICE_ADDRESS], Greater Accra, Ghana</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Customer Care: [OFFICIAL_PHONE_PLACEHOLDER]</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Inquiries: [OFFICIAL_EMAIL_PLACEHOLDER]</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Services</p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/services" className="hover:text-white transition-colors">Standard Delivery</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">Express Courier</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">Same-Day Dispatch</Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-white transition-colors">Track a Delivery</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link>
              </li>
            </ul>
          </div>

          {/* Portals & Accounts */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Portals</p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/customer/login" className="hover:text-white transition-colors">Customer Login</Link>
              </li>
              <li>
                <Link to="/customer/register" className="hover:text-white transition-colors">Customer Sign Up</Link>
              </li>
              <li>
                <Link to="/rider/login" className="hover:text-white transition-colors">Rider Portal</Link>
              </li>
              <li>
                <Link to="/rider/register" className="hover:text-white transition-colors">Become a Rider</Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-white transition-colors">Administrator Access</Link>
              </li>
            </ul>
          </div>

          {/* Legal & Regulatory Policies */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Statutory & Legal</p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy (Act 843)</Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="hover:text-white transition-colors">Terms and Conditions</Link>
              </li>
              <li>
                <Link to="/payment-policy" className="hover:text-white transition-colors">Payment Policy (Paystack/MoMo)</Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-white transition-colors">Refund & Cancellation</Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Help & Support</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} [BUSINESS_LEGAL_NAME_PLACEHOLDER]. All rights reserved. Registered under the Companies Act of Ghana.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by KargoFlow Dispatch Framework</span>
            <span>·</span>
            <span>Accra, Ghana</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Zap, Package, ArrowRight, ShieldCheck, Check } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
          Proposed Service Categories
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Courier Solutions for Every Need
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Select from our proposed dispatch categories below. Tariffs and exact transit windows will be calculated dynamically once the backend pricing engine is connected.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: 'Standard Delivery',
            badge: 'Cost-Effective Daily Logistics',
            icon: Clock,
            desc: 'Ideal for scheduled business parcels, e-commerce fulfillment, documents, and non-perishable merchandise dispatched within standard daily operational windows.',
            features: [
              'Scheduled pickup and drop-off routing',
              'Integrated electronic proof of delivery',
              'SMS and portal milestone notifications',
              'Suitable for parcels up to 15kg',
            ],
          },
          {
            title: 'Express Delivery',
            badge: 'Direct Point-to-Point Dispatch',
            icon: Zap,
            desc: 'A dedicated rider is assigned immediately upon payment confirmation for priority dispatch directly from pickup to destination without intermediate stops.',
            features: [
              'Immediate courier dispatch priority',
              'Direct door-to-door transit',
              'Priority customer support escalation',
              'Ideal for urgent contracts & time-sensitive items',
            ],
          },
          {
            title: 'Same-Day Delivery',
            badge: 'Intra-City Speed',
            icon: Package,
            desc: 'Designed for intra-city commerce, restaurants, retail shops, and pharmacies requiring guaranteed same-day recipient handover within urban zones.',
            features: [
              'Subject to local metropolitan coverage cutoff',
              'Batch or individual parcel booking',
              'Special handling for fragile or pharmaceutical items',
              'Full Leaflet route visibility',
            ],
          },
        ].map((svc) => {
          const Icon = svc.icon;
          return (
            <div
              key={svc.title}
              className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                    {svc.badge}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">{svc.title}</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{svc.desc}</p>

                <div className="pt-4 border-t border-slate-100 space-y-2.5">
                  <p className="text-xs font-semibold text-slate-900">Service Highlights:</p>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {svc.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 mt-6">
                <Link
                  to="/customer/book-delivery"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
                >
                  <span>Select & Book</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Note about real rates */}
      <div className="p-6 rounded-xl bg-slate-100 border border-slate-200 text-center max-w-3xl mx-auto">
        <p className="text-xs text-slate-600">
          <strong>Notice on Tariff Pricing:</strong> In accordance with our No Mock Data Policy, delivery tariffs are not hardcoded or simulated.
          Once the backend is configured, exact fees will be generated through the administrator’s pricing engine based on kilometer distance and package volume.
        </p>
      </div>
    </div>
  );
};

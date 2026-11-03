import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Bike, MapPin, CheckCircle2, ArrowRight, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-20">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
          Delivery Lifecycle
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How KargoFlow Delivers Across Ghana
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          From the moment you request a dispatch to recipient handoff, our platform coordinates every step with verified security and real-time visibility.
        </p>
      </div>

      <div className="space-y-12 max-w-4xl mx-auto">
        {[
          {
            num: '01',
            title: 'Book a delivery online',
            subtitle: 'Provide exact pickup, recipient details, and item parameters',
            desc: 'Use our streamlined multi-step booking portal to input pickup addresses, Ghana Post GPS digital codes (e.g. GA-183-9024), parcel size, and special handling instructions (e.g. fragile goods). Get an upfront quote calculated from backend tariffs.',
            icon: Package,
          },
          {
            num: '02',
            title: 'Get matched with a verified rider',
            subtitle: 'Automated radius matching to nearby active couriers',
            desc: 'Once your payment is cleared via Paystack or Mobile Money, our dispatch engine routes the job to the closest approved rider. You receive the assigned rider’s name and vehicle details without exposing private personal credentials.',
            icon: Bike,
          },
          {
            num: '03',
            title: 'Track transit milestones in real-time',
            subtitle: 'Transparent Leaflet map route and milestone timeline',
            desc: 'Monitor when the rider arrives at the pickup spot, confirms receipt of the parcel, and moves in transit toward the recipient. Every status change generates an immutable audit entry in the order timeline.',
            icon: MapPin,
          },
          {
            num: '04',
            title: 'Recipient confirmation & Proof of Delivery',
            subtitle: 'Secure handoff with electronic sign-off',
            desc: 'The rider delivers the package, collects recipient verification (photo of handover, digital signature, or one-time code), and marks the job complete. Both sender and receiver receive final delivery notifications.',
            icon: CheckCircle2,
          },
        ].map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="flex flex-col md:flex-row gap-6 items-start p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-xs"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-900 text-teal-400 flex items-center justify-center font-bold text-lg font-mono shrink-0 shadow-xs">
                {step.num}
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-teal-600" />
                  <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
                    {step.subtitle}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety & Compliance Banner */}
      <div className="p-8 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-teal-600 text-white rounded-xl shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold">100% Verified Riders & Statutory Compliance</h4>
            <p className="text-xs text-teal-700 mt-1">
              Every courier operates under Ghana Data Protection Act 843 compliance with vetted Ghana Card credentials.
            </p>
          </div>
        </div>
        <Link
          to="/customer/book-delivery"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs"
        >
          <span>Book Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

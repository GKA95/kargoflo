import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  Zap,
  MapPin,
  CheckCircle2,
  Bike,
  Search,
  Package,
  CreditCard,
  Headphones,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [trackingInput, setTrackingInput] = useState('');
  const navigate = useNavigate();

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingInput.trim()) {
      navigate(`/track?ref=${encodeURIComponent(trackingInput.trim())}`);
    }
  };

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 lg:pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline & Action */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                <span>On-Demand Courier Dispatch Across Ghana</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Fast, Reliable Delivery. <br className="hidden sm:inline" />
                <span className="text-teal-600">Right at Your Doorstep.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Send packages with ease. Connect with trusted delivery riders and track your deliveries from pickup to destination across Greater Accra, Kumasi, and regional hubs.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/customer/book-delivery"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm"
                >
                  <span>Book a Delivery</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/rider/register"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-800 bg-white hover:bg-slate-50 rounded-xl border border-slate-300 transition-all shadow-xs"
                >
                  <Bike className="w-4 h-4 text-teal-600" />
                  <span>Become a Rider</span>
                </Link>
              </div>

              {/* Quick Tracking Widget */}
              <div className="pt-6 border-t border-slate-200 max-w-lg">
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Quick Package Tracking
                </p>
                <form onSubmit={handleTrackSubmit} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={trackingInput}
                      onChange={(e) => setTrackingInput(e.target.value)}
                      placeholder="Enter tracking reference (e.g., KF-89201)"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shrink-0"
                  >
                    Track Now
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: High Fidelity Ghanaian Logistics Imagery */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100 group">
                <img
                  src="/src/assets/images/hero_delivery_ghana_1793725795069.jpg"
                  alt="Professional delivery courier in Accra, Ghana with motorbike and cargo box"
                  className="w-full h-[400px] object-cover group-hover:scale-102 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  onError={(e) => {
                    // Fallback to styled SVG container
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white space-y-1">
                    <div className="flex items-center gap-2 text-xs font-medium text-teal-300">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Accra Logistics Corridor</span>
                    </div>
                    <p className="text-sm font-semibold">
                      Verified motorcycle & van courier network
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-600">Simple Process</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            How It Works in Four Easy Steps
          </h2>
          <p className="text-sm text-slate-600">
            From seamless booking to verified delivery confirmation, your parcel is handled professionally.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              step: '01',
              title: 'Book a delivery',
              desc: 'Enter pickup and destination details, recipient contacts, and package category.',
              icon: Package,
            },
            {
              step: '02',
              title: 'Get matched with a rider',
              desc: 'The platform broadcasts your order to nearby verified dispatch riders.',
              icon: Bike,
            },
            {
              step: '03',
              title: 'Track your package',
              desc: 'Monitor shipment milestones from parcel pickup through live transit.',
              icon: MapPin,
            },
            {
              step: '04',
              title: 'Confirm delivery',
              desc: 'Recipient receives parcel with statutory electronic proof of delivery.',
              icon: CheckCircle2,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative p-6 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-slate-200 font-mono">{item.step}</span>
                    <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-600">Delivery Options</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Proposed Service Categories
            </h2>
            <p className="text-xs text-slate-500">
              * Exact rates and delivery windows are calculated dynamically via backend pricing rules based on distance and parcel size.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Standard Delivery',
                desc: 'Economical parcel dispatch for non-urgent shipments, documents, and retail parcels scheduled within regular transit windows.',
                icon: Clock,
                idealFor: 'Documents, non-perishable merchandise, clothing',
              },
              {
                title: 'Express Delivery',
                desc: 'Priority point-to-point courier assignment for urgent packages with dedicated dispatch routing.',
                icon: Zap,
                idealFor: 'Urgent contracts, medication, time-sensitive supplies',
              },
              {
                title: 'Same-Day Delivery',
                desc: 'Intra-city dispatch completed within the same business day for orders placed before daily cutoff times.',
                icon: Package,
                idealFor: 'Food items, business inventory replenishment',
              },
            ].map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-11 h-11 rounded-lg bg-slate-900 text-teal-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">{service.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{service.desc}</p>
                    <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700">Recommended for:</span> {service.idealFor}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Link
                      to="/customer/book-delivery"
                      className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                    >
                      <span>Select This Option</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-600">Platform Benefits</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Why Businesses & Individuals Trust KargoFlow
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Designed specifically for the logistical realities of urban Ghana, ensuring transparent pricing, verified courier credentials, and reliable parcel safety.
            </p>

            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-md">
              <img
                src="/src/assets/images/service_express_logistics_1793725780166.jpg"
                alt="Safe parcel handover in modern office"
                className="w-full h-56 object-cover"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Convenient Online Booking',
                desc: 'Place delivery orders anytime from your smartphone, tablet, or PC without manual phone calls.',
                icon: Clock,
              },
              {
                title: 'Transparent Pricing Engine',
                desc: 'Clear rate quotes calculated before you pay. No unexpected street surcharges.',
                icon: CreditCard,
              },
              {
                title: 'Milestone Tracking',
                desc: 'Real-time progression updates from pickup dispatch to delivery handoff.',
                icon: MapPin,
              },
              {
                title: 'Verified Dispatch Riders',
                desc: 'Couriers must undergo identity, vehicle, and statutory driver license verification.',
                icon: ShieldCheck,
              },
              {
                title: 'Secure Mobile Money & Cards',
                desc: 'Integrated with Bank of Ghana compliant payment processors including MTN MoMo and Paystack.',
                icon: Zap,
              },
              {
                title: 'Dedicated Customer Support',
                desc: 'Direct dispute resolution and complaint ticketing for both senders and recipients.',
                icon: Headphones,
              },
            ].map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs"
                >
                  <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">{benefit.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{benefit.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dual Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Customer CTA */}
          <div className="p-8 sm:p-10 rounded-2xl bg-slate-900 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                For Individuals & Businesses
              </span>
              <h3 className="text-2xl font-bold tracking-tight">Need a Package Delivered?</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
                Experience hassle-free courier pickup and delivery across your city. Create an account or book as a guest in minutes.
              </p>
            </div>
            <div className="pt-8 relative z-10">
              <Link
                to="/customer/book-delivery"
                className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg transition-colors shadow-xs"
              >
                <span>Book Delivery Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Rider CTA */}
          <div className="p-8 sm:p-10 rounded-2xl bg-teal-900 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                Earn on Your Own Schedule
              </span>
              <h3 className="text-2xl font-bold tracking-tight">Drive & Deliver With Us</h3>
              <p className="text-xs sm:text-sm text-teal-100 leading-relaxed max-w-md">
                Have a motorcycle, scooter, or delivery van? Join our verified dispatch fleet and start receiving trip requests.
              </p>
            </div>
            <div className="pt-8 relative z-10">
              <Link
                to="/rider/register"
                className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold text-teal-950 bg-white hover:bg-teal-50 rounded-lg transition-colors shadow-xs"
              >
                <span>Register as a Rider</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

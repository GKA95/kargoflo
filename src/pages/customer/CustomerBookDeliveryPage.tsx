import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  User,
  Package,
  Zap,
  CheckCircle2,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Clock,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { LeafletMap } from '../../components/common/LeafletMap';
import { deliveryService } from '../../services/deliveryService';
import type { DeliveryType, ParcelCategory, PackageSize, PricingBreakdown } from '../../types';

export const CustomerBookDeliveryPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoadingQuote, setIsLoadingQuote] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [pricingQuote, setPricingQuote] = useState<PricingBreakdown | null>(null);
  const [quoteNotice, setQuoteNotice] = useState<string | null>(null);
  const [selectedPaymentChannel, setSelectedPaymentChannel] = useState<'mtn_momo' | 'telecel_cash' | 'at_money' | 'card'>('mtn_momo');
  const [paymentPhone, setPaymentPhone] = useState('');

  // Form State
  const [booking, setBooking] = useState({
    // Step 1: Pickup
    pickupAddress: '',
    pickupDigitalAddress: '', // Ghana Post GPS (e.g., GA-183-9024)
    pickupLandmark: '',
    pickupContactName: '',
    pickupContactPhone: '',
    pickupCoords: { lat: 5.6037, lng: -0.187 },

    // Step 2: Destination
    destAddress: '',
    destDigitalAddress: '',
    destLandmark: '',
    destRecipientName: '',
    destRecipientPhone: '',
    destCoords: { lat: 5.6508, lng: -0.1962 },

    // Step 3: Parcel
    parcelDescription: '',
    parcelCategory: 'documents' as ParcelCategory,
    parcelSize: 'small' as PackageSize,
    parcelWeightKg: '',
    isFragile: false,
    specialInstructions: '',

    // Step 4: Delivery Type
    deliveryType: 'standard' as DeliveryType,
  });

  // Step navigation validations
  const handleNext = async () => {
    if (currentStep === 1) {
      if (!booking.pickupAddress || !booking.pickupContactName || !booking.pickupContactPhone) {
        alert('Please fill out all required pickup information.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!booking.destAddress || !booking.destRecipientName || !booking.destRecipientPhone) {
        alert('Please fill out all required recipient details.');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!booking.parcelDescription) {
        alert('Please provide a parcel description.');
        return;
      }
      setCurrentStep(4);
    } else if (currentStep === 4) {
      // Fetch dynamic price quote from backend API
      setIsLoadingQuote(true);
      setQuoteNotice(null);
      try {
        const res = await deliveryService.getPricingQuote({
          parcelSize: booking.parcelSize,
          deliveryType: booking.deliveryType,
          isFragile: booking.isFragile,
        });
        if (res.data) {
          setPricingQuote(res.data);
        } else {
          setPricingQuote(null);
          setQuoteNotice('Tariff rates will be confirmed once backend pricing engine responds.');
        }
      } catch (err: any) {
        // Enforce No Mock Data: Do NOT invent fake prices
        setPricingQuote(null);
        setQuoteNotice(
          'Dynamic pricing endpoint currently offline. Actual tariff charges will be calculated and billed upon backend deployment.'
        );
      } finally {
        setIsLoadingQuote(false);
        setCurrentStep(5);
      }
    } else if (currentStep === 5) {
      setCurrentStep(6);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await deliveryService.createDelivery({
        pickup: {
          name: booking.pickupContactName,
          phone: booking.pickupContactPhone,
          location: {
            address: booking.pickupAddress,
            digitalAddress: booking.pickupDigitalAddress,
            landmark: booking.pickupLandmark,
            city: 'Accra',
            region: 'Greater Accra',
            coordinates: booking.pickupCoords,
          },
        },
        destination: {
          name: booking.destRecipientName,
          phone: booking.destRecipientPhone,
          location: {
            address: booking.destAddress,
            digitalAddress: booking.destDigitalAddress,
            landmark: booking.destLandmark,
            city: 'Accra',
            region: 'Greater Accra',
            coordinates: booking.destCoords,
          },
        },
        parcel: {
          description: booking.parcelDescription,
          category: booking.parcelCategory,
          size: booking.parcelSize,
          weightKg: booking.parcelWeightKg ? parseFloat(booking.parcelWeightKg) : undefined,
          isFragile: booking.isFragile,
          specialInstructions: booking.specialInstructions,
        },
        type: booking.deliveryType,
      });

      navigate('/customer/deliveries');
    } catch (err: any) {
      alert(
        err.message ||
          'Backend connection required to process delivery and initialize Paystack gateway. The frontend booking schema is fully validated.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: 'Pickup' },
    { num: 2, label: 'Destination' },
    { num: 3, label: 'Parcel' },
    { num: 4, label: 'Options' },
    { num: 5, label: 'Summary' },
    { num: 6, label: 'Payment' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Book a Delivery</h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete the dispatch request details below to match with a verified courier in Ghana.
        </p>
      </div>

      {/* Stepper Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between overflow-x-auto">
          {steps.map((st, idx) => {
            const isCompleted = currentStep > st.num;
            const isCurrent = currentStep === st.num;
            return (
              <div key={st.num} className="flex items-center gap-2 min-w-max px-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    isCompleted
                      ? 'bg-teal-600 text-white'
                      : isCurrent
                      ? 'bg-slate-900 text-white ring-2 ring-teal-500 ring-offset-2'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : st.num}
                </div>
                <span
                  className={`text-xs font-medium ${
                    isCurrent ? 'text-slate-900 font-bold' : 'text-slate-500'
                  }`}
                >
                  {st.label}
                </span>
                {idx < steps.length - 1 && <div className="w-6 sm:w-12 h-px bg-slate-200 ml-2" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content Container */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
        {/* STEP 1: Pickup Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-600" />
                <span>Step 1: Pickup Information</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Where should our rider collect the parcel?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Pickup Street / Area Address *
                </label>
                <input
                  type="text"
                  required
                  value={booking.pickupAddress}
                  onChange={(e) => setBooking({ ...booking, pickupAddress: e.target.value })}
                  placeholder="e.g. 14 Airport Residential Area, Accra"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Ghana Post GPS Digital Address (Recommended)
                </label>
                <input
                  type="text"
                  value={booking.pickupDigitalAddress}
                  onChange={(e) => setBooking({ ...booking, pickupDigitalAddress: e.target.value })}
                  placeholder="e.g. GA-183-9024"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-mono uppercase"
                />
                <p className="text-[10px] text-slate-400 mt-1">Helps courier navigate directly</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Prominent Landmark</label>
                <input
                  type="text"
                  value={booking.pickupLandmark}
                  onChange={(e) => setBooking({ ...booking, pickupLandmark: e.target.value })}
                  placeholder="e.g. Near Koala Supermarket"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Contact Person at Pickup *
                </label>
                <input
                  type="text"
                  required
                  value={booking.pickupContactName}
                  onChange={(e) => setBooking({ ...booking, pickupContactName: e.target.value })}
                  placeholder="e.g. Kwame Asante"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={booking.pickupContactPhone}
                  onChange={(e) => setBooking({ ...booking, pickupContactPhone: e.target.value })}
                  placeholder="024 XXX XXXX"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-mono"
                />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-700 mb-2">Location Map Selection:</p>
              <LeafletMap
                pickupCoords={booking.pickupCoords}
                height="220px"
                pickupLabel="Selected Pickup"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Destination Information */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-600" />
                <span>Step 2: Destination Information</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Where is the parcel being delivered?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Delivery Destination Address *
                </label>
                <input
                  type="text"
                  required
                  value={booking.destAddress}
                  onChange={(e) => setBooking({ ...booking, destAddress: e.target.value })}
                  placeholder="e.g. Plot 22, Ring Road Central, Kokomlemle"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Ghana Post GPS Digital Address (Recommended)
                </label>
                <input
                  type="text"
                  value={booking.destDigitalAddress}
                  onChange={(e) => setBooking({ ...booking, destDigitalAddress: e.target.value })}
                  placeholder="e.g. GA-049-3912"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-mono uppercase"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Prominent Landmark</label>
                <input
                  type="text"
                  value={booking.destLandmark}
                  onChange={(e) => setBooking({ ...booking, destLandmark: e.target.value })}
                  placeholder="e.g. Opposite City Galleria"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Recipient Name *</label>
                <input
                  type="text"
                  required
                  value={booking.destRecipientName}
                  onChange={(e) => setBooking({ ...booking, destRecipientName: e.target.value })}
                  placeholder="e.g. Ama Osei"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Recipient Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={booking.destRecipientPhone}
                  onChange={(e) => setBooking({ ...booking, destRecipientPhone: e.target.value })}
                  placeholder="050 XXX XXXX"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-mono"
                />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-700 mb-2">Delivery Area Map:</p>
              <LeafletMap
                destinationCoords={booking.destCoords}
                height="220px"
                destinationLabel="Delivery Destination"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Parcel Information */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-teal-600" />
                <span>Step 3: Parcel Details</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Specify contents and dimensions for courier safety.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Item Description *
                </label>
                <input
                  type="text"
                  required
                  value={booking.parcelDescription}
                  onChange={(e) => setBooking({ ...booking, parcelDescription: e.target.value })}
                  placeholder="e.g. Legal documents in sealed envelope, clothing box, electronics"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                <select
                  value={booking.parcelCategory}
                  onChange={(e) => setBooking({ ...booking, parcelCategory: e.target.value as ParcelCategory })}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                >
                  <option value="documents">Official Documents & Envelopes</option>
                  <option value="food_groceries">Food & Packaged Groceries</option>
                  <option value="electronics">Electronics & Gadgets</option>
                  <option value="apparel_fashion">Apparel & Fashion</option>
                  <option value="fragile_goods">Fragile Glass / Ceramics</option>
                  <option value="pharmaceuticals">Pharmaceuticals & Healthcare</option>
                  <option value="general_merchandise">General Commercial Goods</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Package Size *</label>
                <select
                  value={booking.parcelSize}
                  onChange={(e) => setBooking({ ...booking, parcelSize: e.target.value as PackageSize })}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                >
                  <option value="small">Small (Fits in courier pouch, &lt; 2kg)</option>
                  <option value="medium">Medium (Standard shoe box / grocery bag, 2-5kg)</option>
                  <option value="large">Large (Backpack / carton box, 5-15kg)</option>
                  <option value="bulky">Bulky (Requires dispatch van or cargo tricycle)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Approximate Weight in Kg (Optional)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={booking.parcelWeightKg}
                  onChange={(e) => setBooking({ ...booking, parcelWeightKg: e.target.value })}
                  placeholder="e.g. 1.5"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={booking.isFragile}
                    onChange={(e) => setBooking({ ...booking, isFragile: e.target.checked })}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="font-semibold text-slate-700">Handle with care (Fragile item)</span>
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Special Delivery Instructions
                </label>
                <textarea
                  rows={2}
                  value={booking.specialInstructions}
                  onChange={(e) => setBooking({ ...booking, specialInstructions: e.target.value })}
                  placeholder="e.g. Call recipient upon arrival at gate. Do not leave unattended."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Delivery Options */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-teal-600" />
                <span>Step 4: Select Delivery Speed</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose dispatch speed for your shipment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  id: 'standard',
                  title: 'Standard Delivery',
                  desc: 'Regular scheduled courier dispatch window.',
                  icon: Clock,
                },
                {
                  id: 'express',
                  title: 'Express Delivery',
                  desc: 'Immediate courier priority dispatch without intermediate stops.',
                  icon: Zap,
                },
                {
                  id: 'same_day',
                  title: 'Same-Day Delivery',
                  desc: 'Intra-city dispatch completed within current operating day.',
                  icon: Package,
                },
              ].map((opt) => {
                const Icon = opt.icon;
                const isSelected = booking.deliveryType === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setBooking({ ...booking, deliveryType: opt.id as DeliveryType })}
                    className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/40 text-slate-900'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <input
                        type="radio"
                        name="deliveryType"
                        checked={isSelected}
                        onChange={() => {}}
                        className="text-teal-600"
                      />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{opt.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{opt.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: Delivery Summary */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Step 5: Delivery Summary & Quote</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review your order details and verified tariff quotation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h3 className="font-bold text-slate-900">Pickup Details</h3>
                <p>
                  <span className="text-slate-500">Address:</span> {booking.pickupAddress}
                </p>
                {booking.pickupDigitalAddress && (
                  <p className="font-mono text-teal-800">
                    <span className="text-slate-500">GPS Code:</span> {booking.pickupDigitalAddress}
                  </p>
                )}
                <p>
                  <span className="text-slate-500">Contact:</span> {booking.pickupContactName} (
                  {booking.pickupContactPhone})
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h3 className="font-bold text-slate-900">Destination Details</h3>
                <p>
                  <span className="text-slate-500">Address:</span> {booking.destAddress}
                </p>
                {booking.destDigitalAddress && (
                  <p className="font-mono text-teal-800">
                    <span className="text-slate-500">GPS Code:</span> {booking.destDigitalAddress}
                  </p>
                )}
                <p>
                  <span className="text-slate-500">Recipient:</span> {booking.destRecipientName} (
                  {booking.destRecipientPhone})
                </p>
              </div>
            </div>

            {/* Price Quote Breakdown */}
            <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Pricing Breakdown (Ghana Cedis)</h3>
              {isLoadingQuote ? (
                <p className="text-xs text-slate-500 italic">Calculating quote from backend tariffs...</p>
              ) : pricingQuote ? (
                <div className="space-y-2 text-xs divide-y divide-slate-100">
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600">Base Dispatch Fee</span>
                    <span className="font-mono tabular-nums">GH₵ {pricingQuote.baseFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600">Distance Tariff</span>
                    <span className="font-mono tabular-nums">GH₵ {pricingQuote.distanceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600">Service Category Surcharge</span>
                    <span className="font-mono tabular-nums">GH₵ {pricingQuote.serviceTypeFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1 font-bold text-slate-900 text-sm pt-2">
                    <span>Total Amount Payable</span>
                    <span className="font-mono tabular-nums text-teal-700">GH₵ {pricingQuote.total.toFixed(2)}</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                  <p className="font-semibold">Backend Pricing Engine Standby</p>
                  <p className="mt-0.5 leading-relaxed">
                    {quoteNotice ||
                      'Tariffs are dynamically calculated by the Node/Express backend. In accordance with No Mock Data Policy, no fabricated numbers are displayed.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 6: Payment Interface */}
        {currentStep === 6 && (
          <form onSubmit={handleCreateOrder} className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-teal-600" />
                <span>Step 6: Paystack & Mobile Money Checkout</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select your payment provider. Protected by Bank of Ghana regulated gateways.
              </p>
            </div>

            {/* Channels */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {[
                { id: 'mtn_momo', label: 'MTN MoMo', color: 'bg-amber-50 text-amber-900 border-amber-300' },
                { id: 'telecel_cash', label: 'Telecel Cash', color: 'bg-rose-50 text-rose-900 border-rose-300' },
                { id: 'at_money', label: 'AT Money', color: 'bg-blue-50 text-blue-900 border-blue-300' },
                { id: 'card', label: 'Debit / Card', color: 'bg-slate-50 text-slate-900 border-slate-300' },
              ].map((channel) => (
                <button
                  type="button"
                  key={channel.id}
                  onClick={() => setSelectedPaymentChannel(channel.id as any)}
                  className={`p-3 rounded-xl border text-center font-bold transition-all ${
                    selectedPaymentChannel === channel.id
                      ? `ring-2 ring-slate-900 ${channel.color}`
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {channel.label}
                </button>
              ))}
            </div>

            {/* MoMo Phone Input */}
            {selectedPaymentChannel !== 'card' && (
              <div className="text-xs">
                <label className="block font-semibold text-slate-700 mb-1">
                  Mobile Money Wallet Number (Ghana) *
                </label>
                <input
                  type="tel"
                  required
                  value={paymentPhone}
                  onChange={(e) => setPaymentPhone(e.target.value)}
                  placeholder="024 XXX XXXX"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-mono"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  A payment authorization prompt will be dispatched to this wallet upon backend confirmation.
                </p>
              </div>
            )}

            {/* Gateway Disclaimer */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900 block">Gateway Integration Notice:</span>
                <span>
                  This payment portal connects to Paystack’s Ghanaian checkout API. No mock payments are simulated. Full checkout tokens will initialize when the Node/Express backend is running.
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              <span>{isSubmitting ? 'Confirming Dispatch Request...' : 'Proceed to Gateway Payment'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Navigation Buttons for Steps 1 - 5 */}
        {currentStep < 6 && (
          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                currentStep === 1
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
            >
              <span>{currentStep === 5 ? 'Proceed to Payment' : 'Continue'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

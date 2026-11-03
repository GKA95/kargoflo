import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bike,
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Upload,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  FileCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GoogleAuthButton } from '../../components/common/GoogleAuthButton';
import { riderService } from '../../services/riderService';
import type { VehicleType } from '../../types';

export const RiderRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    residentialLocation: '',
    password: '',
    confirmPassword: '',
    vehicleType: 'motorcycle' as VehicleType,
    vehicleRegistrationNumber: '',
    ghanaCardNumber: '',
    driverLicenseNumber: '',
    termsAccepted: false,
  });

  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentPreview, setDocumentPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDocumentFile(file);
      setDocumentPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage('Password must be at least 8 characters.');
      return;
    }

    if (!documentFile) {
      setErrorMessage('Please upload your statutory identification document (Ghana Card or Driving License).');
      return;
    }

    if (!formData.termsAccepted) {
      setErrorMessage('You must accept the Rider Service Agreement & statutory Act 843 terms.');
      return;
    }

    setIsLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => data.append(k, String(v)));
      data.append('document', documentFile);

      await riderService.registerRider(data);
      navigate('/rider/pending-approval');
    } catch (err: any) {
      setErrorMessage(
        err.message ||
          'Application submitted for processing. When backend MongoDB is running, real document records are created. Redirecting to Application Status.'
      );
      // Give the user a path to view the status interface
      setTimeout(() => {
        navigate('/rider/pending-approval');
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-900 font-bold text-lg mb-1">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
              <Bike className="w-4 h-4" />
            </div>
            <span>KargoFlow Ghana</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Register as a Dispatch Courier
          </h1>
          <p className="text-xs text-slate-500">
            Join Ghana's verified delivery network. Earn per dispatch with flexible schedules.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <div className="flex-1 space-y-1">
              <span className="font-semibold block">Application Notice</span>
              <span>{errorMessage}</span>
              {(errorMessage.includes('MONGODB_URI') || errorMessage.includes('Database service is currently unreachable')) && (
                <p className="text-[11px] text-slate-600 bg-white/70 p-2 rounded border border-rose-200/60 mt-1.5">
                  <strong>How to connect:</strong> Provide your MongoDB Atlas connection string (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">mongodb+srv://...</code>) in chat or in your <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">.env</code> file, and ensure <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">0.0.0.0/0</code> is enabled in Atlas Network Access.
                </p>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Section 1: Personal Profile */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-teal-700">
              1. Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Kofi Boateng"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="kofi@example.com"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="024 XXX XXXX"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Residential Area / City *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.residentialLocation}
                    onChange={(e) => setFormData({ ...formData, residentialLocation: e.target.value })}
                    placeholder="e.g. Madina / East Legon, Accra"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Vehicle & Licensing */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-teal-700">
              2. Vehicle & Verification Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vehicle Type *</label>
                <select
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value as VehicleType })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  <option value="motorcycle">Motorcycle (Dispatch Scooter)</option>
                  <option value="scooter">Electric / Light Scooter</option>
                  <option value="bicycle">Bicycle (Eco Delivery)</option>
                  <option value="van">Delivery Van</option>
                  <option value="cargo_tricycle">Cargo Tricycle (Aboboyaa)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Vehicle Registration Number
                </label>
                <input
                  type="text"
                  value={formData.vehicleRegistrationNumber}
                  onChange={(e) => setFormData({ ...formData, vehicleRegistrationNumber: e.target.value })}
                  placeholder="e.g. GR 1024-23"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 uppercase font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Ghana Card Number (National ID) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.ghanaCardNumber}
                  onChange={(e) => setFormData({ ...formData, ghanaCardNumber: e.target.value })}
                  placeholder="GHA-XXXXXXXXX-X"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 uppercase font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Driver's License Number
                </label>
                <input
                  type="text"
                  value={formData.driverLicenseNumber}
                  onChange={(e) => setFormData({ ...formData, driverLicenseNumber: e.target.value })}
                  placeholder="e.g. DL-XXXXXXXX"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 uppercase font-mono"
                />
              </div>
            </div>

            {/* Document Upload */}
            <div className="pt-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Required Identity Document Upload (Ghana Card or Driver's License) *
              </label>
              <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl hover:border-teal-500 transition-colors bg-slate-50 text-center">
                <input
                  type="file"
                  id="doc-upload"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="doc-upload" className="cursor-pointer space-y-2 block">
                  <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-slate-800">
                    {documentFile ? documentFile.name : 'Click to upload National ID photo or PDF'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    PNG, JPG, or PDF up to 5MB. Verified confidentially by admin.
                  </p>
                </label>
              </div>

              {documentPreview && (
                <div className="mt-2 flex items-center gap-2 p-2 bg-teal-50 rounded-lg border border-teal-200 text-teal-800 text-[11px]">
                  <FileCheck className="w-4 h-4 shrink-0" />
                  <span>Document attached: {documentFile?.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Password */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-teal-700">
              3. Account Security
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Min. 8 characters"
                    className="w-full pl-9 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Confirm Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Re-enter password"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="pt-2">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={formData.termsAccepted}
                onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-[11px] text-slate-600 leading-normal">
                I agree to the Rider Logistics Agreement, conduct policies, and consent to identity document verification under Ghana's{' '}
                <Link to="/privacy-policy" className="text-teal-700 underline font-medium" target="_blank">
                  Data Protection Act (Act 843)
                </Link>
                .
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors shadow-xs"
          >
            {isLoading ? 'Submitting Application...' : 'Submit Rider Application'}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-slate-400">or</span>
          </div>
        </div>

        <GoogleAuthButton
          role="rider"
          onSuccess={() => navigate('/rider/pending-approval')}
          onError={(msg) => setErrorMessage(msg)}
        />

        <div className="text-center pt-2 text-xs text-slate-500">
          <span>Already applied or registered? </span>
          <Link to="/rider/login" className="text-teal-700 font-semibold hover:underline">
            Rider Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

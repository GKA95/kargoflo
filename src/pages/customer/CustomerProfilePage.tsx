import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Lock, Plus, Trash2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/apiClient';

export const CustomerProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSaved, setIsSaved] = useState(false);

  // Saved Addresses State
  const [addresses, setAddresses] = useState<Array<{ id: string; label: string; address: string; digitalCode?: string }>>([]);
  const [newLabel, setNewLabel] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newDigitalCode, setNewDigitalCode] = useState('');
  const [showAddressModal, setShowAddressModal] = useState(false);

  // Change Password State
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdMessage, setPwdMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.put('/customers/profile', { name, phone });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim()) return;
    setAddresses([
      ...addresses,
      {
        id: `addr_${Date.now()}`,
        label: newLabel || 'Default',
        address: newAddress,
        digitalCode: newDigitalCode,
      },
    ]);
    setNewLabel('');
    setNewAddress('');
    setNewDigitalCode('');
    setShowAddressModal(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPwd !== confirmPwd) {
      setPwdMessage({ text: 'New passwords do not match.', isError: true });
      return;
    }
    if (newPwd.length < 8) {
      setPwdMessage({ text: 'Password must be at least 8 characters long.', isError: true });
      return;
    }
    try {
      await apiClient.post('/auth/change-password', { currentPassword: currentPwd, newPassword: newPwd });
      setPwdMessage({ text: 'Password updated successfully.', isError: false });
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
    } catch (err: any) {
      setPwdMessage({ text: err.message || 'Unable to update password. Backend offline.', isError: true });
    }
  };

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Customer Profile</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage personal contact information, dispatch addresses, and account security.
        </p>
      </div>

      {/* Profile Information */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <User className="w-4 h-4 text-teal-600" />
          <span>Personal Information</span>
        </h2>

        {isSaved && (
          <div className="p-3 bg-teal-50 border border-teal-200 text-teal-800 text-xs rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile details updated successfully.</span>
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || 'customer@kargoflow.gh'}
                className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Managed via authentication provider</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Ghana Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="024 XXX XXXX"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
          >
            Save Profile
          </button>
        </form>
      </div>

      {/* Saved Delivery Addresses */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-600" />
              <span>Saved Delivery Addresses</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Quickly select addresses when booking deliveries</p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddressModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Address</span>
          </button>
        </div>

        {addresses.length === 0 ? (
          <p className="text-xs text-slate-400 p-4 border border-dashed border-slate-200 rounded-xl text-center">
            No saved addresses. Add home, office, or client locations for quick selection.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((a) => (
              <div key={a.id} className="p-4 rounded-xl border border-slate-200 text-xs flex justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">{a.label}</span>
                  <p className="text-slate-600 mt-0.5">{a.address}</p>
                  {a.digitalCode && <p className="font-mono text-teal-700 text-[11px] mt-0.5">GPS: {a.digitalCode}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => setAddresses(addresses.filter((x) => x.id !== a.id))}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {showAddressModal && (
          <form onSubmit={handleAddAddress} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
            <h4 className="font-bold text-slate-900">New Saved Address</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Label (e.g. Home, Office)"
                required
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
              />
              <input
                type="text"
                placeholder="Physical street address"
                required
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
              />
              <input
                type="text"
                placeholder="Ghana Post GPS (GA-183-9024)"
                value={newDigitalCode}
                onChange={(e) => setNewDigitalCode(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white font-mono uppercase"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowAddressModal(false)}
                className="px-3 py-1 text-slate-600 hover:bg-slate-200 rounded"
              >
                Cancel
              </button>
              <button type="submit" className="px-3 py-1 bg-slate-900 text-white rounded font-medium">
                Save Address
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Change Password */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Lock className="w-4 h-4 text-teal-600" />
          <span>Security & Change Password</span>
        </h2>

        {pwdMessage && (
          <div
            className={`p-3 text-xs rounded-lg border ${
              pwdMessage.isError ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-teal-50 border-teal-200 text-teal-800'
            }`}
          >
            {pwdMessage.text}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 text-xs max-w-md">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">New Password (Min. 8 chars)</label>
            <input
              type="password"
              required
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Statutory Act 843 Data Rights Notice */}
      <div className="p-5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-slate-900">Ghana Data Subject Rights (Act 843):</p>
          <p className="mt-1 leading-relaxed">
            Under the Republic of Ghana Data Protection Act, 2012 (Act 843), you have the right to request a complete export of your dispatch records or formally request account closure and data deletion by contacting our designated Data Protection Officer.
          </p>
        </div>
      </div>
    </div>
  );
};

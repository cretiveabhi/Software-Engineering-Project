import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { UserPlus, AlertCircle, ShieldCheck, CheckCircle2, User, Phone, Mail, Lock, Home, MapPin } from 'lucide-react';

const MP_DISTRICTS = ['Indore', 'Dewas', 'Ujjain', 'Bhopal', 'Sehore', 'Dhar', 'Khargone', 'Shajapur'];

export default function RegisterPage() {
  const { register, loading, error } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    mobile_number: '',
    email: '',
    password: '',
    village: '',
    district: 'Indore',
    state: 'Madhya Pradesh',
    farmer_address: '',
    land_area: '12.5',
    preferred_language: 'Hindi'
  });

  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    // Validations
    if (!formData.full_name || formData.full_name.trim().length < 2) {
      setLocalError('Please enter your full name as per Aadhaar.');
      return;
    }
    if (!/^\d{10}$/.test(formData.mobile_number.trim())) {
      setLocalError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setLocalError('Please enter a valid email address.');
      return;
    }
    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }
    if (!formData.village || !formData.farmer_address) {
      setLocalError('Please fill in your village and residential address.');
      return;
    }
    const land = parseFloat(formData.land_area);
    if (isNaN(land) || land <= 0) {
      setLocalError('Please provide a valid land area in acres.');
      return;
    }

    const res = await register(formData);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setLocalError(res.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white p-6 sm:p-8 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase font-extrabold text-amber-300 tracking-wider">
              Department of Agriculture • Govt of MP
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Farmer Onboarding & Kisan ID Registration
            </h1>
            <p className="text-xs text-emerald-200">
              Create your verified profile to participate in digital slot booking and split selling
            </p>
          </div>
          <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 items-center justify-center">
            <UserPlus className="w-8 h-8 text-amber-400" />
          </div>
        </div>

        {/* Error Notification */}
        {(localError || error) && (
          <div className="m-6 mb-0 bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl flex items-center gap-2 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{localError || error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Full Name (किसान का पूरा नाम) *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  name="full_name"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="e.g. Rameshwar Patel"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                10-Digit Mobile Number (मोबाइल नंबर) *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  name="mobile_number"
                  required
                  maxLength="10"
                  value={formData.mobile_number}
                  onChange={handleChange}
                  placeholder="9826012345"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Email Address (ईमेल) *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="rameshwar@example.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Password (पासवर्ड) *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                />
              </div>
            </div>

            {/* Village */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Village / Gram (ग्राम) *
              </label>
              <div className="relative">
                <Home className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  name="village"
                  required
                  value={formData.village}
                  onChange={handleChange}
                  placeholder="e.g. Manglia"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                />
              </div>
            </div>

            {/* District */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                District (जिला) *
              </label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm bg-white"
              >
                {MP_DISTRICTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Land Area */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Cultivable Land Area (भूमि रकबा - एकड़) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                name="land_area"
                required
                value={formData.land_area}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
              />
            </div>

            {/* Preferred Language */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Preferred Language (भाषा प्राथमिकता)
              </label>
              <select
                name="preferred_language"
                value={formData.preferred_language}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm bg-white"
              >
                <option value="Hindi">हिन्दी (Hindi)</option>
                <option value="English">English</option>
              </select>
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Complete Residential Address (स्थायी पता) *
              </label>
              <textarea
                name="farmer_address"
                required
                rows="2"
                value={formData.farmer_address}
                onChange={handleChange}
                placeholder="House / Gali number, Post office, Tehsil, District, PIN..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
              />
            </div>
          </div>

          {/* Kisan ID Card Preview Hint */}
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700">
              <p className="font-bold text-emerald-950">
                Official Kisan ID Generation
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                On registration, the system will automatically generate your permanent Kisan ID in the format <strong className="font-mono text-emerald-900">KS-MP-{formData.district.substring(0,3).toUpperCase()}-XXXXX</strong>, linked directly with state procurement quota records.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-800/20 transition-all text-sm disabled:opacity-50"
          >
            {loading ? 'Validating and saving to PostgreSQL...' : 'Complete Registration & Open Dashboard'}
          </button>

          <div className="text-center text-xs text-slate-600">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-emerald-800 hover:underline">
              Sign in with existing Kisan account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

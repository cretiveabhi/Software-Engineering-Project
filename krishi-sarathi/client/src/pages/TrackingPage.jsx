import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api.js';
import { useLanguage } from '../context/LanguageContext';
import TrackingTimeline from '../components/TrackingTimeline';
import {
  Truck,
  Search,
  Calendar,
  Wheat,
  MapPin,
  Clock,
  Sparkles,
  AlertCircle,
  FileText,
  CreditCard
} from 'lucide-react';

export default function TrackingPage() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();

  const [identifier, setIdentifier] = useState(searchParams.get('token') || 'A-042');
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTracking = async (searchId) => {
    const idToSearch = searchId || identifier;
    if (!idToSearch) return;

    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/tracking/${idToSearch}`);
      if (res.data.success) {
        setTrackingData(res.data);
      }
    } catch (err) {
      console.error('Tracking fetch failed:', err);
      setError(err.response?.data?.message || 'No tracking record found for this token or booking ID.');
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracking(searchParams.get('token') || 'A-042');
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTracking(identifier);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">
          Smart India Hackathon 2026 • End-to-End Visibility
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {t.tracking.title}
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          {t.tracking.subtitle}
        </p>
      </div>

      {/* Search Input Bar & Demo Shortcuts */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={t.tracking.searchPlaceholder}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm font-semibold"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold px-6 py-3 rounded-xl shadow-md transition-colors text-xs flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4" />
            <span>{loading ? 'Searching...' : t.tracking.searchBtn}</span>
          </button>
        </form>

        {/* 1-Click Demo Tokens for Evaluators */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="font-bold text-slate-500 text-[11px]">Quick Demo Tokens:</span>
          <button
            type="button"
            onClick={() => { setIdentifier('A-042'); fetchTracking('A-042'); }}
            className="bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-lg border border-amber-300 transition-colors"
          >
            Token A-042 (Step 6: Quality Assessment)
          </button>
          <button
            type="button"
            onClick={() => { setIdentifier('B-108'); fetchTracking('B-108'); }}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold px-2.5 py-1 rounded-lg border border-emerald-300 transition-colors"
          >
            Token B-108 (Step 9: Completed DBT Payment)
          </button>
          <button
            type="button"
            onClick={() => { setIdentifier('C-019'); fetchTracking('C-019'); }}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-2.5 py-1 rounded-lg border border-slate-300 transition-colors"
          >
            Token C-019 (Step 2: Slot Booked)
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-center gap-2.5 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tracking Result View */}
      {trackingData && (
        <div className="space-y-6">
          {/* Order Header Summary Card */}
          <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded uppercase font-mono">
                  Token: {trackingData.booking.token_number}
                </span>
                <span className="text-emerald-200 text-xs font-mono">
                  {trackingData.booking.booking_reference}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                {trackingData.booking.crop_name} — {trackingData.booking.total_quantity} Quintals
              </h2>
              <p className="text-xs text-emerald-200">
                Farmer: <strong className="text-white">{trackingData.booking.farmer_name}</strong> (Kisan ID: {trackingData.booking.kisan_id}) • {trackingData.booking.village}, {trackingData.booking.district}
              </p>
            </div>

            {/* Current Status Pill */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-right min-w-[200px]">
              <span className="text-[10px] text-emerald-200 font-bold uppercase block">
                {t.tracking.currentStage}
              </span>
              <p className="text-lg font-black text-amber-300 mt-0.5">
                Step {trackingData.currentStep}/9: {trackingData.status}
              </p>
              <span className="text-[11px] text-emerald-200 block mt-1">
                Database Verified Event
              </span>
            </div>
          </div>

          {/* 9-Stage Visual Timeline */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <TrackingTimeline
              timeline={trackingData.timeline}
              currentStep={trackingData.currentStep}
            />
          </div>
        </div>
      )}
    </div>
  );
}

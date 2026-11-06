import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Building2,
  Search,
  Truck,
  Scale,
  Microscope,
  PackageCheck,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function OperatorPortalPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [tokenInput, setTokenInput] = useState('A-042');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Operator Action Form State
  const [targetStep, setTargetStep] = useState(7);
  const [grossWeight, setGrossWeight] = useState('125.0');
  const [tareWeight, setTareWeight] = useState('85.0');
  const [moisturePercentage, setMoisturePercentage] = useState('11.4');
  const [qualityGrade, setQualityGrade] = useState('Grade-A (FAQ Certified)');
  const [operatorNotes, setOperatorNotes] = useState('Crop verified at Mandi Gate. Quality assessment within 12% moisture standard.');

  const fetchBooking = async (tok) => {
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const res = await api.get(`/tracking/${tok || tokenInput}`);
      if (res.data.success) {
        setBooking(res.data.booking);
        // Pre-fill target step to next logical step
        const next = Math.min(9, (res.data.currentStep || 3) + 1);
        setTargetStep(next);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Booking not found for this token.');
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking('A-042');
  }, []);

  const handleUpdateStage = async (e) => {
    e.preventDefault();
    if (!booking) return;

    setSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await api.post('/tracking/operator-update', {
        bookingId: booking.id,
        targetStep,
        grossWeight: parseFloat(grossWeight) || null,
        tareWeight: parseFloat(tareWeight) || null,
        moisturePercentage: parseFloat(moisturePercentage) || null,
        qualityGrade,
        operatorNotes
      });

      if (res.data.success) {
        setSuccessMsg(res.data.message);
        // Refresh booking
        await fetchBooking(booking.token_number);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update procurement stage.');
    } finally {
      setSubmitting(false);
    }
  };

  const netCalculated = Math.max(0, (parseFloat(grossWeight) || 0) - (parseFloat(tareWeight) || 0));

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-xs font-bold mb-2 border border-emerald-300">
          <Building2 className="w-3.5 h-3.5 text-emerald-700" />
          <span>Mandi Operator Console • Gate, Weighbridge & Lab Terminal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Procurement Event Update Terminal
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Authorized console for Mandi Officers to update arrival, electronic weighing, FAQ moisture quality, and DBT payment batch clearance.
        </p>
      </div>

      {/* Search Bar for Mandi Gate */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
        <label className="block text-xs font-bold text-slate-700">
          Scan Vehicle QR Token or Enter Token Number:
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="e.g. A-042 or BK-2026-IND-8812"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-sm"
            />
          </div>
          <button
            onClick={() => fetchBooking(tokenInput)}
            disabled={loading}
            className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            {loading ? 'Searching...' : 'Scan / Lookup Token'}
          </button>
        </div>

        {/* Evaluation Helpers */}
        <div className="flex items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 font-bold text-[11px]">Evaluation Presets:</span>
          <button
            type="button"
            onClick={() => { setTokenInput('A-042'); fetchBooking('A-042'); }}
            className="text-emerald-800 font-bold hover:underline"
          >
            Token A-042 (Rameshwar Patel)
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-center gap-2.5 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-2xl flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            <span>{successMsg}</span>
          </div>
          <Link
            to={`/tracking?token=${booking?.token_number}`}
            className="bg-emerald-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-emerald-900"
          >
            View Live as Farmer →
          </Link>
        </div>
      )}

      {/* Booking Details & Update Form */}
      {booking && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Booking Card */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Gate Token</span>
                <p className="text-2xl font-black text-slate-900 font-mono">{booking.token_number}</p>
              </div>
              <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded text-[11px]">
                Step {booking.current_step}/9: {booking.status}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Farmer:</span>
                <strong className="text-slate-900">{booking.farmer_name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kisan ID:</span>
                <strong className="font-mono text-emerald-900">{booking.kisan_id}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Crop:</span>
                <strong className="text-slate-900">{booking.crop_name} (MSP ₹{booking.crop_msp})</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Booked Qtl:</span>
                <strong className="text-slate-900">{booking.total_quantity} Qtl</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Booking Ref:</span>
                <strong className="font-mono text-slate-700">{booking.booking_reference}</strong>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <Link
                to={`/tracking?token=${booking.token_number}`}
                className="w-full flex items-center justify-center gap-1.5 font-bold text-emerald-800 bg-white py-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors"
              >
                <span>View Full 9-Step Timeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Action Form */}
          <form onSubmit={handleUpdateStage} className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5 text-xs">
            <h3 className="text-sm font-black text-slate-900 border-b border-slate-200 pb-2">
              Advance Procurement Stage (प्रक्रिया चरण अद्यतन)
            </h3>

            {/* Target Step Selection */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Select Target Stage to Record:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { step: 4, name: 'Step 4: Farmer Arrived at Gate' },
                  { step: 5, name: 'Step 5: Electronic Weighing Done' },
                  { step: 6, name: 'Step 6: Quality Assessment (Moisture Lab)' },
                  { step: 7, name: 'Step 7: Crop Accepted into Silo' },
                  { step: 8, name: 'Step 8: Payment Initiated (DBT Batch)' },
                  { step: 9, name: 'Step 9: Payment Completed (DBT Credit)' }
                ].map((s) => (
                  <button
                    type="button"
                    key={s.step}
                    onClick={() => setTargetStep(s.step)}
                    className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                      targetStep === s.step
                        ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Weighbridge Scales (if step 5, 6, 7) */}
            {targetStep >= 5 && (
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Scale className="w-4 h-4 text-emerald-700" />
                  <span>Electronic Weighbridge Calibration Inputs (धर्मकांटा तुलाई)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">Gross Wt (टैक्सी + अनाज - Qtl)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={grossWeight}
                      onChange={(e) => setGrossWeight(e.target.value)}
                      className="w-full text-sm font-bold px-3 py-1.5 rounded-xl border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">Tare Wt (खाली वाहन - Qtl)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={tareWeight}
                      onChange={(e) => setTareWeight(e.target.value)}
                      className="w-full text-sm font-bold px-3 py-1.5 rounded-xl border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">Computed Net Wt (शुद्ध अनाज)</label>
                    <div className="text-base font-black text-emerald-900 bg-white py-1.5 px-3 rounded-xl border border-slate-300">
                      {netCalculated} Qtl
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quality Lab (if step 6, 7) */}
            {targetStep >= 6 && (
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Microscope className="w-4 h-4 text-emerald-700" />
                  <span>Quality Lab Assessment (गुणवत्ता व नमी जांच)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">Moisture Content (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={moisturePercentage}
                      onChange={(e) => setMoisturePercentage(e.target.value)}
                      className="w-full text-sm font-bold px-3 py-1.5 rounded-xl border border-slate-300"
                    />
                    <span className="text-[10px] text-slate-400">Ceiling: 12.0% for FAQ</span>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">Quality Grading</label>
                    <select
                      value={qualityGrade}
                      onChange={(e) => setQualityGrade(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="Grade-A (FAQ Certified)">Grade-A (FAQ Certified)</option>
                      <option value="Grade-B (Minor dockage)">Grade-B (Minor dockage)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Operator Notes */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Official Operator Log / Remark
              </label>
              <textarea
                rows="2"
                value={operatorNotes}
                onChange={(e) => setOperatorNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm py-3.5 px-4 rounded-xl shadow-lg transition-all disabled:opacity-50"
            >
              {submitting ? 'Updating Database...' : `Commit & Broadcast Step ${targetStep} Update`}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

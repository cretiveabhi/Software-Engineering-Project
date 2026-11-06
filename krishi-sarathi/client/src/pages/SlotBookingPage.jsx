import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import QRCodeModal from '../components/QRCodeModal';
import {
  CalendarCheck,
  Wheat,
  MapPin,
  Clock,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  QrCode
} from 'lucide-react';

const TIME_SLOTS = [
  '09:00 AM - 12:00 PM (Morning Slot)',
  '12:00 PM - 03:00 PM (Afternoon Slot)',
  '03:00 PM - 06:00 PM (Evening Slot)'
];

export default function SlotBookingPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [crops, setCrops] = useState([]);
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form inputs
  const [cropId, setCropId] = useState(searchParams.get('cropId') || '');
  const [quantity, setQuantity] = useState(searchParams.get('quantity') || '50');
  const [centreId, setCentreId] = useState(searchParams.get('centreId') || '');
  const [bookingDate, setBookingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);

  // Success modal
  const [createdBooking, setCreatedBooking] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [cRes, mRes] = await Promise.all([
          api.get('/crops'),
          api.get('/centres')
        ]);
        if (cRes.data.success) {
          setCrops(cRes.data.crops);
          if (!cropId && cRes.data.crops.length > 0) {
            setCropId(cRes.data.crops[0].id);
          }
        }
        if (mRes.data.success) {
          setCentres(mRes.data.centres);
          if (!centreId && mRes.data.centres.length > 0) {
            setCentreId(mRes.data.centres[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load initial booking data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const selectedCrop = crops.find(c => c.id === cropId);
  const selectedCentre = centres.find(c => c.id === centreId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const parsedQty = parseFloat(quantity);
    if (!cropId || isNaN(parsedQty) || parsedQty <= 0) {
      setError('Please provide a valid crop and quantity.');
      return;
    }
    if (!centreId) {
      setError('Please select a procurement centre.');
      return;
    }
    if (!bookingDate) {
      setError('Please choose a valid date.');
      return;
    }

    if (selectedCentre && Number(selectedCentre.available_quota) < parsedQty) {
      setError(`Requested quantity (${parsedQty} Qtl) exceeds centre's available quota (${selectedCentre.available_quota} Qtl). Consider reducing quantity or using Split Selling.`);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        cropId,
        totalQuantity: parsedQty,
        bookingDate,
        allocations: [
          {
            centreId,
            quantity: parsedQty,
            slotTimeWindow: timeSlot
          }
        ]
      };

      const res = await api.post('/bookings', payload);
      if (res.data.success && res.data.booking) {
        setCreatedBooking(res.data.booking);
        setShowQRModal(true);

        // Confetti celebration
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Booking failed:', err);
      setError(err.response?.data?.message || err.message || 'Booking submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">
          Smart India Hackathon 2026 • Automated Procurement
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Procurement Slot Booking (एकल मंडी स्लॉट बुकिंग)
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Reserve your verified weighbridge slot with atomic quota ledger protection
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-center gap-2.5 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-5 text-xs">
          {/* Crop Selection */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Select Crop (उपज का चयन) *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {crops.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCropId(c.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    cropId === c.id
                      ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/30 font-bold'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="block text-slate-900 text-xs font-bold truncate">{c.name}</span>
                  <span className="block text-[11px] text-emerald-800 font-mono">₹{c.msp}/Qtl</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Quantity to Sell (क्विंटल) *
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                step="0.5"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="50"
                className="w-full text-base font-extrabold px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <span className="absolute right-3.5 top-3 text-xs font-bold text-slate-400">
                Quintals
              </span>
            </div>
          </div>

          {/* Mandi Selection */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Choose Procurement Centre (उपार्जन केंद्र) *
            </label>
            <select
              value={centreId}
              onChange={(e) => setCentreId(e.target.value)}
              className="w-full text-sm font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
            >
              {centres.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.district}) — Quota: {c.available_quota} Qtl | Queue: {c.current_queue} | AI Score: {c.smartScore}/100
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              You can choose ANY available centre across Madhya Pradesh.
            </p>
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Booking Date (तारीख) *
              </label>
              <input
                type="date"
                required
                value={bookingDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full text-sm font-semibold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Available Time Window (समय स्लॉट) *
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full text-sm font-semibold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                {TIME_SLOTS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-800/20 transition-all disabled:opacity-50"
          >
            {submitting ? 'Reserving Quota in Ledger...' : 'Confirm Slot & Generate Digital Gate Token'}
          </button>
        </form>

        {/* Live Summary Preview Box */}
        <div className="space-y-4">
          <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200 text-xs space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Booking Summary Preview</span>
            </h4>

            {selectedCrop && (
              <div className="flex justify-between">
                <span className="text-slate-500">Selected Crop:</span>
                <strong className="text-slate-900">{selectedCrop.name}</strong>
              </div>
            )}

            {selectedCrop && (
              <div className="flex justify-between">
                <span className="text-slate-500">Official MSP Rate:</span>
                <strong className="text-emerald-900 font-mono">₹{selectedCrop.msp}/Qtl</strong>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-slate-500">Selling Quantity:</span>
              <strong className="text-slate-900">{quantity || 0} Quintals</strong>
            </div>

            {selectedCrop && quantity && (
              <div className="flex justify-between pt-2 border-t border-slate-200 text-emerald-900">
                <span className="font-bold">Est. Gross Payment:</span>
                <strong className="font-black text-sm">
                  ₹{(Number(selectedCrop.msp) * parseFloat(quantity || 0)).toLocaleString('en-IN')}
                </strong>
              </div>
            )}

            {selectedCentre && (
              <div className="pt-2 border-t border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-500 block">Target Mandi:</span>
                <strong className="text-slate-900 block truncate">{selectedCentre.name}</strong>
                <span className="text-[10px] text-emerald-800 font-bold block">
                  Available Quota: {selectedCentre.available_quota} Qtl (Queue: {selectedCentre.current_queue})
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Code Pass Modal */}
      <QRCodeModal
        booking={createdBooking}
        isOpen={showQRModal}
        onClose={() => {
          setShowQRModal(false);
          navigate('/dashboard');
        }}
      />
    </div>
  );
}

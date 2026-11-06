import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import QRCodeModal from '../components/QRCodeModal';
import {
  Split,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Wheat,
  Scale,
  Sparkles,
  CalendarCheck
} from 'lucide-react';

const TIME_SLOTS = [
  '09:00 AM - 12:00 PM',
  '12:00 PM - 03:00 PM',
  '03:00 PM - 06:00 PM'
];

export default function SplitSellingPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [crops, setCrops] = useState([]);
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Primary Inputs
  const [cropId, setCropId] = useState(searchParams.get('cropId') || '');
  const [totalQuantity, setTotalQuantity] = useState(searchParams.get('quantity') || '100');
  const [bookingDate, setBookingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });

  // Split allocations: array of { centreId, quantity, slotTimeWindow }
  const [allocations, setAllocations] = useState([
    { centreId: '', quantity: '40', slotTimeWindow: TIME_SLOTS[0] },
    { centreId: '', quantity: '35', slotTimeWindow: TIME_SLOTS[1] },
    { centreId: '', quantity: '25', slotTimeWindow: TIME_SLOTS[2] }
  ]);

  const [createdBooking, setCreatedBooking] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [cRes, mRes] = await Promise.all([
          api.get('/crops'),
          api.get('/centres')
        ]);
        if (cRes.data.success && cRes.data.crops.length > 0) {
          setCrops(cRes.data.crops);
          if (!cropId) setCropId(cRes.data.crops[0].id);
        }
        if (mRes.data.success && mRes.data.centres.length > 0) {
          setCentres(mRes.data.centres);
          // Set default centres for the 3 demo allocations
          setAllocations(prev => [
            { ...prev[0], centreId: mRes.data.centres[0]?.id || '' },
            { ...prev[1], centreId: mRes.data.centres[1]?.id || '' },
            { ...prev[2], centreId: mRes.data.centres[2]?.id || '' }
          ]);
        }
      } catch (err) {
        console.error('Failed to load split selling data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalReq = parseFloat(totalQuantity) || 0;
  const currentSum = allocations.reduce((sum, a) => sum + (parseFloat(a.quantity) || 0), 0);
  const remaining = Math.round((totalReq - currentSum) * 100) / 100;
  const isBalanced = Math.abs(remaining) < 0.001 && totalReq > 0;

  const handleAddCentre = () => {
    const remainingQty = Math.max(0, remaining);
    const unselected = centres.find(c => !allocations.some(a => a.centreId === c.id));
    setAllocations(prev => [
      ...prev,
      {
        centreId: unselected?.id || centres[0]?.id || '',
        quantity: remainingQty > 0 ? remainingQty.toString() : '10',
        slotTimeWindow: TIME_SLOTS[0]
      }
    ]);
  };

  const handleRemoveAllocation = (index) => {
    if (allocations.length <= 1) return;
    setAllocations(prev => prev.filter((_, i) => i !== index));
  };

  const handleAllocationChange = (index, field, value) => {
    setAllocations(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (totalReq <= 0) {
      setError('Please enter a positive total harvest quantity.');
      return;
    }

    if (!isBalanced) {
      setError(`Split allocations (${currentSum} Qtl) must equal total harvest quantity (${totalReq} Qtl) exactly.`);
      return;
    }

    for (const alloc of allocations) {
      const q = parseFloat(alloc.quantity);
      if (isNaN(q) || q <= 0) {
        setError('Every allocation quantity must be greater than zero.');
        return;
      }
      const centre = centres.find(c => c.id === alloc.centreId);
      if (centre && Number(centre.available_quota) < q) {
        setError(`Mandi "${centre.name}" has only ${centre.available_quota} Qtl available quota, but you requested ${q} Qtl.`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        cropId,
        totalQuantity: totalReq,
        bookingDate,
        allocations: allocations.map(a => ({
          centreId: a.centreId,
          quantity: parseFloat(a.quantity),
          slotTimeWindow: a.slotTimeWindow
        }))
      };

      const res = await api.post('/bookings', payload);
      if (res.data.success && res.data.booking) {
        setCreatedBooking(res.data.booking);
        setShowQRModal(true);

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Split selling error:', err);
      setError(err.response?.data?.message || err.message || 'Split booking failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCrop = crops.find(c => c.id === cropId);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-bold mb-2 border border-amber-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>SIH 2026 Core Innovation • Dynamic Split Selling Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {t.splitSelling.title}
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          {t.splitSelling.subtitle}
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-center gap-2.5 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Top Controls: Crop, Total Qty, Date */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">{t.splitSelling.selectCrop}</label>
            <select
              value={cropId}
              onChange={(e) => setCropId(e.target.value)}
              className="w-full text-sm font-semibold px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
            >
              {crops.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} (MSP ₹{c.msp}/Qtl)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">{t.splitSelling.totalQuantity}</label>
            <div className="relative">
              <input
                type="number"
                min="1"
                step="1"
                required
                value={totalQuantity}
                onChange={(e) => setTotalQuantity(e.target.value)}
                className="w-full text-base font-extrabold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">
                Quintals
              </span>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Procurement Date</label>
            <input
              type="date"
              required
              value={bookingDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setBookingDate(e.target.value)}
              className="w-full text-sm font-semibold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>

        {/* Real-time Allocation Balance Bar */}
        <div className={`rounded-2xl p-4 border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
          isBalanced
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
            : 'bg-amber-50 border-amber-300 text-amber-900'
        }`}>
          <div className="flex items-center gap-2.5">
            {isBalanced ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            )}
            <div>
              <p className="font-extrabold text-sm">
                {isBalanced ? t.splitSelling.statusBalanced : t.splitSelling.statusUnbalanced}
              </p>
              <p className="text-[11px] opacity-80">
                Sum of allocations: <strong>{currentSum} Qtl</strong> / Requested Total: <strong>{totalReq} Qtl</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end font-mono">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-sans">Remaining</span>
              <strong className={`text-base ${remaining === 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                {remaining} Qtl
              </strong>
            </div>
          </div>
        </div>

        {/* Dynamic Allocation Rows */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-black text-slate-900">
              {t.splitSelling.allocationTable}
            </h3>
            <button
              type="button"
              onClick={handleAddCentre}
              className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.splitSelling.addCentre}</span>
            </button>
          </div>

          <div className="space-y-3">
            {allocations.map((alloc, idx) => {
              const centre = centres.find(c => c.id === alloc.centreId);
              return (
                <div
                  key={idx}
                  className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-xs"
                >
                  <div className="sm:col-span-1 text-center font-bold text-slate-400">
                    Mandi #{idx + 1}
                  </div>

                  {/* Centre Dropdown */}
                  <div className="sm:col-span-5">
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Procurement Centre</label>
                    <select
                      value={alloc.centreId}
                      onChange={(e) => handleAllocationChange(idx, 'centreId', e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      {centres.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.district}) — Quota: {c.available_quota} Qtl (Queue: {c.current_queue})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity Input */}
                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Allocated Quantity (Qtl)</label>
                    <input
                      type="number"
                      min="1"
                      step="0.5"
                      required
                      value={alloc.quantity}
                      onChange={(e) => handleAllocationChange(idx, 'quantity', e.target.value)}
                      className="w-full text-sm font-extrabold px-3 py-1.5 rounded-xl border border-slate-300"
                    />
                  </div>

                  {/* Slot Time */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Time Slot</label>
                    <select
                      value={alloc.slotTimeWindow}
                      onChange={(e) => handleAllocationChange(idx, 'slotTimeWindow', e.target.value)}
                      className="w-full text-xs font-semibold px-2 py-2 rounded-xl border border-slate-300 bg-white truncate"
                    >
                      {TIME_SLOTS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Delete Button */}
                  <div className="sm:col-span-1 text-right sm:text-center pt-2 sm:pt-4">
                    <button
                      type="button"
                      disabled={allocations.length <= 1}
                      onClick={() => handleRemoveAllocation(idx)}
                      className="text-slate-400 hover:text-rose-600 disabled:opacity-30 transition-colors p-1"
                      title="Remove this centre allocation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Atomic Transaction Guarantee Strip */}
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex items-start gap-3 text-xs text-slate-700">
            <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-950">
                Atomic Ledger Concurrency Lock Active
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                All {allocations.length} mandi quotas will be reserved simultaneously in a single PostgreSQL database transaction. If any centre runs out of quota during booking, all changes are rolled back automatically to ensure zero overselling.
              </p>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isBalanced || submitting}
            className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm py-4 px-4 rounded-xl shadow-lg shadow-emerald-800/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? 'Executing Atomic Ledger Transaction...' : t.splitSelling.bookSplitSlots}
          </button>
        </div>
      </form>

      {/* QR Modal */}
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

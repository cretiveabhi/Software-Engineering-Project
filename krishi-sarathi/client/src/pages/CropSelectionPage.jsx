import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { useLanguage } from '../context/LanguageContext';
import {
  Wheat,
  Sprout,
  Calculator,
  TrendingUp,
  ArrowRight,
  Split,
  Calendar,
  CheckCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export default function CropSelectionPage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState('All');

  // Calculator state
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [quantity, setQuantity] = useState('100');
  const [calculation, setCalculation] = useState(null);

  useEffect(() => {
    async function loadCrops() {
      try {
        const res = await api.get('/crops');
        if (res.data.success && res.data.crops) {
          setCrops(res.data.crops);
          if (res.data.crops.length > 0) {
            setSelectedCrop(res.data.crops[0]);
          }
        }
      } catch (err) {
        console.error('Error loading crops:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCrops();
  }, []);

  // Recalculate earnings when crop or quantity changes
  useEffect(() => {
    if (selectedCrop && quantity && parseFloat(quantity) > 0) {
      const q = parseFloat(quantity);
      const msp = Number(selectedCrop.msp);
      const officialMspPayout = Math.round(q * msp);
      const openMarketRate = Math.round(msp * 0.85);
      const openMarketTotal = Math.round(q * openMarketRate);
      const farmerBenefit = officialMspPayout - openMarketTotal;

      setCalculation({
        officialMspPayout,
        openMarketRate,
        openMarketTotal,
        farmerBenefit
      });
    }
  }, [selectedCrop, quantity]);

  const filteredCrops = crops.filter(c => {
    if (selectedSeason === 'All') return true;
    return c.season === selectedSeason;
  });

  const handleProceedBooking = (isSplit = false) => {
    if (!selectedCrop) return;
    const url = isSplit
      ? `/split-selling?cropId=${selectedCrop.id}&quantity=${quantity}`
      : `/book-slot?cropId=${selectedCrop.id}&quantity=${quantity}`;
    navigate(url);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">
          State Agricultural Procurement • MP 2025-26
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {t.crops.title}
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          {t.crops.subtitle}
        </p>
      </div>

      {/* Season Filter Buttons */}
      <div className="flex items-center gap-2">
        {['All', 'Rabi', 'Kharif'].map((season) => (
          <button
            key={season}
            onClick={() => setSelectedSeason(season)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedSeason === season
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {season === 'All' ? t.crops.seasonAll : season === 'Rabi' ? t.crops.seasonRabi : t.crops.seasonKharif}
          </button>
        ))}
      </div>

      {/* Crops Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCrops.map((crop) => {
          const isSelected = selectedCrop?.id === crop.id;
          return (
            <div
              key={crop.id}
              onClick={() => setSelectedCrop(crop)}
              className={`cursor-pointer rounded-2xl p-5 border transition-all text-left space-y-3 relative overflow-hidden ${
                isSelected
                  ? 'bg-emerald-50/90 border-emerald-500 shadow-md ring-2 ring-emerald-500/30'
                  : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                    {crop.season} Season
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 mt-1">
                    {crop.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {crop.hindi_name}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                  isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  <Wheat className="w-5 h-5" />
                </div>
              </div>

              {/* MSP Rate Pill */}
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/90">
                <span className="text-[11px] text-slate-500 block font-medium">Official Govt MSP:</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-emerald-900">
                    ₹{crop.msp}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    / {crop.unit}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 line-clamp-2">
                {crop.description}
              </p>

              <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-100">
                Window: {crop.procurement_window}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive MSP Calculator Card */}
      {selectedCrop && calculation && (
        <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-2.5 border-b border-emerald-700/80 pb-4">
            <Calculator className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="text-lg font-black tracking-tight">
                {t.crops.calculatorTitle} — {selectedCrop.name} ({selectedCrop.hindi_name})
              </h3>
              <p className="text-xs text-emerald-200">
                Guaranteed minimum procurement earnings breakdown backed by state MSP ledger
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Input Quantity */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-emerald-200">
                {t.crops.enterQuantity}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="10000"
                  step="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-white text-slate-900 font-extrabold text-xl px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-inner"
                />
                <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-500">
                  Quintals (क्विंटल)
                </span>
              </div>
              <p className="text-[11px] text-emerald-300">
                Official MSP: ₹{selectedCrop.msp} per Quintal
              </p>
            </div>

            {/* Calculations Breakdown */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                <span className="text-[11px] text-emerald-200 block">Guaranteed MSP Payout:</span>
                <p className="text-2xl font-black text-amber-300 mt-1">
                  ₹{calculation.officialMspPayout.toLocaleString('en-IN')}
                </p>
                <span className="text-[10px] text-emerald-300 block mt-1">
                  Direct Bank Transfer (DBT)
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                <span className="text-[11px] text-emerald-200 block">Est. Local Trader Value:</span>
                <p className="text-2xl font-black text-slate-300 mt-1">
                  ₹{calculation.openMarketTotal.toLocaleString('en-IN')}
                </p>
                <span className="text-[10px] text-slate-300 block mt-1">
                  At ~₹{calculation.openMarketRate}/Qtl
                </span>
              </div>

              <div className="bg-amber-500/20 backdrop-blur-md p-4 rounded-2xl border border-amber-400/40">
                <span className="text-[11px] text-amber-200 block font-bold">Extra Farmer Advantage:</span>
                <p className="text-2xl font-black text-emerald-300 mt-1">
                  +₹{calculation.farmerBenefit.toLocaleString('en-IN')}
                </p>
                <span className="text-[10px] text-amber-200 block mt-1 font-semibold">
                  Guaranteed State Protection
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-emerald-700/80 flex flex-wrap items-center justify-end gap-3">
            <button
              onClick={() => handleProceedBooking(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs py-3 px-5 rounded-xl shadow-lg transition-transform transform hover:-translate-y-0.5"
            >
              <Split className="w-4 h-4" />
              <span>{t.crops.splitSellOption}</span>
            </button>

            <button
              onClick={() => handleProceedBooking(false)}
              className="flex items-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-extrabold text-xs py-3 px-5 rounded-xl shadow-lg transition-colors"
            >
              <span>{t.crops.proceedBooking}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

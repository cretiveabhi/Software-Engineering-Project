import React from 'react';
import { ShieldCheck, Printer, CheckCircle, QrCode } from 'lucide-react';

export default function KisanIdCard({ farmer }) {
  if (!farmer) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white rounded-2xl p-6 shadow-xl border border-emerald-600/30 relative overflow-hidden">
      {/* Decorative background watermark */}
      <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
        <svg className="w-56 h-56" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 17.93V15a1 1 0 0 0-2 0v4.93A8 8 0 0 1 4.07 13H9a1 1 0 0 0 0-2H4.07A8 8 0 0 1 11 4.07V9a1 1 0 0 0 2 0V4.07A8 8 0 0 1 19.93 11H15a1 1 0 0 0 0 2h4.93A8 8 0 0 1 13 19.93z" />
        </svg>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-emerald-700/60 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-700/80 border border-emerald-500/50 flex items-center justify-center font-bold text-xs text-amber-300">
            MP
          </div>
          <div>
            <h4 className="text-xs uppercase font-extrabold tracking-widest text-emerald-200">
              Department of Farmer Welfare • MP
            </h4>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Official Digital Kisan ID Card
            </h3>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1 text-xs bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 px-2.5 py-1 rounded-md border border-emerald-600 transition-colors shadow-sm"
          title="Print official identity card"
        >
          <Printer className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Print Card</span>
        </button>
      </div>

      {/* Main Body */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
        {/* Photo / Avatar */}
        <div className="flex flex-col items-center sm:items-start">
          <div className="w-20 h-20 rounded-xl bg-emerald-700/60 border-2 border-emerald-400/80 flex items-center justify-center text-3xl font-extrabold shadow-inner overflow-hidden">
            {farmer.avatar_url ? (
              <img src={farmer.avatar_url} alt={farmer.full_name} className="w-full h-full object-cover" />
            ) : (
              <span>{farmer.full_name?.charAt(0) || 'K'}</span>
            )}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-300 font-semibold">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>KYC Verified</span>
          </div>
        </div>

        {/* Farmer Details */}
        <div className="sm:col-span-2 space-y-1.5 text-xs">
          <div>
            <span className="text-[11px] text-emerald-300">Farmer Name / किसान का नाम:</span>
            <p className="font-bold text-base text-white">{farmer.full_name}</p>
          </div>

          <div>
            <span className="text-[11px] text-emerald-300">Kisan ID Number:</span>
            <p className="font-mono font-extrabold text-amber-300 text-sm tracking-wider">
              {farmer.kisan_id || 'KS-MP-IND-01001'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
            <div>
              <span className="text-emerald-300">Village & District:</span>
              <p className="font-medium text-slate-100">{farmer.village || 'Manglia'}, {farmer.district || 'Indore'}</p>
            </div>
            <div>
              <span className="text-emerald-300">Registered Land:</span>
              <p className="font-medium text-slate-100">{farmer.land_area || '18.5'} Acres</p>
            </div>
          </div>
        </div>

        {/* QR Badge & State verification */}
        <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
          <div className="w-16 h-16 bg-white rounded-lg p-1 shadow flex items-center justify-center">
            <QrCode className="w-14 h-14 text-emerald-950" />
          </div>
          <span className="mt-1 text-[10px] font-mono text-emerald-200">
            Govt Verified QR
          </span>
        </div>
      </div>

      {/* Footer Strip */}
      <div className="mt-4 pt-3 border-t border-emerald-700/60 flex flex-wrap items-center justify-between text-[11px] text-emerald-200/90 gap-2">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Aadhaar-Linked DBT Bank: {farmer.bank_account_masked || 'XXXX-XXXX-4821'} (IFSC: SBIN0001234)</span>
        </div>
        <span className="font-mono text-[10px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700">
          State Quota Active 2025-26
        </span>
      </div>
    </div>
  );
}

import React from 'react';
import { X, Printer, CheckCircle, ShieldCheck, Download } from 'lucide-react';

export default function QRCodeModal({ booking, isOpen, onClose }) {
  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center font-bold text-xs text-amber-300">
              MP
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-wide">
                Digital Mandi Entry Pass
              </h3>
              <p className="text-[11px] text-emerald-200">
                Department of Agriculture • SIH 2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-4">
          {/* Token Big Badge */}
          <div className="inline-block bg-emerald-50 border-2 border-emerald-600 rounded-2xl px-6 py-2.5 shadow-sm">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest block">
              Digital Gate Token
            </span>
            <span className="text-3xl font-black text-emerald-950 font-mono tracking-wider">
              {booking.token_number || 'A-042'}
            </span>
          </div>

          {/* QR Code */}
          <div className="flex justify-center my-2">
            <div className="p-3 bg-white rounded-2xl border-2 border-dashed border-emerald-500 shadow-md">
              {booking.qr_code_data ? (
                <img
                  src={booking.qr_code_data}
                  alt={`QR Token ${booking.token_number}`}
                  className="w-48 h-48 object-contain"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center bg-slate-100 text-slate-400 text-xs">
                  Generating QR...
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            Scan at Mandi Weighbridge Security Gate for Instant Entry
          </p>

          {/* Booking Summary Box */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-left text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Booking Reference:</span>
              <strong className="font-mono text-slate-800">{booking.booking_reference}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Crop & Total Quantity:</span>
              <strong className="text-emerald-900">{booking.crop_name || 'Crop'} — {booking.total_quantity} Qtl</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Slot Date:</span>
              <strong className="text-slate-800">{booking.booking_date}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Split Status:</span>
              <strong className="text-slate-800">{booking.is_split ? 'Multi-Centre Split' : 'Single Mandi'}</strong>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-md shadow-emerald-700/20 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Pass</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs py-2.5 px-4 rounded-xl border border-slate-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

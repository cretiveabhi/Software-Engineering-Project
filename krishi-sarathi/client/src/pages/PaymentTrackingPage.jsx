import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { useLanguage } from '../context/LanguageContext';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Printer,
  FileText,
  AlertCircle,
  Building,
  ArrowUpRight
} from 'lucide-react';

export default function PaymentTrackingPage() {
  const { t } = useLanguage();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    async function loadPayments() {
      try {
        const res = await api.get('/payments/my-payments');
        if (res.data.success) {
          setPayments(res.data.payments);
        }
      } catch (err) {
        console.error('Failed to load payments:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPayments();
  }, []);

  const totalCredited = payments
    .filter(p => p.payment_status === 'Completed')
    .reduce((sum, p) => sum + (parseFloat(p.net_amount) || 0), 0);

  const totalPending = payments
    .filter(p => p.payment_status !== 'Completed')
    .reduce((sum, p) => sum + (parseFloat(p.net_amount) || 0), 0);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">
          Direct Bank Transfer (DBT) • PFMS Gateway
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {t.payments.title}
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          {t.payments.subtitle}
        </p>
      </div>

      {/* Simulated Disclaimer Banner */}
      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-300 flex items-start gap-3 text-xs text-amber-950">
        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-extrabold">{t.payments.simulatedDisclaimer}</p>
          <p className="text-[11px] text-amber-800 mt-0.5">
            All transaction references, PFMS batch numbers, and disbursement timestamps are relational records created in PostgreSQL for demonstration of end-to-end financial settlement.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Total Credited to Aadhaar A/c</span>
            <p className="text-3xl font-black text-emerald-800 mt-1">
              ₹{totalCredited.toLocaleString('en-IN')}
            </p>
            <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
              ✓ Direct Bank Transfer (DBT) Successful
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Pending / In-Process Payouts</span>
            <p className="text-3xl font-black text-amber-800 mt-1">
              ₹{totalPending.toLocaleString('en-IN')}
            </p>
            <span className="text-[11px] text-amber-700 font-semibold block mt-1">
              ● PFMS Treasury Clearance Queue
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-sm font-black text-slate-900">
            Official DBT Disbursement History
          </h3>
        </div>

        {payments.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No payment records found. Payments are initiated once crop quality assessment and weighing are completed at the mandi.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                  <th className="py-3 px-4">Transaction Ref</th>
                  <th className="py-3 px-4">Booking Ref</th>
                  <th className="py-3 px-4">Crop & Qtl</th>
                  <th className="py-3 px-4">MSP Rate</th>
                  <th className="py-3 px-4">Net Payout</th>
                  <th className="py-3 px-4">Credited Account</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {p.transaction_ref}
                      <span className="text-[10px] text-slate-400 block font-normal">
                        {p.dbt_batch_id}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      {p.booking_reference}
                      <span className="text-[10px] text-emerald-800 block font-bold">
                        Token: {p.token_number}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {p.crop_name} — {p.accepted_quantity} Qtl
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      ₹{p.msp_rate}/Qtl
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-sm text-emerald-900 font-mono">
                      ₹{Number(p.net_amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {p.bank_account_masked}
                      <span className="text-[10px] text-slate-400 block">{p.ifsc_code}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.payment_status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        {p.payment_status === 'Completed' ? '✓ Credited' : '● Initiated'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedReceipt(p)}
                        className="inline-flex items-center gap-1 font-bold text-emerald-800 hover:text-emerald-900 hover:underline"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Voucher</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-xs">
                  MP
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Department of Agriculture • Govt of MP
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Official Procurement DBT Payment Voucher (Simulated)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-center space-y-1">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest">
                Net Disbursed Amount
              </span>
              <p className="text-3xl font-black text-emerald-950 font-mono">
                ₹{Number(selectedReceipt.net_amount).toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-emerald-700 block font-semibold">
                Status: {selectedReceipt.payment_status} via Aadhaar Payment Bridge
              </span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">DBT Reference:</span>
                <strong className="font-mono text-slate-900">{selectedReceipt.transaction_ref}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">PFMS Batch ID:</span>
                <strong className="font-mono text-slate-700">{selectedReceipt.dbt_batch_id}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Booking Reference:</span>
                <strong className="font-mono text-slate-700">{selectedReceipt.booking_reference} (Token: {selectedReceipt.token_number})</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Accepted Quantity:</span>
                <strong className="text-slate-900">{selectedReceipt.accepted_quantity} Qtl ({selectedReceipt.crop_name})</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">MSP Rate:</span>
                <strong className="text-slate-900">₹{selectedReceipt.msp_rate}/Qtl</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Beneficiary Bank A/c:</span>
                <strong className="font-mono text-slate-900">{selectedReceipt.bank_account_masked} ({selectedReceipt.ifsc_code})</strong>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Print Voucher</span>
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

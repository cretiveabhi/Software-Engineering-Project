import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import KisanIdCard from '../components/KisanIdCard';
import WeatherWidget from '../components/WeatherWidget';
import {
  Wheat,
  CalendarCheck,
  Clock,
  CheckCircle2,
  CreditCard,
  Building2,
  ArrowRight,
  Split,
  Truck,
  Award,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/farmer/dashboard');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 font-medium">Fetching real-time data from database...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-2xl space-y-3 my-8">
        <h3 className="font-bold text-sm">Failed to load dashboard data</h3>
        <p className="text-xs">{error}</p>
        <button
          onClick={fetchDashboard}
          className="flex items-center gap-1.5 text-xs bg-rose-700 text-white font-semibold px-3 py-1.5 rounded-lg"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  const { stats, liveWeather, recommendedCentres, recentBookings } = data;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner / Welcome */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">
            {t.brand.govt}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.dashboard.welcome} {stats.farmerName}
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Kisan ID: <strong className="font-mono text-emerald-800 font-bold">{stats.kisanId}</strong> • {stats.village}, {stats.district}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/split-selling"
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/10 hover:from-amber-600 hover:to-amber-700 transition-all"
          >
            <Split className="w-3.5 h-3.5" />
            <span>{t.dashboard.splitSellCrops}</span>
          </Link>

          <Link
            to="/book-slot"
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white shadow-md shadow-emerald-800/10 transition-all"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>{t.dashboard.bookNewSlot}</span>
          </Link>
        </div>
      </div>

      {/* Official Digital Kisan ID Card */}
      <KisanIdCard
        farmer={{
          full_name: stats.farmerName,
          kisan_id: stats.kisanId,
          village: stats.village,
          district: stats.district,
          land_area: stats.landArea,
          bank_account_masked: user?.bank_account_masked
        }}
      />

      {/* 6 Key KPI Metric Cards (Database backed) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold">{t.dashboard.registeredCrops}</span>
            <Wheat className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.registeredCropsCount}</p>
          <span className="text-[10px] text-emerald-700 font-semibold block">MSP Verified</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold">{t.dashboard.activeBookings}</span>
            <CalendarCheck className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.activeBookingsCount}</p>
          <span className="text-[10px] text-amber-700 font-semibold block">Slots Confirmed</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold">{t.dashboard.pendingProcurement}</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.pendingProcurementQty} <span className="text-xs font-normal text-slate-500">Qtl</span></p>
          <span className="text-[10px] text-blue-700 font-semibold block">In Transit / Quota</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold">{t.dashboard.completedProcurement}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.completedProcurementQty} <span className="text-xs font-normal text-slate-500">Qtl</span></p>
          <span className="text-[10px] text-emerald-700 font-semibold block">Weighed & Accepted</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold">{t.dashboard.creditedPayments}</span>
            <CreditCard className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-800">
            ₹{stats.totalCreditedAmount.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-emerald-700 font-semibold block">DBT Deposited</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold">{t.dashboard.pendingPayments}</span>
            <CreditCard className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-800">
            ₹{stats.pendingPaymentAmount.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-amber-700 font-semibold block">PFMS Batch In-Process</span>
        </div>
      </div>

      {/* Grid: Weather & AI Recommended Centres */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Weather Widget */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900">
            {t.dashboard.weatherTitle}
          </h3>
          <WeatherWidget
            weather={liveWeather}
            centreName={recommendedCentres[0]?.name || 'Indore Region Hub'}
          />
        </div>

        {/* AI Recommended Centres (Score / 100) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              <span>{t.dashboard.recommendedCentres}</span>
            </h3>
            <Link to="/centres" className="text-xs font-bold text-emerald-800 hover:underline">
              {t.dashboard.viewAllCentres} →
            </Link>
          </div>

          <div className="space-y-2.5">
            {recommendedCentres.slice(0, 3).map((centre) => (
              <div
                key={centre.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-emerald-300 transition-all shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {centre.district}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">
                      {centre.name}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500">
                    Est. Distance: <strong className="text-slate-800">{centre.distanceKm} km</strong> • Quota: <strong className="text-emerald-800">{centre.available_quota} Qtl</strong> • Queue: <strong className="text-slate-800">{centre.current_queue} vehicles</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  {/* Score Chip */}
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">AI Smart Score</span>
                    <span className="text-lg font-black text-emerald-800 font-mono">
                      {centre.smartScore}/100
                    </span>
                  </div>

                  <Link
                    to={`/book-slot?centreId=${centre.id}`}
                    className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-2 px-3 rounded-xl transition-colors shadow-sm"
                  >
                    Book Slot
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings & 9-Step Tracking Activity */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900">
            {t.dashboard.recentBookings}
          </h3>
          <Link to="/tracking" className="text-xs font-bold text-emerald-800 hover:underline">
            Track by Token →
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
            <CalendarCheck className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500 font-medium">
              No recent bookings found. Select a crop to book your procurement slot.
            </p>
            <Link
              to="/crops"
              className="inline-block bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl"
            >
              Browse Crops & Book Slot
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                    <th className="py-3 px-4">Booking Ref</th>
                    <th className="py-3 px-4">Gate Token</th>
                    <th className="py-3 px-4">Crop</th>
                    <th className="py-3 px-4">Total Qtl</th>
                    <th className="py-3 px-4">Slot Date</th>
                    <th className="py-3 px-4">Current Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentBookings.map((bk) => (
                    <tr key={bk.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {bk.booking_reference}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-extrabold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded border border-emerald-200">
                          {bk.token_number}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {bk.crop_name}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {bk.total_quantity} Qtl
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {bk.booking_date}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          bk.status === 'Payment Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}>
                          {bk.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to={`/tracking?token=${bk.token_number}`}
                          className="inline-flex items-center gap-1 font-bold text-emerald-800 hover:text-emerald-900 hover:underline"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Track 9-Stages</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

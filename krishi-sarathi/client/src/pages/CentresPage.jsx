import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { useLanguage } from '../context/LanguageContext';
import CentresMap from '../components/CentresMap';
import WeatherWidget from '../components/WeatherWidget';
import {
  MapPin,
  Award,
  CalendarCheck,
  Split,
  Search,
  Filter,
  Users,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

const DISTRICT_FILTERS = ['All', 'Indore', 'Dewas', 'Ujjain', 'Bhopal', 'Sehore'];

export default function CentresPage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCentre, setActiveCentre] = useState(null);

  useEffect(() => {
    async function loadCentres() {
      setLoading(true);
      try {
        const res = await api.get('/centres');
        if (res.data.success && res.data.centres) {
          setCentres(res.data.centres);
          if (res.data.centres.length > 0) {
            setActiveCentre(res.data.centres[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load centres:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCentres();
  }, []);

  const filteredCentres = centres.filter((c) => {
    const matchesDistrict = selectedDistrict === 'All' || c.district.toLowerCase() === selectedDistrict.toLowerCase();
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.district.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDistrict && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">
          State Mandi Network • Madhya Pradesh
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {t.centres.title}
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          {t.centres.subtitle}
        </p>
      </div>

      {/* Interactive Map Component */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <span>Interactive Mandi GIS Map</span>
          </h3>
          <span className="text-xs text-slate-500">
            Click pins to inspect queue & available quota
          </span>
        </div>

        <CentresMap
          centres={filteredCentres}
          selectedCentre={activeCentre}
          onSelectCentre={(c) => setActiveCentre(c)}
        />
      </div>

      {/* Search & District Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* District Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>{t.centres.filterDistrict}</span>
          </span>
          {DISTRICT_FILTERS.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDistrict(d)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedDistrict === d
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search mandi or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>
      </div>

      {/* Selected Centre Highlight / Weather Preview */}
      {activeCentre && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border-2 border-emerald-500/40 shadow-md space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    {activeCentre.district} • DEMO CENTRE
                  </span>
                  <span className="text-xs font-mono text-slate-400 font-bold">
                    {activeCentre.centre_code}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  {activeCentre.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {activeCentre.address}
                </p>
              </div>

              {/* Smart Score Pill */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2 text-right">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">AI Smart Score</span>
                <span className="text-2xl font-black text-emerald-900 font-mono">
                  {activeCentre.smartScore}/100
                </span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[11px] block">{t.centres.quotaAvailable}</span>
                <strong className="text-base font-extrabold text-emerald-800">
                  {activeCentre.available_quota} Qtl
                </strong>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[11px] block">{t.centres.dailyCapacity}</span>
                <strong className="text-base font-extrabold text-slate-900">
                  {activeCentre.daily_capacity} Qtl
                </strong>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[11px] block">{t.centres.currentQueue}</span>
                <strong className="text-base font-extrabold text-slate-900">
                  {activeCentre.current_queue} {t.centres.vehicles}
                </strong>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[11px] block">Estimated Distance:</span>
                <strong className="text-base font-extrabold text-slate-900">
                  {activeCentre.distanceKm} km
                </strong>
              </div>
            </div>

            {/* Direct Booking Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={() => navigate(`/split-selling?centreId=${activeCentre.id}`)}
                className="flex items-center gap-1.5 text-xs font-bold py-2.5 px-4 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors"
              >
                <Split className="w-3.5 h-3.5" />
                <span>Split Sell to This Mandi</span>
              </button>

              <button
                onClick={() => navigate(`/book-slot?centreId=${activeCentre.id}`)}
                className="flex items-center gap-1.5 text-xs font-bold py-2.5 px-5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white shadow-md shadow-emerald-800/10 transition-colors"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Book Direct Slot</span>
              </button>
            </div>
          </div>

          {/* Weather Widget for Active Centre */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              Live Mandi Weather
            </h4>
            <WeatherWidget weather={activeCentre.weather} centreName={activeCentre.name} />
          </div>
        </div>
      )}

      {/* Grid of all 10 centres */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCentres.map((centre) => {
          const isSelected = activeCentre?.id === centre.id;
          return (
            <div
              key={centre.id}
              onClick={() => setActiveCentre(centre)}
              className={`cursor-pointer rounded-2xl p-4 border transition-all text-left space-y-3 ${
                isSelected
                  ? 'bg-emerald-50/60 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                  : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded">
                    {centre.district} • DEMO
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-900 mt-1">
                    {centre.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate max-w-[220px]">
                    {centre.address}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Score</span>
                  <span className="text-base font-black text-emerald-800 font-mono">
                    {centre.smartScore}/100
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 block">Available Quota:</span>
                  <strong className="text-emerald-900">{centre.available_quota} Qtl</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Queue Size:</span>
                  <strong className="text-slate-800">{centre.current_queue} vehicles</strong>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-500 font-medium">
                  {centre.distanceKm} km from district center
                </span>
                <span className="text-xs font-bold text-emerald-800">
                  Select →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

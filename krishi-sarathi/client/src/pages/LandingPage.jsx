import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldCheck,
  Zap,
  Split,
  CloudSun,
  Truck,
  CreditCard,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Award
} from 'lucide-react';

export default function LandingPage() {
  const { quickLoginDemo } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const handleDemoLogin = async (role = 'farmer') => {
    await quickLoginDemo(role);
    if (role === 'operator') {
      navigate('/operator-portal');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-800/80 border border-emerald-600/60 px-4 py-1.5 rounded-full text-xs font-semibold text-emerald-200 shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Smart India Hackathon 2026 • Problem Statement: SIH26032 • Team: Off By One</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            {language === 'hi' ? 'स्मार्ट उपार्जन, सशक्त किसान' : 'Smart Procurement, Stronger Farmers'}
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-emerald-100/90 font-medium leading-relaxed">
            {language === 'hi'
              ? '24-48 घंटे की लंबी कतारों और अनिश्चितता को अलविदा कहें। कृषि सारथी के साथ स्मार्ट एआई स्कोरिंग, स्प्लिट सेलिंग, ओपन-मेटियो मौसम पूर्वानुमान और 9-चरणीय पारदर्शी उपार्जन का अनुभव लें।'
              : 'Eliminating 24-48 hour long mandi queues and harvest spoilage uncertainty. An intelligent procurement portal featuring AI centre recommendations, dynamic split selling, live Open-Meteo weather risk mitigation, and automated 9-step tracking.'}
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => handleDemoLogin('farmer')}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold px-6 py-3.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 text-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Demo Farmer Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleDemoLogin('operator')}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-xl border border-white/20 transition-all text-sm backdrop-blur-xs"
            >
              <span>Mandi Operator Console</span>
            </button>

            <Link
              to="/centres"
              className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-semibold px-5 py-3.5 rounded-xl border border-emerald-600/60 transition-all text-sm"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Explore 10 MP Mandis</span>
            </Link>
          </div>

          {/* Key Impact Stats (From Page 5 of PDF) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
              <span className="text-2xl sm:text-3xl font-black text-amber-400">60–70%</span>
              <p className="text-xs text-emerald-200 mt-1 font-medium">Wait Time Reduction</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
              <span className="text-2xl sm:text-3xl font-black text-emerald-300">100%</span>
              <p className="text-xs text-emerald-200 mt-1 font-medium">Concurrency Locked Quota</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
              <span className="text-2xl sm:text-3xl font-black text-amber-400">15–25%</span>
              <p className="text-xs text-emerald-200 mt-1 font-medium">Higher Farmer Realization</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
              <span className="text-2xl sm:text-3xl font-black text-emerald-300">9 Stages</span>
              <p className="text-xs text-emerald-200 mt-1 font-medium">End-to-End Visual Audit</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison: The Hard Journey vs The Smarter Journey (Page 5 in PDF) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Impact & Benefits
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Transforming the Farmer Procurement Experience
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            Direct comparison based on field research across Madhya Pradesh mandis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Today: The Hard Journey */}
          <div className="bg-rose-50/60 rounded-3xl p-6 sm:p-8 border border-rose-200 space-y-4">
            <div className="flex items-center gap-3 border-b border-rose-200/80 pb-3">
              <span className="bg-rose-600 text-white text-xs font-extrabold px-3 py-1 rounded-md uppercase">
                Today — The Hard Journey
              </span>
              <span className="text-xs text-rose-700 font-semibold">Uncertain • Delayed • Stressful</span>
            </div>
            <ul className="space-y-3.5 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">1</span>
                <div><strong>Blind Travelling to Centre:</strong> Farmers have no live info on which mandi has capacity or shortest line.</div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">2</span>
                <div><strong>24–48 Hour Waiting Queues:</strong> Uncontrolled arrival creates massive congestion and overnight tractor queues.</div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">3</span>
                <div><strong>Quota Exhaustion Surprises:</strong> Arriving at a mandi only to be told daily procurement quota has finished.</div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">4</span>
                <div><strong>Sudden Rain & Spoilage:</strong> Open-sky unloading without weather early warnings ruins harvested crop.</div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">5</span>
                <div><strong>No Payment Visibility:</strong> Unclear timelines on when DBT proceeds will actually credit the bank account.</div>
              </li>
            </ul>
          </div>

          {/* With Krishi Sarathi: The Smarter Journey */}
          <div className="bg-emerald-50/70 rounded-3xl p-6 sm:p-8 border border-emerald-300 space-y-4 shadow-sm">
            <div className="flex items-center gap-3 border-b border-emerald-200 pb-3">
              <span className="bg-emerald-700 text-white text-xs font-extrabold px-3 py-1 rounded-md uppercase">
                With Krishi Sarathi — The Smarter Journey
              </span>
              <span className="text-xs text-emerald-800 font-semibold">Guided • Connected • Empowered</span>
            </div>
            <ul className="space-y-3.5 text-xs text-slate-800">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div><strong>AI-Scored Centre Recommendations:</strong> Engine analyzes distance, queue size, available quota, and weather (Score /100).</div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div><strong>Dynamic Split Selling:</strong> Divide large harvest (e.g. 100 quintals) across multiple mandis to bypass bottlenecks.</div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div><strong>Central Quota Ledger & Atomic Locks:</strong> Eliminates double-booking and guarantees slot availability before you leave home.</div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div><strong>Open-Meteo Weather Rerouting:</strong> Rain alerts advise covered transport or one-click reallocation to indoor bays.</div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div><strong>9-Stage Live Audit & DBT Tracking:</strong> Gate scan, weighing, quality assessment, and bank credit visible in real time.</div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Competitive Matrix (Page 6 in PDF) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
          <div className="border-b border-slate-200 pb-4 mb-6">
            <h3 className="text-xl font-black text-slate-900">
              Feature Comparison: Krishi Sarathi vs Existing Platforms
            </h3>
            <p className="text-xs text-slate-500">
              Evaluated against e-Uparjan (MP), e-NAM, FRUITS (Karnataka), and Token Tuhar (CG).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider">
                  <th className="py-3 px-3">Feature Capability</th>
                  <th className="py-3 px-3 text-center">e-Uparjan</th>
                  <th className="py-3 px-3 text-center">e-NAM</th>
                  <th className="py-3 px-3 text-center">Token Tuhar</th>
                  <th className="py-3 px-3 text-center bg-emerald-50 text-emerald-900 font-black rounded-t-lg">
                    Krishi Sarathi (Proposed)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-800">Dynamic Split Selling (Multi-Centre)</td>
                  <td className="py-3 px-3 text-center text-rose-500 font-bold">✕</td>
                  <td className="py-3 px-3 text-center text-rose-500 font-bold">✕</td>
                  <td className="py-3 px-3 text-center text-rose-500 font-bold">✕</td>
                  <td className="py-3 px-3 text-center bg-emerald-50 text-emerald-700 font-bold">✓ (Core USP)</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-800">AI Smart Mandi Scoring (0–100)</td>
                  <td className="py-3 px-3 text-center text-rose-500 font-bold">✕</td>
                  <td className="py-3 px-3 text-center text-rose-500 font-bold">✕</td>
                  <td className="py-3 px-3 text-center text-rose-500 font-bold">✕</td>
                  <td className="py-3 px-3 text-center bg-emerald-50 text-emerald-700 font-bold">✓ Active</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-800">Live Weather Spoilage Alerts (Open-Meteo)</td>
                  <td className="py-3 px-3 text-center text-rose-500 font-bold">✕</td>
                  <td className="py-3 px-3 text-center text-rose-500 font-bold">✕</td>
                  <td className="py-3 px-3 text-center text-rose-500 font-bold">✕</td>
                  <td className="py-3 px-3 text-center bg-emerald-50 text-emerald-700 font-bold">✓ Active</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-800">Central Quota Ledger Concurrency Locks</td>
                  <td className="py-3 px-3 text-center text-amber-500 font-bold">Partial</td>
                  <td className="py-3 px-3 text-center text-amber-500 font-bold">Partial</td>
                  <td className="py-3 px-3 text-center text-amber-500 font-bold">Partial</td>
                  <td className="py-3 px-3 text-center bg-emerald-50 text-emerald-700 font-bold">✓ 100% Atomic</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-800">9-Stage Visual Procurement Timeline</td>
                  <td className="py-3 px-3 text-center text-amber-500 font-bold">Partial</td>
                  <td className="py-3 px-3 text-center text-rose-500 font-bold">✕</td>
                  <td className="py-3 px-3 text-center text-amber-500 font-bold">Partial</td>
                  <td className="py-3 px-3 text-center bg-emerald-50 text-emerald-700 font-bold">✓ Full Realtime</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to evaluate Krishi Sarathi?
            </h3>
            <p className="text-sm text-emerald-100 max-w-xl">
              Experience farmer registration, split selling across Madhya Pradesh mandis, weather risk calculation, and real-time gate operator updating.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleDemoLogin('farmer')}
              className="bg-white text-emerald-950 hover:bg-emerald-50 font-extrabold px-6 py-3 rounded-xl shadow-lg transition-colors text-sm"
            >
              Test as Demo Farmer
            </button>
            <Link
              to="/register"
              className="bg-emerald-700/80 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl border border-emerald-500 transition-colors text-sm"
            >
              New Registration
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

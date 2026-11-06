import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LogIn, Sparkles, AlertCircle, Lock, Mail, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const { login, loading, error, quickLoginDemo } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!email || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      if (res.user.role === 'operator') {
        navigate('/operator-portal');
      } else {
        navigate('/dashboard');
      }
    } else {
      setLocalError(res.message);
    }
  };

  const fillQuickDemo = async (roleType) => {
    const creds = {
      farmer: { email: 'farmer@krishisarathi.in', pass: 'Farmer@123' },
      operator: { email: 'operator@krishisarathi.in', pass: 'Operator@123' },
      admin: { email: 'admin@krishisarathi.in', pass: 'Admin@123' }
    };
    const c = creds[roleType];
    setEmail(c.email);
    setPassword(c.pass);
    const res = await login(c.email, c.pass);
    if (res.success) {
      if (roleType === 'operator') navigate('/operator-portal');
      else navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-lg shadow-emerald-800/20">
            <LogIn className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Farmer & Operator Login
          </h2>
          <p className="text-xs text-slate-500">
            Sign in to access your digital Kisan ID, bookings, and tracking
          </p>
        </div>

        {/* 1-Click Evaluation Shortcuts */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Hackathon Judges: 1-Click Demo Login</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => fillQuickDemo('farmer')}
              className="bg-white hover:bg-amber-100 text-slate-800 font-bold py-2 px-2.5 rounded-xl border border-amber-300 transition-colors shadow-xs text-left"
            >
              <span className="block text-[11px] text-emerald-800 font-extrabold">Demo Farmer</span>
              <span className="text-[10px] text-slate-500 truncate block">Rameshwar Patel</span>
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('operator')}
              className="bg-white hover:bg-amber-100 text-slate-800 font-bold py-2 px-2.5 rounded-xl border border-amber-300 transition-colors shadow-xs text-left"
            >
              <span className="block text-[11px] text-amber-900 font-extrabold">Mandi Officer</span>
              <span className="text-[10px] text-slate-500 truncate block">Indore Mandi Hub</span>
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {(localError || error) && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl flex items-center gap-2 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{localError || error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Registered Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farmer@krishisarathi.in"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Account Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold py-3 px-4 rounded-xl shadow-lg shadow-emerald-800/20 transition-all text-sm disabled:opacity-50"
          >
            {loading ? 'Authenticating with PostgreSQL...' : 'Sign In to Dashboard'}
          </button>
        </form>

        {/* Register link */}
        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-600">
          New farmer to the portal?{' '}
          <Link to="/register" className="font-bold text-emerald-800 hover:underline">
            Register and create Kisan ID
          </Link>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Shield, Globe, LogOut, User, Sparkles, Building2 } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout, quickLoginDemo } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Tricolor Government Strip */}
      <div className="h-1.5 w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]"></div>
        <div className="h-full w-1/3 bg-white"></div>
        <div className="h-full w-1/3 bg-[#138808]"></div>
      </div>

      {/* Top Govt / Hackathon Banner */}
      <div className="bg-emerald-950 text-white text-xs py-1.5 px-4 sm:px-8 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium tracking-wide">
            {t.brand.govt}
          </span>
        </div>
        <div className="flex items-center gap-3 text-emerald-200 text-xs">
          <span className="bg-emerald-900/80 px-2 py-0.5 rounded border border-emerald-700/60 font-mono">
            SIH 2026 • PS: SIH26032
          </span>
          <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-semibold border border-amber-500/40">
            Team: Off By One
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Portal Identity */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 17.93V15a1 1 0 0 0-2 0v4.93A8 8 0 0 1 4.07 13H9a1 1 0 0 0 0-2H4.07A8 8 0 0 1 11 4.07V9a1 1 0 0 0 2 0V4.07A8 8 0 0 1 19.93 11H15a1 1 0 0 0 0 2h4.93A8 8 0 0 1 13 19.93z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-emerald-900 tracking-tight">
                  {language === 'hi' ? 'कृषि सारथी' : 'KRISHI SARATHI'}
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                  MP Govt
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                {t.brand.subtitle}
              </p>
            </div>
          </Link>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors"
              title="Toggle Hindi / English"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <span>{language === 'hi' ? 'English' : 'हिन्दी'}</span>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Farmer / Operator chip */}
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-900">
                    {user?.full_name}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                    {user?.kisan_id || (user?.role === 'operator' ? 'Mandi Officer' : 'Govt Admin')}
                  </span>
                </div>

                <Link
                  to={user?.role === 'operator' ? '/operator-portal' : '/dashboard'}
                  className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow hover:bg-emerald-800 transition-colors"
                  title="Go to Dashboard"
                >
                  {user?.full_name?.charAt(0) || <User className="w-4 h-4" />}
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.nav.logout}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* 1-Click Demo Evaluation Shortcut */}
                <button
                  onClick={async () => {
                    await quickLoginDemo('farmer');
                    navigate('/dashboard');
                  }}
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors shadow-sm"
                  title="Instant 1-Click Evaluation Login"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Demo Farmer</span>
                </button>

                <Link
                  to="/login"
                  className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-sm"
                >
                  {t.nav.login}
                </Link>

                <Link
                  to="/register"
                  className="hidden md:inline-block text-xs font-semibold px-3.5 py-1.5 rounded-lg border border-emerald-700 text-emerald-800 hover:bg-emerald-50 transition-colors"
                >
                  {t.nav.register}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

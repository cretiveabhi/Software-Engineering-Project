import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  LayoutDashboard,
  Wheat,
  MapPin,
  CalendarCheck,
  Split,
  Truck,
  CreditCard,
  Building2,
  HelpCircle,
  PhoneCall
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const navItems = [
    { to: '/dashboard', label: t.nav.dashboard, icon: LayoutDashboard, badge: null },
    { to: '/crops', label: t.nav.crops, icon: Wheat, badge: 'MSP' },
    { to: '/centres', label: t.nav.centres, icon: MapPin, badge: '10 MP' },
    { to: '/book-slot', label: t.nav.bookSlot, icon: CalendarCheck, badge: null },
    { to: '/split-selling', label: t.nav.splitSelling, icon: Split, badge: 'Smart AI' },
    { to: '/tracking', label: t.nav.tracking, icon: Truck, badge: '9-Step' },
    { to: '/payments', label: t.nav.payments, icon: CreditCard, badge: 'DBT' },
    { to: '/operator-portal', label: t.nav.operatorPortal, icon: Building2, badge: 'Officer' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-5rem)] flex flex-col justify-between p-4 shadow-sm">
      <div className="space-y-6">
        {/* User Mini Card */}
        {user && (
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/70 border border-emerald-200/80 rounded-xl p-3.5 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-sm shadow">
                {user.full_name?.charAt(0) || 'K'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {user.full_name}
                </p>
                <p className="text-[11px] font-mono font-semibold text-emerald-800 truncate">
                  {user.kisan_id || 'KS-MP-2026'}
                </p>
              </div>
            </div>
            {user.village && (
              <div className="mt-2 pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[11px] text-slate-600">
                <span>{user.village}, {user.district}</span>
                <span className="font-semibold text-emerald-900">{user.land_area} Ac</span>
              </div>
            )}
          </div>
        )}

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-200">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Support / Help footer */}
      <div className="pt-4 border-t border-slate-200">
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs">
          <div className="flex items-center gap-2 text-emerald-900 font-bold mb-1">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
            <span>Kisan Call Centre (Toll-Free)</span>
          </div>
          <p className="text-slate-600 text-[11px]">
            1800-180-1551 (6 AM - 10 PM)
          </p>
          <div className="mt-2 text-[10px] text-slate-500 font-mono">
            Madhya Pradesh e-Procurement
          </div>
        </div>
      </div>
    </aside>
  );
}

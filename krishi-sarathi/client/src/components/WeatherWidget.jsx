import React from 'react';
import { Cloud, CloudRain, Sun, Wind, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function WeatherWidget({ weather, centreName }) {
  if (!weather) return null;

  const isRainRisk = weather.rainProbability > 30 || weather.alertLevel !== 'Normal';

  return (
    <div className={`rounded-2xl p-5 border transition-all shadow-sm ${
      weather.alertLevel === 'Severe Alert'
        ? 'bg-rose-50/80 border-rose-300'
        : weather.alertLevel === 'Moderate Risk'
        ? 'bg-amber-50/80 border-amber-300'
        : 'bg-emerald-50/70 border-emerald-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isRainRisk ? (
            <CloudRain className="w-5 h-5 text-amber-600" />
          ) : (
            <Sun className="w-5 h-5 text-amber-500" />
          )}
          <div>
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-700">
              Mandi Weather & Spoilage Forecast
            </h4>
            {centreName && (
              <p className="text-xs font-semibold text-slate-900 truncate">
                {centreName}
              </p>
            )}
          </div>
        </div>

        {/* Source Badge */}
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
          weather.isLive
            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
            : 'bg-slate-100 text-slate-700 border-slate-300'
        }`}>
          {weather.isLive ? '● Live Open-Meteo' : '● Demo / Cached Weather'}
        </span>
      </div>

      {/* Weather Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-3">
        <div className="bg-white/90 p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">Temperature</span>
          <p className="text-lg font-extrabold text-slate-900">
            {weather.temperature}°C
          </p>
        </div>

        <div className="bg-white/90 p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">Rain Probability</span>
          <p className={`text-lg font-extrabold ${weather.rainProbability > 40 ? 'text-rose-600' : 'text-slate-900'}`}>
            {weather.rainProbability}%
          </p>
        </div>

        <div className="bg-white/90 p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">Wind Speed</span>
          <p className="text-lg font-extrabold text-slate-900">
            {weather.windSpeed} km/h
          </p>
        </div>

        <div className="bg-white/90 p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">Air Humidity</span>
          <p className="text-lg font-extrabold text-slate-900">
            {weather.humidity || 52}%
          </p>
        </div>
      </div>

      {/* Advisory Message */}
      <div className={`mt-3 p-3 rounded-xl flex items-start gap-2.5 text-xs ${
        weather.alertLevel === 'Severe Alert'
          ? 'bg-rose-100/90 text-rose-900 border border-rose-300'
          : weather.alertLevel === 'Moderate Risk'
          ? 'bg-amber-100/90 text-amber-900 border border-amber-300'
          : 'bg-emerald-100/90 text-emerald-900 border border-emerald-300'
      }`}>
        {isRainRisk ? (
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-700 mt-0.5" />
        ) : (
          <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-700 mt-0.5" />
        )}
        <div>
          <p className="font-bold">{weather.conditionText}</p>
          <p className="text-[11px] mt-0.5 opacity-90">{weather.alertMessage}</p>
        </div>
      </div>
    </div>
  );
}

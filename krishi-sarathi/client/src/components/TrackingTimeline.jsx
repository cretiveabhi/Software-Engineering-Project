import React from 'react';
import {
  CheckCircle2,
  Clock,
  Circle,
  FileCheck,
  Calendar,
  QrCode,
  Truck,
  Scale,
  Microscope,
  PackageCheck,
  Send,
  BadgeCheck
} from 'lucide-react';

const STEP_ICONS = {
  1: FileCheck,
  2: Calendar,
  3: QrCode,
  4: Truck,
  5: Scale,
  6: Microscope,
  7: PackageCheck,
  8: Send,
  9: BadgeCheck
};

export default function TrackingTimeline({ timeline = [], currentStep = 1 }) {
  if (!timeline || timeline.length === 0) return null;

  return (
    <div className="py-4">
      {/* Horizontal Progress Bar on larger screens */}
      <div className="hidden lg:grid grid-cols-9 gap-1 mb-8 relative">
        <div className="absolute top-4 left-6 right-6 h-1 bg-slate-200 -z-0">
          <div
            className="h-full bg-emerald-600 transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, ((currentStep - 1) / 8) * 100))}%` }}
          />
        </div>

        {timeline.map((stage) => {
          const isDone = stage.status === 'COMPLETED' || stage.step < currentStep;
          const isCurrent = stage.step === currentStep;
          const Icon = STEP_ICONS[stage.step] || Circle;

          return (
            <div key={stage.step} className="flex flex-col items-center text-center relative z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                  isDone
                    ? 'bg-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse'
                    : 'bg-white text-slate-400 border-2 border-slate-300'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
              </div>
              <span className={`text-[11px] font-bold mt-2 leading-tight ${
                isCurrent ? 'text-amber-800' : isDone ? 'text-emerald-900' : 'text-slate-400'
              }`}>
                {stage.step}. {stage.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Detailed Vertical Cards for Each Stage */}
      <div className="space-y-4">
        {timeline.map((stage) => {
          const isDone = stage.status === 'COMPLETED' || stage.step < currentStep;
          const isCurrent = stage.step === currentStep;
          const Icon = STEP_ICONS[stage.step] || Circle;

          return (
            <div
              key={stage.step}
              className={`rounded-2xl p-4 sm:p-5 border transition-all ${
                isCurrent
                  ? 'bg-amber-50/80 border-amber-300 shadow-md ring-1 ring-amber-200'
                  : isDone
                  ? 'bg-white border-emerald-200 shadow-xs'
                  : 'bg-slate-50/70 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm ${
                      isDone
                        ? 'bg-emerald-700 text-white'
                        : isCurrent
                        ? 'bg-amber-600 text-white animate-pulse'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                        Step {stage.step} of 9
                      </span>
                      {stage.timestamp && (
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {new Date(stage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, {new Date(stage.timestamp).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
                      {stage.name}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">{stage.shortDesc}</p>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border ${
                    isDone
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : isCurrent
                      ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                      : 'bg-slate-100 text-slate-500 border-slate-300'
                  }`}
                >
                  {isDone ? '✓ Completed' : isCurrent ? '● In Progress' : 'Pending'}
                </span>
              </div>

              {/* Stage Specific Telemetry Details */}
              {(stage.netWeight || stage.moisturePercentage || stage.operatorNotes) && (
                <div className="mt-3.5 pt-3.5 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {/* Weighbridge Net Weight */}
                  {stage.netWeight && (
                    <div className="bg-slate-100/80 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[11px] text-slate-500 block">Weighed Net Weight:</span>
                      <strong className="text-sm font-extrabold text-slate-900">
                        {stage.netWeight} Quintals
                      </strong>
                      <span className="text-[10px] text-slate-500 block">
                        (Gross: {stage.grossWeight} - Tare: {stage.tareWeight})
                      </span>
                    </div>
                  )}

                  {/* Quality & Moisture */}
                  {stage.moisturePercentage && (
                    <div className="bg-slate-100/80 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[11px] text-slate-500 block">Moisture Assessment:</span>
                      <strong className="text-sm font-extrabold text-emerald-800">
                        {stage.moisturePercentage}% ({stage.qualityGrade || 'FAQ Grade-A'})
                      </strong>
                      <span className="text-[10px] text-slate-500 block">
                        Complies with FCI standard &lt;12%
                      </span>
                    </div>
                  )}

                  {/* Operator Remarks */}
                  {stage.operatorNotes && (
                    <div className="sm:col-span-3 bg-white p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-700">
                      <span className="font-semibold text-emerald-950 block mb-0.5">
                        Officer Log ({stage.operatorName || 'Mandi Inspector'}):
                      </span>
                      <span>"{stage.operatorNotes}"</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

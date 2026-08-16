import React from 'react';
import { ZapOff, Zap, MapPin, Loader2 } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations.js';

export default function ReportButtons({ onTriggerReport, isLocating, isDarkMode, lang }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <div className={`p-4 border-t backdrop-blur sticky bottom-0 z-40 transition-colors ${
      isDarkMode 
        ? 'bg-slate-950/90 border-slate-800 text-slate-100' 
        : 'bg-white/90 border-slate-200 text-slate-900 shadow-lg'
    }`}>
      <div className="text-xs mb-2 flex items-center justify-between">
        <span className={`flex items-center gap-1 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          <MapPin className="w-3.5 h-3.5 text-amber-500" />
          {t.gpsActive}
        </span>
        <span className={`text-[11px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.noLogin}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          disabled={isLocating}
          onClick={() => onTriggerReport('cut')}
          className="flex items-center justify-center space-x-2 bg-rose-600 hover:bg-rose-700 active:scale-98 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-rose-600/20 transition-all border border-rose-500/50"
        >
          {isLocating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <ZapOff className="w-5 h-5" />
              <span>{t.reportCut}</span>
            </>
          )}
        </button>

        <button
          disabled={isLocating}
          onClick={() => onTriggerReport('restored')}
          className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 active:scale-98 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-600/20 transition-all border border-emerald-500/50"
        >
          {isLocating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Zap className="w-5 h-5 fill-white" />
              <span>{t.reportRestored}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

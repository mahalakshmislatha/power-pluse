import React from 'react';
import { Zap, Activity, Sun, Moon, User, Settings, LogIn, Globe } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations.js';

export default function Header({ activeOutagesCount, isDarkMode, setIsDarkMode, user, onOpenAuth, onOpenProfile, lang, setLang }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <header className={`px-4 py-3 sticky top-0 z-50 flex items-center justify-between border-b transition-colors ${
      isDarkMode 
        ? 'bg-slate-950/90 backdrop-blur border-slate-800 text-slate-100' 
        : 'bg-white/90 backdrop-blur border-slate-200 text-slate-900 shadow-sm'
    }`}>
      <div className="flex items-center space-x-2">
        <div className="bg-amber-500/20 p-2 rounded-xl border border-amber-500/30 text-amber-500">
          <Zap className="w-6 h-6 fill-amber-400 text-amber-500" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight flex items-center gap-1.5">
            {t.title}
            <span className="text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded font-mono uppercase">TN</span>
          </h1>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {t.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Active Outages Badge */}
        <div className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs border ${
          isDarkMode 
            ? 'bg-slate-900 border-slate-800 text-slate-300' 
            : 'bg-slate-100 border-slate-200 text-slate-700'
        }`}>
          <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span className="font-medium">
            <strong className="text-rose-500">{activeOutagesCount}</strong> {t.activeCuts}
          </span>
        </div>

        {/* Language Switcher Button */}
        <button
          onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl border font-bold text-xs bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25 transition-all shadow-sm"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{lang === 'en' ? 'தமிழ்' : 'English'}</span>
        </button>

        {/* Theme Switcher Button */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          aria-label="Toggle Theme"
          className={`p-2 rounded-xl border transition-all flex items-center gap-1 text-xs font-semibold ${
            isDarkMode
              ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800'
              : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
          }`}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {/* User Profile / Auth Button */}
        {user?.isLoggedIn ? (
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-slate-900 dark:text-slate-100 hover:bg-amber-500/25 transition-all text-xs font-bold shadow-sm"
          >
            <div className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:inline">{user.name}</span>
            <Settings className="w-3.5 h-3.5 text-amber-500" />
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-md transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}

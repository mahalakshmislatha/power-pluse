import React from 'react';
import { Map, Search, Calendar, PhoneCall, Zap } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations.js';

export default function Navbar({ activeTab, setActiveTab, isDarkMode, lang }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const tabs = [
    { id: 'map', label: t.tabMap, icon: Map },
    { id: 'districts', label: t.tabDistricts, icon: Search },
    { id: 'shutdowns', label: t.tabShutdowns, icon: Calendar },
    { id: 'eb-services', label: t.tabEbServices, icon: Zap },
    { id: 'complaint', label: t.tabComplaint, icon: PhoneCall },
  ];

  return (
    <nav className={`px-4 py-2 border-b flex items-center justify-between overflow-x-auto transition-colors ${
      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
    }`}>
      <div className="flex items-center gap-1 sm:gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? isDarkMode
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm shadow-amber-500/10 font-bold'
                    : 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : isDarkMode
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <Icon className={`w-4 h-4 ${
                isActive 
                  ? (isDarkMode ? 'text-amber-400' : 'text-slate-950') 
                  : (isDarkMode ? 'text-slate-400' : 'text-slate-500')
              }`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

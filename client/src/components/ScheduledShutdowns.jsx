import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertCircle, ExternalLink, ZapOff, MapPin, Wrench } from 'lucide-react';
import { TN_DISTRICTS } from '../data/tnDistricts.js';

export default function ScheduledShutdowns({ isDarkMode }) {
  const [shutdowns, setShutdowns] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('All');

  useEffect(() => {
    fetch('/api/scheduled-shutdowns')
      .then(res => res.json())
      .then(data => setShutdowns(data))
      .catch(err => console.error('Error fetching scheduled shutdowns:', err));
  }, []);

  const allDistrictNames = ['All', ...TN_DISTRICTS.map(d => d.name)];

  const filteredShutdowns = selectedDistrict === 'All'
    ? shutdowns
    : shutdowns.filter(s => s.district.toLowerCase() === selectedDistrict.toLowerCase());

  return (
    <div className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 transition-colors ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Banner */}
      <div className={`p-6 rounded-2xl border shadow-xl transition-all ${
        isDarkMode
          ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/20'
          : 'bg-gradient-to-r from-amber-50 via-white to-amber-50 border-amber-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-500 rounded-xl border border-amber-500/30">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">
              TNEB / TANGEDCO Scheduled Maintenance Shutdowns
            </h2>
            <p className={`text-xs sm:text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Planned sub-station maintenance and feeder repair schedules across all 38 Tamil Nadu districts. Plan your day accordingly!
            </p>
          </div>
        </div>

        {/* District Filter Dropdown & Pills */}
        <div className="mt-5 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <label className="text-xs font-semibold uppercase tracking-wider">
              Filter District:
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className={`border rounded-xl px-4 py-2 text-sm font-medium focus:outline-none cursor-pointer ${
                isDarkMode 
                  ? 'bg-slate-950 border-slate-700 text-slate-100' 
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              {allDistrictNames.map(d => (
                <option key={d} value={d}>{d === 'All' ? 'All 38 Districts' : `${d} District`}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Shutdown Cards Grid */}
      {filteredShutdowns.length === 0 ? (
        <div className={`text-center py-16 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900/50 border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-500 shadow-sm'
        }`}>
          <ZapOff className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="font-bold text-base">No Scheduled Shutdowns Logged for {selectedDistrict}</h3>
          <p className="text-xs text-slate-400 mt-1">No planned maintenance shutdowns currently registered for this district.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredShutdowns.map((item) => (
            <div
              key={item.id}
              className={`border rounded-2xl p-5 transition-all shadow-md flex flex-col justify-between ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-800 hover:border-amber-500/40' 
                  : 'bg-white border-slate-200 hover:border-amber-400 shadow-sm'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
                      {item.district} District
                    </span>
                    <h3 className="text-base font-bold mt-2 flex items-center gap-1.5">
                      <Wrench className="w-4 h-4 text-amber-500 shrink-0" />
                      {item.substation}
                    </h3>
                  </div>

                  <span className={`text-xs px-2.5 py-1 rounded-lg border font-medium whitespace-nowrap ${
                    isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}>
                    📅 {item.date}
                  </span>
                </div>

                {/* Time Window & Reason */}
                <div className={`mt-4 space-y-2 p-3.5 rounded-xl border text-xs ${
                  isDarkMode ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center text-amber-600 dark:text-amber-300 font-bold gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Time Window: {item.timeWindow}</span>
                  </div>
                  <div className={`flex items-start gap-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span><strong>Reason:</strong> {item.reason}</span>
                  </div>
                </div>

                {/* Affected Areas */}
                <div className="mt-4">
                  <span className={`text-xs font-semibold flex items-center gap-1 mb-2 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    Affected Streets & Towns:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.areas.map((area, idx) => (
                      <span
                        key={idx}
                        className={`text-[11px] px-2.5 py-1 rounded-md border font-medium ${
                          isDarkMode 
                            ? 'bg-slate-800 text-slate-300 border-slate-700' 
                            : 'bg-slate-100 text-slate-800 border-slate-300'
                        }`}
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className={`text-[11px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  TANGEDCO Official Notice
                </span>
                <a
                  href={item.tneblink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                >
                  View TNEB Notice <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

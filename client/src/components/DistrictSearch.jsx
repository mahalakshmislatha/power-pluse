import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, AlertTriangle, Clock, ThumbsUp, Filter, MapPin, Building2, ChevronRight } from 'lucide-react';
import { TN_DISTRICTS } from '../data/tnDistricts.js';

export default function DistrictSearch({ reports, onConfirmReport, isDarkMode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('Chennai');
  const [selectedTown, setSelectedTown] = useState('All');
  const [filterType, setFilterType] = useState('all'); // all, cut, restored
  const [districtsSummary, setDistrictsSummary] = useState([]);

  useEffect(() => {
    fetch('/api/districts')
      .then(res => res.json())
      .then(data => setDistrictsSummary(data))
      .catch(err => console.error('Error fetching district summary:', err));
  }, [reports]);

  // Combine dataset with server summary metrics
  const fullDistrictsList = TN_DISTRICTS.map(d => {
    const summary = districtsSummary.find(s => s.name.toLowerCase() === d.name.toLowerCase());
    return {
      ...d,
      activeCuts: summary ? summary.activeCuts : 0,
      upcomingShutdowns: summary ? summary.upcomingShutdowns : 0,
      totalReports: summary ? summary.totalReports : 0,
      status: summary ? summary.status : 'Normal'
    };
  });

  const activeDistrictData = fullDistrictsList.find(d => d.name.toLowerCase() === selectedDistrict.toLowerCase()) || fullDistrictsList[0];

  const filteredReports = reports.filter(r => {
    const matchesSearch = 
      r.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reason.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesDistrict = selectedDistrict === 'All' || r.district.toLowerCase() === selectedDistrict.toLowerCase();
    const matchesTown = selectedTown === 'All' || r.area.toLowerCase().includes(selectedTown.toLowerCase());
    const matchesType = filterType === 'all' || r.type === filterType;

    return matchesSearch && matchesDistrict && matchesTown && matchesType;
  });

  const getTimeAgo = (isoString) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} mins ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours} hours ago`;
  };

  return (
    <div className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 transition-colors ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Banner */}
      <div className={`p-6 rounded-2xl border shadow-xl transition-all ${
        isDarkMode
          ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-slate-800'
          : 'bg-gradient-to-r from-amber-50 via-white to-amber-50 border-slate-200'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Search className="w-6 h-6 text-amber-500" />
              All 38 Districts & Towns Power Status Tracker
            </h2>
            <p className={`text-xs sm:text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Select any Tamil Nadu district to explore towns/taluks, active power cuts, and scheduled outage status.
            </p>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono uppercase self-start md:self-auto border ${
            isDarkMode ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-amber-500/20 text-amber-800 border-amber-500/40'
          }`}>
            38 TN Districts Ready
          </span>
        </div>

        {/* Search Bar & District Dropdown */}
        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search town/area (e.g. T. Nagar, Gandhipuram, Srirangam, Palani)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                isDarkMode 
                  ? 'bg-slate-950 border-slate-700 text-slate-100 placeholder-slate-500' 
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          <select
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              setSelectedTown('All');
            }}
            className={`border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none cursor-pointer ${
              isDarkMode 
                ? 'bg-slate-950 border-slate-700 text-slate-100' 
                : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <option value="All">All Districts (38)</option>
            {fullDistrictsList.map(d => (
              <option key={d.name} value={d.name}>{d.name} ({d.towns.length} Towns)</option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected District & Towns Information Spotlight */}
      {activeDistrictData && selectedDistrict !== 'All' && (
        <div className={`p-5 rounded-2xl border transition-all space-y-3 ${
          isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="font-bold text-base sm:text-lg">
                  {activeDistrictData.name} District Overview
                </h3>
                <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Zone: {activeDistrictData.zone} Tamil Nadu | HQ: {activeDistrictData.headquarters}
                </span>
              </div>
            </div>

            <div className="flex gap-2 text-xs">
              <span className={`px-2.5 py-1 rounded-lg border font-medium ${
                activeDistrictData.activeCuts > 0 
                  ? 'bg-rose-500/10 text-rose-500 border-rose-500/30' 
                  : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
              }`}>
                {activeDistrictData.activeCuts > 0 ? `${activeDistrictData.activeCuts} Active Outages` : '✅ Grid Normal'}
              </span>
            </div>
          </div>

          {/* Towns / Taluks Pills */}
          <div>
            <span className={`text-xs font-semibold uppercase tracking-wider block mb-2 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Towns & Sub-areas in {activeDistrictData.name}:
            </span>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTown('All')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedTown === 'All'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Towns ({activeDistrictData.towns.length})
              </button>

              {activeDistrictData.towns.map((town) => (
                <button
                  key={town}
                  onClick={() => setSelectedTown(town)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedTown === town
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : isDarkMode 
                        ? 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-amber-500/50' 
                        : 'bg-slate-50 border border-slate-300 text-slate-800 hover:border-amber-500'
                  }`}
                >
                  📍 {town}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Horizontal Scroll of All 38 Districts */}
      <div>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${
          isDarkMode ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Select District (38 Districts of Tamil Nadu)
        </h3>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {fullDistrictsList.map((d) => (
            <div
              key={d.name}
              onClick={() => {
                setSelectedDistrict(d.name);
                setSelectedTown('All');
              }}
              className={`min-w-[170px] p-3.5 rounded-xl border transition-all cursor-pointer flex-shrink-0 ${
                selectedDistrict === d.name
                  ? 'bg-amber-500/15 border-amber-500 shadow-md shadow-amber-500/10'
                  : isDarkMode 
                    ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700' 
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">{d.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                  d.activeCuts > 0 ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/20 text-emerald-500'
                }`}>
                  {d.activeCuts > 0 ? `${d.activeCuts} Cuts` : 'OK'}
                </span>
              </div>

              <p className={`text-[11px] mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {d.towns.length} Towns / Areas
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Reports Feed */}
      <div className={`p-5 rounded-2xl border transition-all space-y-4 ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-base sm:text-lg">
              Live Outage Reports for {selectedDistrict} {selectedTown !== 'All' && `(Town: ${selectedTown})`}
            </h3>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
              isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-800'
            }`}>
              {filteredReports.length} reports
            </span>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            {['all', 'cut', 'restored'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  filterType === type
                    ? 'bg-amber-500 text-slate-950'
                    : isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-slate-200' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {type === 'cut' ? 'Power Cuts' : type === 'restored' ? 'Restored' : 'All'}
              </button>
            ))}
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className={`text-center py-12 rounded-xl border border-dashed ${
            isDarkMode ? 'bg-slate-950/50 border-slate-800 text-slate-500' : 'bg-slate-50 border-slate-300 text-slate-500'
          }`}>
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-medium">No power outages reported for {selectedDistrict} {selectedTown !== 'All' && `(${selectedTown})`}.</p>
            <p className="text-xs text-slate-400 mt-1">Grid is functioning normally or try selecting another district.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredReports.map((r) => (
              <div
                key={r.id}
                className={`border rounded-xl p-4 flex flex-col justify-between transition-all ${
                  isDarkMode 
                    ? 'bg-slate-950 border-slate-800/80 hover:border-slate-700' 
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {r.type === 'cut' ? (
                        <div className="p-2 bg-rose-500/10 text-rose-500 rounded-lg border border-rose-500/20">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg border border-emerald-500/20">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-sm">{r.area}</h4>
                        <p className={`text-xs flex items-center gap-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {r.district} District
                        </p>
                      </div>
                    </div>

                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      r.type === 'cut' ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/20 text-emerald-500'
                    }`}>
                      {r.type === 'cut' ? 'Power Cut' : 'Restored'}
                    </span>
                  </div>

                  <div className={`mt-3 grid grid-cols-2 gap-2 text-xs p-2.5 rounded-lg border ${
                    isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div>
                      <span className={`block text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Reason:</span>
                      <span className="capitalize font-medium">{r.reason}</span>
                    </div>
                    <div>
                      <span className={`block text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Reported:</span>
                      <span className="font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {getTimeAgo(r.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                    👍 <span className="font-semibold">{r.confirmations}</span> confirmations
                  </span>

                  <button
                    onClick={() => onConfirmReport(r.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 rounded-lg text-xs font-medium transition-all"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    Me Too
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { X, MapPin, Send, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ReportModal({ pendingReport, onClose, onSubmit, isDarkMode }) {
  const [areaName, setAreaName] = useState(pendingReport?.locationInfo?.area || 'Tamil Nadu Locality');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!pendingReport) return null;

  const isCut = pendingReport.type === 'cut';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit({
      type: pendingReport.type,
      lat: pendingReport.coords.lat,
      lng: pendingReport.coords.lng,
      area: areaName,
      district: pendingReport.locationInfo?.district || 'Tamil Nadu'
    });
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className={`border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl transition-all ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className={`p-4 border-b flex items-center justify-between ${
          isCut ? 'bg-rose-500/10 border-rose-500/30' : 'bg-emerald-500/10 border-emerald-500/30'
        }`}>
          <div className="flex items-center space-x-2">
            {isCut ? (
              <AlertTriangle className="w-5 h-5 text-rose-500" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            )}
            <h2 className="font-bold">
              Report {isCut ? 'Power Outage' : 'Power Restored'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Detected Location (Area & District)
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-3 text-amber-500" />
              <input
                type="text"
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
                className={`w-full border rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                  isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
                placeholder="Area or Locality name"
                required
              />
            </div>
            <p className={`text-[11px] mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              GPS: {pendingReport.coords.lat.toFixed(4)}, {pendingReport.coords.lng.toFixed(4)}
            </p>
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-xs font-medium rounded-xl border ${
                isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center space-x-1.5 px-5 py-2 text-xs font-bold text-white rounded-xl shadow-md transition-all ${
                isCut ? 'bg-rose-600 hover:bg-rose-500' : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Submitting...' : 'Confirm & Post'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

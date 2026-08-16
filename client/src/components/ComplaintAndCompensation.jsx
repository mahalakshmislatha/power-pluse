import React, { useState } from 'react';
import { PhoneCall, Send, Calculator, Copy, Check, ShieldCheck, AlertCircle, FileText, ExternalLink } from 'lucide-react';
import { TN_DISTRICTS } from '../data/tnDistricts.js';

export default function ComplaintAndCompensation({ isDarkMode }) {
  // Complaint Form State
  const [area, setArea] = useState('');
  const [district, setDistrict] = useState('Chennai');
  const [consumerNo, setConsumerNo] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [description, setDescription] = useState('');
  const [loggedComplaint, setLoggedComplaint] = useState(null);
  const [copiedDraft, setCopiedDraft] = useState(false);

  // Compensation Calculator State
  const [areaType, setAreaType] = useState('urban'); // urban, rural, metro
  const [outageHours, setOutageHours] = useState(8);
  const [outageType, setOutageType] = useState('unscheduled'); // unscheduled, scheduled

  const handleLogComplaint = async (e) => {
    e.preventDefault();
    if (!area) return;

    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ area, district, consumerNo, contactNo, description })
      });

      if (res.ok) {
        const data = await res.json();
        setLoggedComplaint(data);
      }
    } catch (err) {
      console.error('Complaint submit error:', err);
    }
  };

  // TNERC Standard Compensation Logic
  const thresholdHours = areaType === 'rural' ? 12 : 6;
  const excessHours = Math.max(0, outageHours - thresholdHours);
  const estimatedCompensation = outageType === 'unscheduled' ? excessHours * 50 : 0;

  const complaintDraftText = `TNEB MINNAGAM COMPLAINT REPORT
District: ${district}
Area: ${area || 'Neighborhood'}
Consumer No: ${consumerNo || 'Not provided'}
Outage Duration: ${outageHours} hours (${outageType})
Contact: ${contactNo || 'N/A'}
Details: ${description || 'Unscheduled power outage without prior notice.'}
-- Logged via PowerPulse TN`;

  const copyDraft = () => {
    navigator.clipboard.writeText(complaintDraftText);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2500);
  };

  return (
    <div className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 transition-colors ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Top Banner - 1912 Helpline */}
      <div className={`p-6 rounded-2xl border shadow-xl transition-all ${
        isDarkMode
          ? 'bg-gradient-to-r from-rose-950/60 via-slate-900 to-amber-950/40 border-rose-500/30'
          : 'bg-gradient-to-r from-rose-50 via-white to-amber-50 border-rose-200'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-6 h-6 text-rose-500 animate-pulse" />
              <h2 className="text-xl sm:text-2xl font-bold">
                Official TNEB Minnagam 1912 Helpline
              </h2>
            </div>
            <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Official 24x7 Customer Care Helpline for power outage complaints across all 38 districts of Tamil Nadu.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <a
              href="tel:1912"
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg shadow-rose-600/30 transition-all text-sm"
            >
              <PhoneCall className="w-4 h-4" />
              Call 1912 Minnagam
            </a>

            <a
              href="https://npp.tangedco.org/tangedco/"
              target="_blank"
              rel="noreferrer"
              className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl border transition-all text-sm font-semibold ${
                isDarkMode 
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                  : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-sm'
              }`}
            >
              Minnagam Portal <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Grid: Complaint Form + Compensation Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Complaint Logger */}
        <div className={`border rounded-2xl p-5 sm:p-6 transition-all space-y-5 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold">
              Log Power Outage Complaint
            </h3>
          </div>

          {loggedComplaint ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-emerald-600 dark:text-emerald-300 space-y-3">
              <div className="flex items-center gap-2 font-bold text-base">
                <Check className="w-5 h-5 text-emerald-500" />
                Complaint Logged Successfully!
              </div>
              <div className={`text-xs space-y-1 p-3 rounded-lg border ${
                isDarkMode ? 'bg-slate-950/60 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
              }`}>
                <p><strong>Ticket ID:</strong> <span className="font-mono font-bold text-emerald-500">{loggedComplaint.id}</span></p>
                <p><strong>Area:</strong> {loggedComplaint.area}, {loggedComplaint.district}</p>
                <p><strong>Status:</strong> {loggedComplaint.status}</p>
              </div>
              <button
                onClick={() => setLoggedComplaint(null)}
                className="text-xs bg-slate-800 text-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-700"
              >
                Log Another Complaint
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogComplaint} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block mb-1 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    District (38 TN Districts) *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className={`w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                      isDarkMode ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  >
                    {TN_DISTRICTS.map(d => (
                      <option key={d.name} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block mb-1 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Town / Area *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. T. Nagar, Gandhipuram"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className={`w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                      isDarkMode ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block mb-1 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    TNEB Consumer No (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="12-digit Consumer Number"
                    value={consumerNo}
                    onChange={(e) => setConsumerNo(e.target.value)}
                    className={`w-full border rounded-xl px-3 py-2 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                      isDarkMode ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block mb-1 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Contact Phone No
                  </label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                    className={`w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                      isDarkMode ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block mb-1 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Complaint Details
                </label>
                <textarea
                  rows="3"
                  placeholder="Describe the outage issue (e.g., Low voltage, prolonged power cut)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                    isDarkMode ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                ></textarea>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl shadow-md transition-all text-xs sm:text-sm"
                >
                  <Send className="w-4 h-4" />
                  Log Complaint & Get Reference Ticket
                </button>

                <button
                  type="button"
                  onClick={copyDraft}
                  className={`flex items-center justify-center gap-2 border px-4 py-2.5 rounded-xl text-xs transition-all ${
                    isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  }`}
                >
                  {copiedDraft ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                  {copiedDraft ? 'Copied Draft!' : 'Copy WhatsApp Draft'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: TNERC Calculator */}
        <div className={`border rounded-2xl p-5 sm:p-6 transition-all space-y-5 flex flex-col justify-between ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-bold">
                TNERC Outage Compensation Calculator
              </h3>
            </div>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Based on Tamil Nadu Electricity Regulatory Commission (TNERC) Standards of Performance rules.
            </p>

            <div className="mt-5 space-y-4 text-xs sm:text-sm">
              <div>
                <label className={`block mb-1 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Area Category:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'urban', label: 'Urban / City (6h limit)' },
                    { id: 'metro', label: 'Metro (6h limit)' },
                    { id: 'rural', label: 'Rural (12h limit)' }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setAreaType(type.id)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        areaType === type.id
                          ? 'bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-300 font-bold'
                          : isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-300 text-slate-600'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className={`font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Total Outage Duration:
                  </label>
                  <span className="text-amber-600 dark:text-amber-400 font-bold text-base">{outageHours} Hours</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="24"
                  value={outageHours}
                  onChange={(e) => setOutageHours(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <label className={`block mb-1 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Outage Type:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setOutageType('unscheduled')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      outageType === 'unscheduled'
                        ? 'bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-300 font-bold'
                        : isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-300 text-slate-600'
                    }`}
                  >
                    ⚡ Unscheduled Outage
                  </button>
                  <button
                    onClick={() => setOutageType('scheduled')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      outageType === 'scheduled'
                        ? 'bg-slate-800 border-slate-600 text-slate-200 font-bold'
                        : isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-300 text-slate-600'
                    }`}
                  >
                    📅 Scheduled Shutdown
                  </button>
                </div>
              </div>
            </div>

            {/* Compensation Box */}
            <div className={`mt-5 p-4 rounded-xl border space-y-2 ${
              isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Estimated TNERC Compensation:
                </span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  ₹{estimatedCompensation}
                </span>
              </div>
              
              {excessHours > 0 && outageType === 'unscheduled' ? (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-300 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Eligible! Outage exceeded the {thresholdHours}-hour limit by {excessHours} hours (@ ₹50/hr).
                </p>
              ) : (
                <p className={`text-[11px] flex items-center gap-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  <AlertCircle className="w-3.5 h-3.5" />
                  {outageType === 'scheduled' 
                    ? 'Scheduled maintenance shutdowns are exempt from standard compensation.' 
                    : `Unscheduled outages under ${thresholdHours} hours in ${areaType} areas do not qualify for compensation.`}
                </p>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] flex items-center justify-between">
            <span className={isDarkMode ? 'text-slate-500' : 'text-slate-500'}>TNERC Consumer Forum Redressal</span>
            <a
              href="https://www.tnerc.gov.in/"
              target="_blank"
              rel="noreferrer"
              className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-semibold"
            >
              TNERC Official Site <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

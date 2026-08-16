import React, { useState } from 'react';
import { X, User, Settings, Bell, Shield, LogOut, MapPin, CreditCard, Save, Globe, Moon, Sun, Check, Zap, FileText } from 'lucide-react';
import { TN_DISTRICTS } from '../data/tnDistricts.js';

export default function UserProfileModal({ isOpen, onClose, user, onUpdateUser, onLogout, isDarkMode, setIsDarkMode }) {
  const [profileTab, setProfileTab] = useState('profile'); // profile, settings, history

  // Editable Profile Form State
  const [name, setName] = useState(user?.name || 'Mahalakshmi');
  const [email, setEmail] = useState(user?.email || 'mahalakshmi@powerpulse.tn');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [district, setDistrict] = useState(user?.district || 'Chennai');
  const [town, setTown] = useState(user?.town || 'T. Nagar');
  const [ebConsumerNo, setEbConsumerNo] = useState(user?.ebConsumerNo || '011245982012');

  // Settings Toggles State
  const [outageAlerts, setOutageAlerts] = useState(true);
  const [billReminders, setBillReminders] = useState(true);
  const [language, setLanguage] = useState('en'); // en, ta
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen || !user) return null;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      email,
      phone,
      district,
      town,
      ebConsumerNo
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className={`border rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl transition-all flex flex-col max-h-[90vh] ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50'
      }`}>
        {/* Modal Header & User Card Banner */}
        <div className={`p-6 border-b transition-colors ${
          isDarkMode ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/30 border-slate-800' : 'bg-gradient-to-r from-amber-50 via-white to-amber-100/50 border-slate-200'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-md">
                {name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-lg leading-snug">{name}</h3>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-500" />
                    {town}, {district}
                  </span>
                </div>
              </div>
            </div>

            <button 
              onClick={onClose}
              className={`p-1.5 rounded-xl transition-colors ${
                isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Tab Selector */}
          <div className="mt-5 flex gap-2 border-t pt-3 border-slate-200 dark:border-slate-800">
            {[
              { id: 'profile', label: 'Profile Info', icon: User },
              { id: 'settings', label: 'Settings & Preferences', icon: Settings },
              { id: 'history', label: 'My Reports & Receipts', icon: FileText }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = profileTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setProfileTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : isDarkMode ? 'bg-slate-950 text-slate-400 hover:text-slate-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
          
          {/* TAB 1: Profile Info Form */}
          {profileTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block mb-1 font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full border rounded-xl px-3.5 py-2.5 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                      isDarkMode ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block mb-1 font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full border rounded-xl px-3.5 py-2.5 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                      isDarkMode ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block mb-1 font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Mobile Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full border rounded-xl px-3.5 py-2.5 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                      isDarkMode ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block mb-1 font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>TNEB Consumer Service No</label>
                  <input
                    type="text"
                    value={ebConsumerNo}
                    onChange={(e) => setEbConsumerNo(e.target.value)}
                    className={`w-full border rounded-xl px-3.5 py-2.5 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                      isDarkMode ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block mb-1 font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Primary District</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className={`w-full border rounded-xl px-3 py-2.5 focus:outline-none ${
                      isDarkMode ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    {TN_DISTRICTS.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className={`block mb-1 font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Primary Town / Locality</label>
                  <input
                    type="text"
                    value={town}
                    onChange={(e) => setTown(e.target.value)}
                    className={`w-full border rounded-xl px-3.5 py-2.5 focus:outline-none ${
                      isDarkMode ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                {savedSuccess ? (
                  <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                    <Check className="w-4 h-4" /> Profile Updated Successfully!
                  </span>
                ) : <span />}

                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-md transition-all text-xs"
                >
                  <Save className="w-4 h-4" />
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Settings & Preferences */}
          {profileTab === 'settings' && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm uppercase tracking-wider text-amber-500">Notifications & Alerts</h4>

              <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="space-y-0.5">
                  <span className="font-bold block flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-amber-500" />
                    Scheduled Outage SMS & Push Alerts
                  </span>
                  <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Receive instant alerts for planned maintenance in {town}, {district}.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={outageAlerts}
                  onChange={(e) => setOutageAlerts(e.target.checked)}
                  className="w-5 h-5 accent-amber-500 cursor-pointer"
                />
              </div>

              <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="space-y-0.5">
                  <span className="font-bold block flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500" />
                    TNEB Bill Due Date Reminders
                  </span>
                  <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Get reminded 5 days before bi-monthly EB bill payment due date.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={billReminders}
                  onChange={(e) => setBillReminders(e.target.checked)}
                  className="w-5 h-5 accent-amber-500 cursor-pointer"
                />
              </div>

              <h4 className="font-bold text-sm uppercase tracking-wider text-amber-500 pt-2">Appearance & Language</h4>

              <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="space-y-0.5">
                  <span className="font-bold block flex items-center gap-1.5">
                    {isDarkMode ? <Moon className="w-4 h-4 text-amber-500" /> : <Sun className="w-4 h-4 text-amber-500" />}
                    Theme Mode
                  </span>
                  <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Switch between Unique Light Mode & Dark Slate Mode.
                  </span>
                </div>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="px-3 py-1.5 rounded-xl border font-bold text-xs bg-amber-500 text-slate-950"
                >
                  {isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
                </button>
              </div>

              <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="space-y-0.5">
                  <span className="font-bold block flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-amber-500" />
                    Language Preference
                  </span>
                  <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Select app interface language (English / தமிழ்).
                  </span>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={`border rounded-xl px-3 py-1 text-xs font-bold ${
                    isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'
                  }`}
                >
                  <option value="en">English</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                </select>
              </div>
            </div>
          )}

          {/* TAB 3: History */}
          {profileTab === 'history' && (
            <div className="space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-500">Logged Outages History</h4>
              <div className={`p-3.5 rounded-xl border space-y-2 text-xs ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex justify-between font-bold">
                  <span>⚡ Power Cut in {town}, {district}</span>
                  <span className="text-emerald-500">RESOLVED</span>
                </div>
                <p className="text-slate-400">Reported: 2 hours ago | Cause: Feeder Tripping</p>
              </div>

              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-500 pt-2">Recent Payment Receipts</h4>
              <div className={`p-3.5 rounded-xl border space-y-2 text-xs ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex justify-between font-bold">
                  <span>TNEB EB Bill Payment (Service #{ebConsumerNo})</span>
                  <span className="text-emerald-500 font-mono">₹1,125 PAID</span>
                </div>
                <p className="text-slate-400">Txn Ref: TNEB-84920194 | Date: 16 Aug 2026</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Logout Action */}
        <div className={`p-4 border-t flex items-center justify-between ${
          isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Logged in as <strong>{name}</strong>
          </span>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

      </div>
    </div>
  );
}

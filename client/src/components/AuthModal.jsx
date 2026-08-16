import React, { useState } from 'react';
import { X, Lock, Mail, Phone, User, ShieldCheck, ArrowRight, KeyRound } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, isDarkMode }) {
  const [isRegister, setIsRegister] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState('mahalakshmi@powerpulse.tn');
  const [password, setPassword] = useState('powerpulse123');
  const [name, setName] = useState('Mahalakshmi');
  const [district, setDistrict] = useState('Chennai');
  const [town, setTown] = useState('T. Nagar');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      name: isRegister ? name : 'Mahalakshmi',
      email: emailOrPhone.includes('@') ? emailOrPhone : 'mahalakshmi@powerpulse.tn',
      phone: emailOrPhone.includes('@') ? '+91 98765 43210' : emailOrPhone,
      district,
      town,
      ebConsumerNo: '011245982012',
      isLoggedIn: true
    };

    onLoginSuccess(userData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className={`border rounded-3xl w-full max-w-md overflow-hidden shadow-2xl transition-all ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50'
      }`}>
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${
          isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-gradient-to-r from-amber-50 to-indigo-50 border-slate-200'
        }`}>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-amber-500/20 text-amber-500 rounded-xl border border-amber-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {isRegister ? 'Create PowerPulse Account' : 'Welcome Back to PowerPulse'}
              </h3>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Tamil Nadu Electricity & Outage Tracker
              </p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs sm:text-sm">
          {isRegister && (
            <div>
              <label className={`block mb-1 font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full border rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    isDarkMode ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-300'
                  }`}
                  placeholder="e.g. Mahalakshmi"
                />
              </div>
            </div>
          )}

          <div>
            <label className={`block mb-1 font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Mobile Number or Email *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className={`w-full border rounded-xl pl-9 pr-3 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  isDarkMode ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-300'
                }`}
                placeholder="Mobile or Email"
              />
            </div>
          </div>

          <div>
            <label className={`block mb-1 font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Password *</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full border rounded-xl pl-9 pr-3 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  isDarkMode ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-300'
                }`}
                placeholder="••••••••"
              />
            </div>
          </div>

          {isRegister && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={`block mb-1 font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none ${
                    isDarkMode ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className={`block mb-1 font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Town / Area</label>
                <input
                  type="text"
                  value={town}
                  onChange={(e) => setTown(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none ${
                    isDarkMode ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl shadow-lg transition-all text-xs sm:text-sm mt-3"
          >
            <span>{isRegister ? 'Create Account' : 'Sign In & Access Profile'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline"
            >
              {isRegister ? 'Already have an account? Sign In' : 'New to PowerPulse? Create an Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

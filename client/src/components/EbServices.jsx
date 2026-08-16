import React, { useState } from 'react';
import { Calculator, ExternalLink, CreditCard, ShieldCheck, FileCheck, Info, CheckCircle2, Zap, Sun, BatteryCharging, ArrowRight } from 'lucide-react';
import PaymentModal from './PaymentModal.jsx';
import SolarCalculator from './SolarCalculator.jsx';
import EvChargingFinder from './EvChargingFinder.jsx';

export default function EbServices({ isDarkMode }) {
  const [activeSubTab, setActiveSubTab] = useState('calculator'); // calculator, solar, ev, documents
  const [tariffType, setTariffType] = useState('domestic'); // domestic, commercial
  const [consumedUnits, setConsumedUnits] = useState(350);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // TNEB Domestic Tariff Slab Calculator (Bi-monthly / 2 Months billing cycle)
  const calculateDomesticBill = (units) => {
    let billAmount = 0;
    let slabDetails = [];
    let subsidySavings = 0;

    if (units <= 100) {
      subsidySavings = units * 4.5;
      slabDetails.push({ slab: '0 - 100 units (Subsidy)', unitsUsed: units, rate: '₹0 (100 Free Units)', cost: 0 });
    } else {
      slabDetails.push({ slab: '0 - 100 units (Subsidy)', unitsUsed: 100, rate: '₹0 (100 Free Units)', cost: 0 });
      subsidySavings = 100 * 4.5;
      let remaining = units - 100;

      if (remaining > 0) {
        const u100 = Math.min(remaining, 100);
        const cost100 = u100 * 4.5;
        billAmount += cost100;
        slabDetails.push({ slab: '101 - 200 units', unitsUsed: u100, rate: '₹4.50/unit', cost: cost100 });
        remaining -= u100;
      }

      if (remaining > 0) {
        const u200 = Math.min(remaining, 200);
        const cost200 = u200 * 6.0;
        billAmount += cost200;
        slabDetails.push({ slab: '201 - 400 units', unitsUsed: u200, rate: '₹6.00/unit', cost: cost200 });
        remaining -= u200;
      }

      if (remaining > 0) {
        const u100_2 = Math.min(remaining, 100);
        const cost100_2 = u100_2 * 8.0;
        billAmount += cost100_2;
        slabDetails.push({ slab: '401 - 500 units', unitsUsed: u100_2, rate: '₹8.00/unit', cost: cost100_2 });
        remaining -= u100_2;
      }

      if (remaining > 0) {
        const u100_3 = Math.min(remaining, 100);
        const cost100_3 = u100_3 * 9.0;
        billAmount += cost100_3;
        slabDetails.push({ slab: '501 - 600 units', unitsUsed: u100_3, rate: '₹9.00/unit', cost: cost100_3 });
        remaining -= u100_3;
      }

      if (remaining > 0) {
        const costAbove = remaining * 10.0;
        billAmount += costAbove;
        slabDetails.push({ slab: 'Above 600 units', unitsUsed: remaining, rate: '₹10.00/unit', cost: costAbove });
      }
    }

    const fixedCharge = 30;
    const finalTotal = Math.round(billAmount + fixedCharge);

    return { finalTotal, billAmount, fixedCharge, slabDetails, subsidySavings };
  };

  const calculateCommercialBill = (units) => {
    const energyCharge = units * 9.50;
    const fixedCharge = 140;
    const total = Math.round(energyCharge + fixedCharge);
    return { finalTotal: total, energyCharge, fixedCharge };
  };

  const domesticResult = calculateDomesticBill(consumedUnits);
  const commercialResult = calculateCommercialBill(consumedUnits);

  const calculatedTotal = tariffType === 'domestic' ? domesticResult.finalTotal : commercialResult.finalTotal;

  return (
    <div className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 transition-colors ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Header Banner */}
      <div className={`p-6 rounded-2xl border shadow-xl transition-all ${
        isDarkMode
          ? 'bg-gradient-to-r from-amber-950/50 via-slate-900 to-slate-900 border-amber-500/20'
          : 'bg-gradient-to-r from-amber-50 via-white to-amber-50 border-amber-200'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 text-amber-500 rounded-xl border border-amber-500/30">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                All-In-One Tamil Nadu Electricity Super App
              </h2>
              <p className={`text-xs sm:text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                EB Bill Payments, Tariff Calculator, Rooftop Solar Subsidies, EV Fast Charging Stations, and Connection Guides.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-emerald-600/30 transition-all text-xs sm:text-sm"
          >
            <CreditCard className="w-4 h-4" />
            Pay EB Bill Now
          </button>
        </div>

        {/* Sub Navigation Bar inside EB Hub */}
        <div className="mt-5 flex flex-wrap gap-2">
          {[
            { id: 'calculator', label: '⚡ EB Bill & Pay', icon: Calculator },
            { id: 'solar', label: '☀️ Solar & Subsidy', icon: Sun },
            { id: 'ev', label: '🚗 EV Charging Hubs', icon: BatteryCharging },
            { id: 'documents', label: '📋 Connection & Meter Guide', icon: FileCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : isDarkMode 
                      ? 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200' 
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Active Sub Tab */}
      {activeSubTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left Column: TNEB Tariff Calculator */}
          <div className={`border rounded-2xl p-5 sm:p-6 transition-all space-y-5 ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-bold">
                  TNEB Bill Tariff Calculator
                </h3>
              </div>
              <span className="text-[11px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                TN 100 Free Units Applied
              </span>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              {/* Tariff Category Switcher */}
              <div>
                <label className={`block mb-1 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Tariff Category:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTariffType('domestic')}
                    className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                      tariffType === 'domestic'
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-300 text-slate-700'
                    }`}
                  >
                    🏡 Domestic / House (IA)
                  </button>

                  <button
                    onClick={() => setTariffType('commercial')}
                    className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                      tariffType === 'commercial'
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-300 text-slate-700'
                    }`}
                  >
                    🏢 Commercial / Shop (V)
                  </button>
                </div>
              </div>

              {/* Consumed Units Slider & Input */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className={`font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Consumed Units (kWh for 2 Months):
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="3000"
                      value={consumedUnits}
                      onChange={(e) => setConsumedUnits(Math.max(0, parseInt(e.target.value) || 0))}
                      className={`w-20 border rounded-lg px-2 py-1 font-bold text-center text-amber-600 dark:text-amber-400 ${
                        isDarkMode ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-300'
                      }`}
                    />
                    <span className="font-bold text-xs">Units</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={consumedUnits}
                  onChange={(e) => setConsumedUnits(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Bill Result Box */}
              {tariffType === 'domestic' ? (
                <div className={`p-4 rounded-xl border space-y-3 ${
                  isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`text-xs block ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        Estimated Total Bi-Monthly Bill:
                      </span>
                      <span className="text-3xl font-black text-amber-500">
                        ₹{domesticResult.finalTotal}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block">
                        Subsidy Savings: ₹{domesticResult.subsidySavings}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Incl. ₹{domesticResult.fixedCharge} fixed charges
                      </span>
                    </div>
                  </div>

                  {/* Detailed Slab Breakdown */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                    <span className="text-[11px] font-bold text-slate-500 block">Slab-wise Calculation Breakdown:</span>
                    {domesticResult.slabDetails.map((slab, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[11px]">
                        <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                          {slab.slab} ({slab.unitsUsed} units @ {slab.rate})
                        </span>
                        <span className="font-mono font-semibold">₹{slab.cost}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={`p-4 rounded-xl border space-y-2 ${
                  isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`text-xs block ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        Estimated Commercial Bill (2 Months):
                      </span>
                      <span className="text-3xl font-black text-amber-500">
                        ₹{commercialResult.finalTotal}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      ₹9.50 / unit rate
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl shadow-md transition-all text-sm"
              >
                <CreditCard className="w-4 h-4" />
                Proceed to Pay ₹{calculatedTotal} In-App
              </button>
            </div>
          </div>

          {/* Right Column: In-App Checkout Banner & External Portals */}
          <div className={`border rounded-2xl p-5 sm:p-6 transition-all space-y-5 flex flex-col justify-between ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-bold">
                  Instant EB Bill Payment Portals
                </h3>
              </div>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Pay directly inside PowerPulse or use official government payment links.
              </p>

              {/* Direct In-App Checkout Card */}
              <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-slate-900 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-emerald-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-5 h-5" />
                    In-App Direct Checkout Active
                  </span>
                  <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded-full">
                    Instant Receipt
                  </span>
                </div>
                <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  No broken links! Pay your TNEB bill via UPI, GPay, PhonePe, Debit/Credit Card or NetBanking right inside PowerPulse.
                </p>
                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl shadow-md text-xs transition-all"
                >
                  Open In-App Payment Gateway <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Verified External Links */}
              <div className="mt-4 space-y-2">
                <span className={`text-xs font-bold block ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Official Verified Payment Portals:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <a
                    href="https://npp.tangedco.org/tangedco/"
                    target="_blank"
                    rel="noreferrer"
                    className={`p-3 rounded-xl border flex items-center justify-between font-semibold transition-all ${
                      isDarkMode 
                        ? 'bg-slate-950 border-slate-800 hover:border-amber-500 text-slate-100' 
                        : 'bg-slate-50 border-slate-200 hover:border-amber-500 text-slate-900'
                    }`}
                  >
                    <span>TNEB Official Web Pay</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>

                  <a
                    href="https://www.tangedco.gov.in/"
                    target="_blank"
                    rel="noreferrer"
                    className={`p-3 rounded-xl border flex items-center justify-between font-semibold transition-all ${
                      isDarkMode 
                        ? 'bg-slate-950 border-slate-800 hover:border-amber-500 text-slate-100' 
                        : 'bg-slate-50 border-slate-200 hover:border-amber-500 text-slate-900'
                    }`}
                  >
                    <span>TANGEDCO Portal</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                </div>
              </div>
            </div>

            <div className={`p-3 rounded-xl border text-xs ${
              isDarkMode ? 'bg-slate-950/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              💡 Bi-Monthly Bill Notice: TNEB reads domestic meters once every 2 months.
            </div>
          </div>

        </div>
      )}

      {activeSubTab === 'solar' && (
        <SolarCalculator isDarkMode={isDarkMode} />
      )}

      {activeSubTab === 'ev' && (
        <EvChargingFinder isDarkMode={isDarkMode} />
      )}

      {activeSubTab === 'documents' && (
        <div className={`border rounded-2xl p-5 sm:p-6 transition-all space-y-4 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold">
              New EB Meter Connection & Name Transfer Guide
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className={`p-4 rounded-xl border space-y-2 ${
              isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <h4 className="font-bold text-amber-500 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                New House EB Connection
              </h4>
              <ul className="space-y-1 text-xs list-disc pl-4 text-slate-400">
                <li>Property Title Deed / Sale Deed</li>
                <li>Property Tax Receipt / Patta Copy</li>
                <li>Applicant Aadhaar Card & Photo</li>
                <li>Licensed Electrician Completion Certificate (Form A)</li>
              </ul>
            </div>

            <div className={`p-4 rounded-xl border space-y-2 ${
              isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <h4 className="font-bold text-amber-500 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                EB Meter Name Transfer
              </h4>
              <ul className="space-y-1 text-xs list-disc pl-4 text-slate-400">
                <li>Latest EB Bill Paid Receipt</li>
                <li>Registered Sale Deed in New Owner's Name</li>
                <li>Consent Letter / NOC from previous owner</li>
                <li>Indemnity Bond (Stamp paper ₹80)</li>
              </ul>
            </div>

            <div className={`p-4 rounded-xl border space-y-2 ${
              isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <h4 className="font-bold text-amber-500 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Load Enhancement (kW)
              </h4>
              <ul className="space-y-1 text-xs list-disc pl-4 text-slate-400">
                <li>Application for Additional Connected Load</li>
                <li>Revision of Development Charges</li>
                <li>Electrician Test Certificate</li>
                <li>TNEB AE inspection & Meter Upgrade</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal Component */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        initialAmount={calculatedTotal}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}

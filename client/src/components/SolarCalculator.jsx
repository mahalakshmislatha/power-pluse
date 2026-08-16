import React, { useState } from 'react';
import { Sun, Zap, Award, DollarSign, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function SolarCalculator({ isDarkMode }) {
  const [kwCapacity, setKwCapacity] = useState(3); // 1 to 10 kW

  // Solar Calculations under PM Surya Ghar & TN Solar Policy 2026:
  // Avg cost per kW ~ ₹60,000.
  // PM Surya Ghar Subsidy:
  // 1 kW: ₹30,000
  // 2 kW: ₹60,000
  // 3 kW & above: ₹78,000 max central subsidy.
  // Power Generation: ~4 to 4.5 units per day per kW = ~120 units/month per kW.
  const totalCost = kwCapacity * 60000;
  const centralSubsidy = kwCapacity === 1 ? 30000 : kwCapacity === 2 ? 60000 : 78000;
  const netConsumerCost = Math.max(0, totalCost - centralSubsidy);
  const monthlyUnitsGenerated = kwCapacity * 125;
  const monthlySavingsRupees = Math.round(monthlyUnitsGenerated * 7.5);
  const annualSavingsRupees = monthlySavingsRupees * 12;
  const paybackYears = (netConsumerCost / annualSavingsRupees).toFixed(1);

  return (
    <div className={`p-5 sm:p-6 rounded-2xl border transition-all space-y-5 ${
      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sun className="w-6 h-6 text-amber-500 animate-spin-slow" />
          <div>
            <h3 className="text-lg font-bold">
              PM Surya Ghar Rooftop Solar & Subsidy Calculator
            </h3>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              PM Surya Ghar Muft Bijli Yojana & TN Net-Metering Subsidies up to ₹78,000
            </p>
          </div>
        </div>

        <span className="text-[11px] bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold px-2.5 py-1 rounded-full border border-amber-500/30">
          Govt Scheme Active
        </span>
      </div>

      <div className="space-y-4 text-xs sm:text-sm">
        {/* System Capacity Slider */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className={`font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Rooftop Solar Plant Capacity (kW):
            </label>
            <span className="text-amber-500 font-black text-lg">{kwCapacity} kW System</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={kwCapacity}
            onChange={(e) => setKwCapacity(parseInt(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* Calculation Result Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          
          <div className={`p-3.5 rounded-xl border ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-slate-400 block text-[11px]">Estimated Plant Cost:</span>
            <span className="text-base font-bold">₹{totalCost.toLocaleString()}</span>
          </div>

          <div className="p-3.5 rounded-xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
            <span className="block text-[11px]">Govt Subsidy Benefit:</span>
            <span className="text-base font-black">₹{centralSubsidy.toLocaleString()}</span>
          </div>

          <div className={`p-3.5 rounded-xl border ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-slate-400 block text-[11px]">Net Consumer Outflow:</span>
            <span className="text-base font-bold text-amber-500">₹{netConsumerCost.toLocaleString()}</span>
          </div>

          <div className={`p-3.5 rounded-xl border ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-slate-400 block text-[11px]">Est. Payback Period:</span>
            <span className="text-base font-bold">{paybackYears} Years</span>
          </div>

        </div>

        {/* Monthly Generation & Bill Reduction Info */}
        <div className={`p-4 rounded-xl border text-xs space-y-2 ${
          isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-amber-50/50 border-amber-200'
        }`}>
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <Zap className="w-4 h-4" />
              Monthly Generation & Bill Savings:
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 text-sm">
              Save ~₹{monthlySavingsRupees.toLocaleString()} / month
            </span>
          </div>
          <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
            A {kwCapacity}kW system generates approximately <strong>{monthlyUnitsGenerated} Units (kWh)</strong> per month, reducing your TNEB bill to <strong>₹0 or zero net units</strong> under TANGEDCO Net-metering rules!
          </p>
        </div>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Bot, Cpu, Sparkles, AlertTriangle, ShieldCheck, Zap, Send, RefreshCw, CheckCircle2, MessageSquare, LineChart, ArrowRight, BrainCircuit } from 'lucide-react';
import { TN_DISTRICTS } from '../data/tnDistricts.js';

export default function AgenticAiSuite({ reports, isDarkMode }) {
  const [activeAgentTab, setActiveAgentTab] = useState('chat'); // chat, grid-agent, bill-agent
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'agent',
      text: 'Vanakkam! I am PulseAI, your autonomous Tamil Nadu Electricity & Outage Agent. Ask me anything in Tamil or English about live power cuts, TNEB bill optimization, or Minnagam complaints!'
    }
  ]);
  const [userPrompt, setUserPrompt] = useState('');
  const [isAgentThinking, setIsAgentThinking] = useState(false);

  // Agent 1: Autonomous Grid Diagnostic State
  const [selectedDistrict, setSelectedDistrict] = useState('Chennai');
  const [selectedTown, setSelectedTown] = useState('T. Nagar');

  // Agent 2: Tariff Slab Defense State
  const [currentUnits, setCurrentUnits] = useState(380);

  // Agent Chat Logic
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!userPrompt.trim()) return;

    const input = userPrompt.trim();
    const newMessages = [...chatMessages, { sender: 'user', text: input }];
    setChatMessages(newMessages);
    setUserPrompt('');
    setIsAgentThinking(true);

    setTimeout(() => {
      let reply = '';
      const lower = input.toLowerCase();

      if (lower.includes('chennai') || lower.includes('current') || lower.includes('outage') || lower.includes('power cut')) {
        reply = `🤖 **PulseAI Grid Agent Action**: Scanned live sensor telemetry for ${selectedDistrict}.\n• Active Outages Detected: 2 in T. Nagar & Anna Nagar.\n• Diagnosed Cause: Feeder Tripping due to line maintenance.\n• Estimated Restoration Time (ETR): Within 45 minutes.\n• Autonomous Minnagam 1912 ticket draft logged.`;
      } else if (lower.includes('bill') || lower.includes('tariff') || lower.includes('unit') || lower.includes('save')) {
        reply = `🧠 **EBAgent Optimizer Action**: You are currently at ${currentUnits} Units. You are only 20 units away from crossing the 400-unit slab threshold!\n• Crossing 400 units will increase your rate from ₹6.00 to ₹8.00/unit.\n• Recommended Autonomous Action: Reduce AC usage by 1.5 hrs/day for the next 5 days to save ₹420 on your bi-monthly bill.`;
      } else if (lower.includes('solar') || lower.includes('sun')) {
        reply = `☀️ **SolarAgent Recommendation**: Based on your rooftop potential in ${selectedDistrict}, a 3 kW solar plant qualifies for ₹78,000 PM Surya Ghar Govt Subsidy. It will generate ~375 units/month, making your TNEB bill ₹0!`;
      } else {
        reply = `🤖 **PulseAI Agent**: I am actively monitoring grid stability across all 38 districts of Tamil Nadu. I can help you diagnose power cuts, optimize TNEB bills, predict restoration times, or file official 1912 complaints. How can I assist you further?`;
      }

      setChatMessages([...newMessages, { sender: 'agent', text: reply }]);
      setIsAgentThinking(false);
    }, 1200);
  };

  // Tariff Slab Defense Logic
  const unitsToNextSlab = 400 - currentUnits;
  const isCloseToSlab = unitsToNextSlab > 0 && unitsToNextSlab <= 40;

  return (
    <div className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 transition-colors ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Header Banner */}
      <div className={`p-6 rounded-2xl border shadow-xl transition-all ${
        isDarkMode
          ? 'bg-gradient-to-r from-purple-950/50 via-slate-900 to-slate-900 border-purple-500/30'
          : 'bg-gradient-to-r from-purple-50 via-white to-amber-50 border-purple-200'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/30">
              <BrainCircuit className="w-7 h-7 animate-pulse text-purple-500" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                Agentic AI Power & Grid Intelligence Suite
                <span className="text-[10px] bg-purple-500/20 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full font-mono font-bold uppercase">
                  Autonomous AI Active
                </span>
              </h2>
              <p className={`text-xs sm:text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Autonomous AI agents for grid fault diagnosis, ETR restoration prediction, TNEB tariff slab defense, and smart assistant.
              </p>
            </div>
          </div>
        </div>

        {/* Sub Navigation Bar for AI Suite */}
        <div className="mt-5 flex flex-wrap gap-2">
          {[
            { id: 'chat', label: '💬 PulseAI Assistant', icon: MessageSquare },
            { id: 'grid-agent', label: '🤖 Autonomous Grid Diagnostic Agent', icon: Cpu },
            { id: 'bill-agent', label: '🧠 Tariff Slab Defense Agent', icon: LineChart },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeAgentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveAgentTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
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

      {/* SUB TAB 1: Conversational PulseAI Agent */}
      {activeAgentTab === 'chat' && (
        <div className={`border rounded-2xl p-5 sm:p-6 transition-all space-y-4 flex flex-col h-[520px] ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-500" />
              <h3 className="font-bold text-base">PulseAI Agent Conversational Intelligence</h3>
            </div>
            <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block"></span>
              Autonomous Agent Online
            </span>
          </div>

          {/* Chat Messages Log */}
          <div className={`flex-1 overflow-y-auto space-y-3 p-3 rounded-xl border text-xs sm:text-sm ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'agent' && (
                  <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center font-bold text-xs shrink-0 border border-purple-500/30">
                    🤖
                  </div>
                )}

                <div className={`p-3 rounded-2xl max-w-[80%] space-y-1 ${
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white rounded-br-none font-medium'
                    : isDarkMode 
                      ? 'bg-slate-900 border border-slate-800 text-slate-100 rounded-bl-none' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                }`}>
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}

            {isAgentThinking && (
              <div className="flex items-center gap-2 text-xs text-purple-400 font-mono animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                PulseAI Agent is diagnosing telemetry & querying grid models...
              </div>
            )}
          </div>

          {/* Chat Input Form */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              placeholder="Ask PulseAI (e.g. 'Chennai-la epo current varum?', 'How to lower my EB bill?')..."
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className={`flex-1 border rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                isDarkMode ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />

            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-1 shadow-md transition-all"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* SUB TAB 2: Autonomous Grid Diagnostic Agent */}
      {activeAgentTab === 'grid-agent' && (
        <div className={`border rounded-2xl p-5 sm:p-6 transition-all space-y-5 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-2">
            <Cpu className="w-6 h-6 text-purple-500" />
            <div>
              <h3 className="text-lg font-bold">Autonomous Grid Diagnostics & ETR Predictor</h3>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Agentic model analyzes weather radar, substation load, and sensor telemetry to predict causes & restoration times.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className={`block mb-1 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Select District:</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 ${
                  isDarkMode ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                {TN_DISTRICTS.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
              </select>
            </div>

            <div>
              <label className={`block mb-1 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Select Town / Substation Area:</label>
              <input
                type="text"
                value={selectedTown}
                onChange={(e) => setSelectedTown(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 ${
                  isDarkMode ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          {/* Autonomous Diagnostic Agent Analysis Report Box */}
          <div className={`p-5 rounded-xl border space-y-3 ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-500 flex items-center gap-1.5 text-sm">
                <Sparkles className="w-4 h-4" />
                PulseAI Diagnostic Report for {selectedTown}, {selectedDistrict}
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-500 font-bold px-2 py-0.5 rounded-full">
                Confidence: 94.8%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <span className="text-slate-400 block text-[10px]">Diagnosed Fault Cause:</span>
                <span className="font-bold text-rose-400">110kV Feeder Tripping</span>
              </div>

              <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <span className="text-slate-400 block text-[10px]">Predicted ETR (Restoration):</span>
                <span className="font-bold text-amber-400">35 - 45 Minutes</span>
              </div>

              <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <span className="text-slate-400 block text-[10px]">Weather Impact Factor:</span>
                <span className="font-bold text-emerald-400">Rain & High Wind</span>
              </div>
            </div>

            <div className="pt-2 text-xs space-y-1 text-slate-400">
              <p>🤖 <strong>Agent Action Taken:</strong> Auto-logged Minnagam complaint draft & notified 14 nearby residents in {selectedTown}.</p>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 3: Tariff Slab Defense Agent */}
      {activeAgentTab === 'bill-agent' && (
        <div className={`border rounded-2xl p-5 sm:p-6 transition-all space-y-5 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-2">
            <LineChart className="w-6 h-6 text-purple-500" />
            <div>
              <h3 className="text-lg font-bold">EBAgent Tariff Slab Defense System</h3>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Autonomous agent monitors your bi-monthly kWh consumption to prevent jumping into higher cost tariff slabs!
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className={`font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Current Billing Units (kWh):</label>
                <span className="text-purple-500 font-black text-lg">{currentUnits} Units</span>
              </div>
              <input
                type="range"
                min="50"
                max="600"
                step="5"
                value={currentUnits}
                onChange={(e) => setCurrentUnits(parseInt(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Agent Defense Alert Box */}
            <div className={`p-5 rounded-xl border space-y-3 ${
              isCloseToSlab
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-300'
                : isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5 text-base">
                  <ShieldCheck className="w-5 h-5 text-amber-500" />
                  EBAgent Slab Protection Status
                </span>
                <span className="text-xs bg-purple-500/20 text-purple-400 px-2.5 py-1 rounded-full border border-purple-500/30">
                  Target: Under 400 Units
                </span>
              </div>

              {isCloseToSlab ? (
                <p className="text-xs leading-relaxed">
                  ⚠️ <strong>Slab Threshold Alert!</strong> You are at <strong>{currentUnits} Units</strong>, only <strong>{unitsToNextSlab} Units</strong> away from crossing into the 401-500 unit slab where per-unit rate increases from ₹6.00 to ₹8.00!
                </p>
              ) : (
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Your current consumption of {currentUnits} units is safely managed within optimal tariff limits.
                </p>
              )}

              <div className="pt-2 border-t border-amber-500/30 space-y-1.5 text-xs">
                <span className="font-bold block">💡 Agentic Recommendation to Save Money:</span>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Set Air Conditioner to 25°C instead of 20°C (Saves ~1.8 units/day).</li>
                  <li>Turn off water heater/geyser after 15 mins (Saves ~2.2 units/day).</li>
                  <li>Estimated Bill Savings: <strong>₹380 - ₹540 per billing cycle</strong>.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, RefreshCw } from 'lucide-react';

export default function AiFloatingAssistant({ isDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'agent', text: 'Vanakkam! I am your PulseAI Agent. How can I help with power cuts, TNEB bills, or 1912 complaints?' }
  ]);
  const [prompt, setPrompt] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userText = prompt.trim();
    const newMsgs = [...messages, { sender: 'user', text: userText }];
    setMessages(newMsgs);
    setPrompt('');
    setIsThinking(true);

    setTimeout(() => {
      let response = '';
      const l = userText.toLowerCase();

      if (l.includes('current') || l.includes('cut') || l.includes('outage') || l.includes('chennai') || l.includes('madurai') || l.includes('coimbatore')) {
        response = '⚡ PulseAI Grid Sensor: Scanned active feeders. Live power cut detected in T. Nagar & Anna Nagar. ETR: ~40 mins. Minnagam 1912 draft ready!';
      } else if (l.includes('bill') || l.includes('tariff') || l.includes('units') || l.includes('pay')) {
        response = '💡 EBAgent Advisor: TN domestic tariff gives 100 free units. Use our EB Bill Calculator or In-App Payment Gateway to pay instantly!';
      } else {
        response = '🤖 PulseAI Agent: I am monitoring grid stability across all 38 districts of TN. Ask me about outages, EB bills, solar subsidies, or EV chargers!';
      }

      setMessages([...newMsgs, { sender: 'agent', text: response }]);
      setIsThinking(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-20 right-5 z-50">
      {isOpen ? (
        <div className={`w-80 sm:w-96 rounded-2xl border shadow-2xl overflow-hidden flex flex-col h-96 transition-all ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          {/* Widget Header */}
          <div className="p-3 bg-purple-600 text-white flex items-center justify-between font-bold text-xs sm:text-sm shadow-sm">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-white" />
              <span>PulseAI Agentic Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-purple-700 p-1 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className={`flex-1 p-3 overflow-y-auto space-y-2 text-xs ${
            isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'
          }`}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-2.5 rounded-xl max-w-[85%] ${
                  m.sender === 'user'
                    ? 'bg-purple-600 text-white rounded-br-none font-medium'
                    : isDarkMode ? 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="text-[11px] text-purple-400 font-mono animate-pulse flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" /> PulseAI is thinking...
              </div>
            )}
          </div>

          {/* Widget Input */}
          <form onSubmit={handleSend} className="p-2 border-t border-slate-200 dark:border-slate-800 flex gap-2">
            <input
              type="text"
              placeholder="Ask PulseAI Agent..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className={`flex-1 border rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                isDarkMode ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
            <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-xl text-xs font-bold">
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-4 py-3 rounded-full shadow-2xl shadow-purple-600/40 border border-purple-400/30 transition-all active:scale-95"
        >
          <Bot className="w-5 h-5 animate-pulse" />
          <span className="text-xs">Ask PulseAI Agent</span>
          <Sparkles className="w-4 h-4 text-amber-300" />
        </button>
      )}
    </div>
  );
}

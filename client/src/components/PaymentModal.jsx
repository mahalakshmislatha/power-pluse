import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, CreditCard, Smartphone, Building, ArrowRight, Download, Printer, Lock, Key, Shield, AlertCircle, RefreshCw } from 'lucide-react';

export default function PaymentModal({ isOpen, onClose, initialAmount, isDarkMode }) {
  const [step, setStep] = useState(1); // 1: Bill Details, 2: Payment Method, 3: 2FA OTP Verification, 4: Success Receipt
  const [consumerNo, setConsumerNo] = useState('011245982012');
  const [consumerName, setConsumerName] = useState('MAHALAKSHMI');
  const [amount, setAmount] = useState(initialAmount || 1125);
  const [paymentMethod, setPaymentMethod] = useState('upi'); // upi, card, netbanking
  const [upiApp, setUpiApp] = useState('gpay'); // gpay, phonepe, paytm, bhim
  const [otp, setOtp] = useState('849201');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  if (!isOpen) return null;

  // Step 1 to 2
  const handleProceedToPayment = (e) => {
    e.preventDefault();
    setStep(2);
  };

  // Step 2 to 3 (Trigger OTP)
  const handleSendOtp = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(3);
    }, 800);
  };

  // Step 3 to 4 (Verify OTP & Complete)
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess({
        txnId: 'TNEB-' + Math.floor(100000000 + Math.random() * 900000000),
        bankRef: 'BANK-' + Math.floor(1000000 + Math.random() * 9000000),
        date: new Date().toLocaleString(),
        consumerNo,
        consumerName,
        amount,
        paymentMethod: paymentMethod.toUpperCase(),
        status: 'VERIFIED & PAID'
      });
      setStep(4);
    }, 1200);
  };

  const handleReset = () => {
    setStep(1);
    setPaymentSuccess(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className={`border rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl transition-all ${
        isDarkMode 
          ? 'bg-slate-900 border-slate-800 text-slate-100' 
          : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50'
      }`}>
        
        {/* Top Security Banner */}
        <div className={`p-4 border-b flex items-center justify-between transition-colors ${
          isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-gradient-to-r from-amber-50 via-indigo-50 to-emerald-50 border-slate-200'
        }`}>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-500/30">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-1.5">
                TNEB 256-Bit SSL Secure Gateway
                <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold">
                  VERIFIED
                </span>
              </h3>
              <p className={`text-xs flex items-center gap-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                RBI & TANGEDCO 2FA Bank Protection Active
              </p>
            </div>
          </div>

          <button 
            onClick={handleReset}
            className={`p-1.5 rounded-xl transition-colors ${
              isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Consumer & Bill Details */}
        {step === 1 && (
          <form onSubmit={handleProceedToPayment} className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
            <div className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
              isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <Shield className="w-6 h-6 text-amber-500 shrink-0" />
              <div className="text-xs">
                <span className="font-bold block text-slate-800 dark:text-slate-200">Official Bill Query</span>
                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Enter your 12-digit TNEB consumer service number to fetch bill details.</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className={`block mb-1 font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  TNEB Consumer Service Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 011245982012"
                  value={consumerNo}
                  onChange={(e) => setConsumerNo(e.target.value)}
                  className={`w-full border rounded-xl px-3.5 py-2.5 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    isDarkMode ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block mb-1 font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Consumer Name *
                </label>
                <input
                  type="text"
                  required
                  value={consumerName}
                  onChange={(e) => setConsumerName(e.target.value)}
                  className={`w-full border rounded-xl px-3.5 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    isDarkMode ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block mb-1 font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Bill Amount Payable (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-base font-black text-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    isDarkMode ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl shadow-lg transition-all text-xs sm:text-sm mt-2"
            >
              <span>Proceed to Payment Options</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: Select Payment Method */}
        {step === 2 && (
          <form onSubmit={handleSendOtp} className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
            <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
              <span className={`font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Amount to Pay:</span>
              <span className="text-xl font-black text-amber-500">₹{amount}</span>
            </div>

            <div>
              <label className={`block mb-2 font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Choose Encrypted Payment Mode:
              </label>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'upi', label: 'UPI App', icon: Smartphone },
                  { id: 'card', label: 'Debit/Credit Card', icon: CreditCard },
                  { id: 'netbanking', label: 'NetBanking', icon: Building }
                ].map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setPaymentMethod(mode.id)}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 font-bold transition-all text-xs ${
                        paymentMethod === mode.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                          : isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-300 text-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {paymentMethod === 'upi' && (
              <div className={`p-3.5 rounded-xl border space-y-2 ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-xs font-semibold block text-slate-500">Select Instant UPI App:</span>
                <div className="grid grid-cols-4 gap-2 text-xs font-bold text-center">
                  {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI'].map((app) => (
                    <button
                      key={app}
                      type="button"
                      onClick={() => setUpiApp(app.toLowerCase())}
                      className={`p-2.5 rounded-xl border transition-all ${
                        upiApp === app.toLowerCase()
                          ? 'bg-amber-500 text-slate-950 border-amber-500 font-extrabold shadow-sm'
                          : isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-300 text-slate-800'
                      }`}
                    >
                      {app}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Card Number (4532 •••• •••• 8921)"
                  className={`w-full border rounded-xl px-3.5 py-2.5 font-mono focus:outline-none ${
                    isDarkMode ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-300'
                  }`}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className={`border rounded-xl px-3.5 py-2 focus:outline-none ${
                      isDarkMode ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                  <input
                    type="password"
                    maxLength="4"
                    placeholder="CVV"
                    className={`border rounded-xl px-3.5 py-2 font-mono focus:outline-none ${
                      isDarkMode ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`px-4 py-3 rounded-xl border text-xs font-semibold ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'
                }`}
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all text-xs sm:text-sm"
              >
                {isProcessing ? 'Generating Bank OTP...' : 'Send Bank 2FA Security OTP'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: 2FA Bank Security OTP Verification */}
        {step === 3 && (
          <form onSubmit={handleVerifyOtp} className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto border border-amber-500/30">
                <Key className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base">Enter 6-Digit Bank 2FA OTP</h4>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                A secure OTP has been sent to your registered mobile number for consumer #{consumerNo}.
              </p>
            </div>

            <div>
              <input
                type="text"
                required
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={`w-full text-center tracking-widest text-2xl font-mono font-black border rounded-xl py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  isDarkMode ? 'bg-slate-950 border-slate-700 text-amber-400' : 'bg-slate-50 border-slate-300 text-amber-600'
                }`}
              />
              <span className="text-[11px] text-slate-500 text-center block mt-1">
                Demo OTP pre-filled: <strong>849201</strong>
              </span>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all text-xs sm:text-sm"
            >
              {isProcessing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              <span>{isProcessing ? 'Verifying Bank Authentication...' : 'Verify OTP & Complete Payment'}</span>
            </button>
          </form>
        )}

        {/* STEP 4: Official Verified Payment Receipt */}
        {step === 4 && paymentSuccess && (
          <div className="p-6 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-emerald-500">TNEB Official Payment Receipt</h3>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Verified Bank 2FA Transaction Complete & Credited to TANGEDCO.
              </p>
            </div>

            <div className={`p-4 rounded-2xl border space-y-2 text-xs font-mono ${
              isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="flex justify-between border-b pb-2 border-slate-700/50">
                <span>Transaction Ref:</span>
                <span className="font-bold text-amber-500">{paymentSuccess.txnId}</span>
              </div>
              <div className="flex justify-between">
                <span>Bank Approval Code:</span>
                <span className="font-bold">{paymentSuccess.bankRef}</span>
              </div>
              <div className="flex justify-between">
                <span>Consumer Service No:</span>
                <span className="font-bold">{paymentSuccess.consumerNo}</span>
              </div>
              <div className="flex justify-between">
                <span>Consumer Name:</span>
                <span className="font-bold">{paymentSuccess.consumerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount Paid:</span>
                <span className="font-bold text-emerald-500 text-sm">₹{paymentSuccess.amount}</span>
              </div>
              <div className="flex justify-between">
                <span>Date & Time:</span>
                <span>{paymentSuccess.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Security Seal:</span>
                <span className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded text-[10px]">
                  🔒 256-BIT SSL ENCRYPTED
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className={`flex-1 flex items-center justify-center gap-2 border py-2.5 rounded-xl font-bold text-xs transition-all ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                }`}
              >
                <Printer className="w-4 h-4" />
                Print / Download PDF Receipt
              </button>

              <button
                onClick={handleReset}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs shadow-md"
              >
                Close Gateway
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

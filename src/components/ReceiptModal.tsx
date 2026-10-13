import React, { useState } from 'react';
import {
  X,
  Printer,
  CheckCircle2,
  Lock,
  Unlock,
  Sparkles,
  ArrowRight,
  Smartphone,
  Share2,
} from 'lucide-react';
import { Receipt, LanguageCode } from '../types/store';
import { sound } from '../utils/audio';

interface ReceiptModalProps {
  receipt: Receipt;
  onClose: () => void;
  onOpenExitGate?: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  receipt,
  onClose,
  onOpenExitGate,
}) => {
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const [scanningGate, setScanningGate] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const handleSimulateGateScan = () => {
    setScanningGate(true);
    sound.playScanBeep();

    setTimeout(() => {
      sound.playGateUnlock();
      setGateUnlocked(true);
      setScanningGate(false);
    }, 900);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/30">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold leading-tight">
                Payment Successful
              </h2>
              <p className="text-xs text-slate-400">Tax Invoice #{receipt.orderId}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
              title="Print GST Invoice"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Direct Mobile Bill WhatsApp Delivery Banner */}
          <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-md flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-extrabold text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Bill delivered directly to your Mobile!</span>
              </div>
              <p className="text-xs text-emerald-100 mt-0.5">
                Digital GST Invoice & Turnstile Exit Pass sent via WhatsApp to{' '}
                <strong className="text-white">{receipt.mobileNumber}</strong>
              </p>
            </div>
          </div>

          {/* Turnstile Exit Gate Simulator */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Supermarket Exit Barrier #02
              </div>
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                  gateUnlocked
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-red-500/20 text-red-400 border border-red-500/40'
                }`}
              >
                {gateUnlocked ? (
                  <>
                    <Unlock className="w-3.5 h-3.5" />
                    <span>GATE UNLOCKED</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>LOCKED • SCAN PASS</span>
                  </>
                )}
              </div>
            </div>

            {/* Turnstile Graphic */}
            <div className="relative h-28 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-around px-6 overflow-hidden">
              <div className="w-12 h-20 bg-slate-800 rounded-lg flex flex-col items-center justify-between py-2 border border-slate-700">
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    gateUnlocked ? 'bg-emerald-400 shadow-[0_0_12px_#34d399]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'
                  }`}
                />
                <div className="text-[8px] font-mono text-slate-400">EXIT A</div>
              </div>

              <div className="flex-1 flex items-center justify-center relative">
                {gateUnlocked ? (
                  <div className="text-center animate-in zoom-in-90 duration-300">
                    <div className="inline-flex items-center gap-2 text-emerald-400 font-extrabold text-sm mb-1">
                      <Sparkles className="w-4 h-4" />
                      <span>GATE OPENED — VERIFICATION COMPLETE</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Clearance confirmed. Please proceed through the turnstile exit gate.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-2 bg-red-500/60 rounded-full rotate-45 transform origin-right shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                    <div className="text-center">
                      <div className="text-xs font-mono text-slate-400 mb-1">BARRIER SENSOR</div>
                      <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping mx-auto" />
                    </div>
                    <div className="w-16 h-2 bg-red-500/60 rounded-full -rotate-45 transform origin-left shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                  </div>
                )}
              </div>

              <div className="w-12 h-20 bg-slate-800 rounded-lg flex flex-col items-center justify-between py-2 border border-slate-700">
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    gateUnlocked ? 'bg-emerald-400 shadow-[0_0_12px_#34d399]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'
                  }`}
                />
                <div className="text-[8px] font-mono text-slate-400">EXIT B</div>
              </div>
            </div>

            {/* Test Turnstile Trigger */}
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                {gateUnlocked
                  ? 'Receipt verified • Exit Barrier unlocked'
                  : 'Scan digital pass against exit turnstile sensor to open'}
              </span>
              {!gateUnlocked && (
                <button
                  onClick={handleSimulateGateScan}
                  disabled={scanningGate}
                  className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>{scanningGate ? 'Scanning Exit Pass...' : 'Open Turnstile Gate'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Indian GST Tax Invoice Thermal Receipt Paper - 100% ENGLISH */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 relative font-mono text-slate-800 text-xs">
            <div className="text-center pb-5 border-b border-dashed border-slate-300">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                TAX INVOICE / RETAIL RECEIPT
              </div>
              <h3 className="font-sans font-black text-lg text-slate-900 tracking-tight">
                {receipt.storeName}
              </h3>
              <p className="text-[11px] text-slate-600 mt-0.5">{receipt.storeAddress}</p>
              <p className="text-[11px] text-slate-500">Vijayawada, Krishna Dt, Andhra Pradesh - {receipt.pincode}</p>
              <p className="text-[10px] text-slate-400 mt-1">
                GSTIN: 37AAACG1234A1Z5 • Self-Checkout Kiosk #07
              </p>
            </div>

            {/* Invoice Meta */}
            <div className="py-3 border-b border-dashed border-slate-300 flex justify-between text-[11px] text-slate-600">
              <div>
                <div>INVOICE NO: <span className="font-bold text-slate-900">{receipt.orderId}</span></div>
                <div>PAY MODE: <span className="font-bold text-slate-900">{receipt.paymentMethod}</span></div>
                <div>UPI REF: <span className="font-bold text-slate-900">{receipt.upiRefNumber}</span></div>
              </div>
              <div className="text-right">
                <div>DATE: {receipt.date}</div>
                <div>CUSTOMER MOBILE: {receipt.mobileNumber}</div>
                <div className="text-emerald-700 font-bold">STATUS: PAID IN FULL ✓</div>
              </div>
            </div>

            {/* Itemized Table in English */}
            <div className="py-4 border-b border-dashed border-slate-300 space-y-2">
              <div className="flex justify-between font-bold text-slate-500 text-[10px] uppercase">
                <span>Item Description</span>
                <span>Amount (₹)</span>
              </div>
              {receipt.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start text-xs">
                  <div className="pr-4 flex-1">
                    <div className="font-bold text-slate-900 font-sans">{item.product.name}</div>
                    <div className="text-[10px] text-slate-500">
                      {item.quantity} qty x ₹{item.product.price} ({item.measuredWeightKg * item.quantity} kg)
                    </div>
                  </div>
                  <div className="font-bold text-slate-900 font-mono text-right">
                    ₹{item.product.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            {/* GST Tax Breakdown in English */}
            <div className="py-3 border-b border-dashed border-slate-300 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>SUBTOTAL:</span>
                <span>₹{receipt.subtotal}</span>
              </div>
              {receipt.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>DISCOUNT APPLIED:</span>
                  <span>-₹{receipt.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>CGST (2.5%):</span>
                <span>₹{receipt.cgst}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>SGST (2.5%):</span>
                <span>₹{receipt.sgst}</span>
              </div>
              <div className="pt-2 flex justify-between text-base font-black text-slate-900 font-sans">
                <span>NET AMOUNT PAID:</span>
                <span>₹{receipt.total}</span>
              </div>
            </div>

            {/* Savings Callout in English */}
            <div className="my-4 p-3 bg-red-50 border border-red-200 rounded-xl text-center">
              <div className="text-xs font-bold text-red-700">
                🎉 Total Today's Savings: ₹{receipt.savings}!
              </div>
              <div className="text-[11px] text-slate-600 mt-0.5">
                +{receipt.pointsEarned} Club Points added to your Member Wallet
              </div>
            </div>

            {/* Exit Gate Pass QR Code in English */}
            <div className="pt-2 pb-1 text-center">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                — TURNSTILE EXIT BARCODE PASS —
              </div>

              <div className="w-36 h-36 mx-auto p-2 bg-white rounded-2xl border-2 border-slate-900 shadow-sm flex items-center justify-center relative">
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
                  <rect x="5" y="5" width="28" height="28" fill="black" />
                  <rect x="9" y="9" width="20" height="20" fill="white" />
                  <rect x="13" y="13" width="12" height="12" fill="black" />

                  <rect x="67" y="5" width="28" height="28" fill="black" />
                  <rect x="71" y="9" width="20" height="20" fill="white" />
                  <rect x="75" y="13" width="12" height="12" fill="black" />

                  <rect x="5" y="67" width="28" height="28" fill="black" />
                  <rect x="9" y="71" width="20" height="20" fill="white" />
                  <rect x="13" y="75" width="12" height="12" fill="black" />

                  <rect x="38" y="10" width="8" height="8" fill="black" />
                  <rect x="50" y="14" width="8" height="8" fill="black" />
                  <rect x="42" y="24" width="8" height="8" fill="black" />
                  <rect x="54" y="26" width="8" height="8" fill="black" />

                  <rect x="12" y="38" width="6" height="6" fill="black" />
                  <rect x="22" y="44" width="8" height="8" fill="black" />
                  <rect x="34" y="38" width="8" height="8" fill="black" />
                  <rect x="46" y="44" width="10" height="10" fill="black" />
                  <rect x="60" y="38" width="8" height="8" fill="black" />
                  <rect x="72" y="44" width="6" height="6" fill="black" />
                  <rect x="82" y="38" width="8" height="8" fill="black" />

                  <rect x="38" y="60" width="8" height="8" fill="black" />
                  <rect x="52" y="62" width="12" height="8" fill="black" />
                  <rect x="42" y="74" width="10" height="10" fill="black" />
                  <rect x="58" y="78" width="10" height="8" fill="black" />
                  <rect x="74" y="68" width="12" height="12" fill="black" />
                </svg>

                {gateUnlocked && (
                  <div className="absolute inset-0 bg-emerald-500/90 rounded-2xl flex items-center justify-center text-white backdrop-blur-xs">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                )}
              </div>

              <div className="text-[10px] font-mono text-slate-400 mt-2">
                {receipt.gatePassQr}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Scan this QR code against the exit turnstile barrier sensor to walk out
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <button
            onClick={() => {
              const text = `SCAN AND GO — Supermarket GST Tax Invoice\nStore: ${receipt.storeName}\nInvoice No: ${receipt.orderId}\nTotal Paid: ₹${receipt.total}\nStatus: PAID IN FULL ✓\nStore App: ${window.location.href}`;
              if (navigator.share) {
                navigator
                  .share({
                    title: 'SCAN AND GO',
                    text: text,
                    url: window.location.href,
                  })
                  .catch(() => {});
              } else if (navigator.clipboard) {
                navigator.clipboard.writeText(text);
                setShareCopied(true);
                setTimeout(() => setShareCopied(false), 2000);
              }
            }}
            className="w-full sm:w-auto px-5 py-3 border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4 text-[#d71920]" />
            <span>{shareCopied ? 'Receipt Text Copied!' : 'Share English Receipt'}</span>
          </button>

          <button
            onClick={() => {
              onClose();
              if (onOpenExitGate) {
                onOpenExitGate();
              }
            }}
            className="w-full sm:flex-1 py-3 bg-[#d71920] hover:bg-[#b0141a] text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-red-600/30"
          >
            <span>PROCEED TO TURNSTILE EXIT GATE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

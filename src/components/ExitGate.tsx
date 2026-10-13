import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  X,
  QrCode,
  CheckCircle2,
  Lock,
  Unlock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  RotateCcw,
  Footprints,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { Receipt } from '../types/store';
import { sound } from '../utils/audio';

interface ExitGateProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: Receipt | null;
  storeName: string;
  onFinishShopping: () => void;
}

export const ExitGate: React.FC<ExitGateProps> = ({
  isOpen,
  onClose,
  receipt,
  storeName,
  onFinishShopping,
}) => {
  const [gateStatus, setGateStatus] = useState<
    'LOCKED' | 'SCANNING' | 'VERIFIED' | 'PASSING' | 'CLEARED'
  >('LOCKED');
  const [tripodAngle, setTripodAngle] = useState(0);
  const [personProgress, setPersonProgress] = useState(0); // 0 (before gate), 50 (passing), 100 (cleared)

  useEffect(() => {
    if (isOpen) {
      setGateStatus('LOCKED');
      setTripodAngle(0);
      setPersonProgress(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const orderId = receipt?.orderId || 'VJA-928471';
  const totalAmount = receipt?.total || 495;
  const itemCount = receipt?.items?.length || 4;

  const handleScanPass = () => {
    setGateStatus('SCANNING');
    sound.playScanBeep();

    setTimeout(() => {
      sound.playGateUnlock();
      setGateStatus('VERIFIED');

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.5 },
        });
      } catch {}
    }, 1200);
  };

  const handleWalkThrough = () => {
    setGateStatus('PASSING');
    sound.playGateUnlock();

    // Rotate the tripod turnstile arm by 120 degrees
    setTripodAngle((prev) => prev + 120);
    setPersonProgress(50);

    setTimeout(() => {
      setPersonProgress(100);
      setGateStatus('CLEARED');
      sound.playCheckoutSuccess();
    }, 900);
  };

  const handleResetGate = () => {
    setGateStatus('LOCKED');
    setTripodAngle(0);
    setPersonProgress(0);
  };

  const isUnlocked = gateStatus === 'VERIFIED' || gateStatus === 'PASSING' || gateStatus === 'CLEARED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] text-white">
        {/* Top Header */}
        <div className="bg-slate-950 p-4 sm:px-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors shadow-lg ${
                isUnlocked
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                  : 'bg-red-600 text-white shadow-red-600/30'
              }`}
            >
              {isUnlocked ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">
                  Supermarket Exit Gate Simulator
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                  GATE #02
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {storeName} • Optical Barcode Barrier &amp; 3-Arm Turnstile
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
            title="Close Simulator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Simulator Viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Overhead Electronic Status Display Board */}
          <div className="p-4 rounded-2xl bg-slate-950 border-2 border-slate-800 shadow-inner flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  isUnlocked
                    ? 'bg-emerald-400 shadow-[0_0_15px_#34d399] animate-pulse'
                    : 'bg-red-500 shadow-[0_0_12px_#ef4444] animate-barrier-locked'
                }`}
              />
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest">
                  TURNSTILE STATUS:
                </div>
                <div
                  className={`text-sm font-black tracking-wider ${
                    isUnlocked ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {gateStatus === 'LOCKED' && 'LOCKED • SCAN DIGITAL EXIT PASS'}
                  {gateStatus === 'SCANNING' && 'READING BARCODE SENSOR...'}
                  {gateStatus === 'VERIFIED' && 'CLEARANCE CONFIRMED • PASS THROUGH'}
                  {gateStatus === 'PASSING' && 'STEPPING THROUGH TURNSTILE...'}
                  {gateStatus === 'CLEARED' && 'VISIT COMPLETE • HAVE A GREAT DAY!'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Invoice:</span>
              <span className="font-bold text-white bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                {orderId}
              </span>
            </div>
          </div>

          {/* REALISTIC 3D TURNSTILE PHYSICAL ENCLOSURE (framer-motion & CSS keyframes) */}
          <div className="relative h-64 sm:h-72 bg-gradient-to-b from-slate-950 to-slate-900 rounded-3xl border border-slate-800 overflow-hidden flex items-center justify-center p-4 shadow-2xl">
            {/* Supermarket Floor Tiles Graphic Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b20_1px,transparent_1px),linear-gradient(to_bottom,#1e293b20_1px,transparent_1px)] bg-[size:28px_28px] opacity-40 pointer-events-none" />

            {/* Walking Path Line on Floor */}
            <div className="absolute left-0 right-0 h-16 bg-slate-800/40 border-y border-dashed border-slate-700/60 flex items-center justify-around text-[10px] font-mono text-slate-500 tracking-widest uppercase pointer-events-none">
              <span>STORE INTERIOR</span>
              <span className="text-red-400/80 font-black">▶ TURNSTILE CHECKPOINT ▶</span>
              <span>PARKING / EXIT</span>
            </div>

            {/* Left Stainless Steel Stanchion Post */}
            <div className="relative z-10 w-16 sm:w-20 h-48 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-2xl border-2 border-slate-600 shadow-2xl flex flex-col justify-between p-2">
              <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                <div
                  className={`w-2 h-2 rounded-full transition-colors ${
                    isUnlocked ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-red-500'
                  }`}
                />
              </div>

              {/* Optical Sensor Eye Left */}
              <div className="w-full py-1 bg-slate-950 rounded border border-slate-700 flex items-center justify-center">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    isUnlocked ? 'bg-emerald-400' : 'bg-red-500'
                  }`}
                />
              </div>

              {/* Stanchion Base Plate */}
              <div className="w-full text-[8px] font-mono text-center text-slate-400 uppercase">
                POST A
              </div>
            </div>

            {/* Center Gate Corridor: Dual Acrylic Flaps + Tripod Turnstile Arms */}
            <div className="relative z-20 flex-1 h-full flex items-center justify-center px-4">
              {/* Dual Barrier Flaps (Framer-Motion rotation) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Left Acrylic Flap */}
                <motion.div
                  animate={{
                    rotate: isUnlocked ? -75 : 0,
                    x: isUnlocked ? -20 : 0,
                    opacity: isUnlocked ? 0.3 : 0.9,
                  }}
                  transition={{ type: 'spring', stiffness: 120, damping: 15 }}
                  className="w-16 sm:w-24 h-2 bg-gradient-to-r from-red-500/80 to-transparent border-t border-b border-red-400 rounded-l-full shadow-[0_0_12px_rgba(239,68,68,0.6)] origin-left"
                />

                {/* Right Acrylic Flap */}
                <motion.div
                  animate={{
                    rotate: isUnlocked ? 75 : 0,
                    x: isUnlocked ? 20 : 0,
                    opacity: isUnlocked ? 0.3 : 0.9,
                  }}
                  transition={{ type: 'spring', stiffness: 120, damping: 15 }}
                  className="w-16 sm:w-24 h-2 bg-gradient-to-l from-red-500/80 to-transparent border-t border-b border-red-400 rounded-r-full shadow-[0_0_12px_rgba(239,68,68,0.6)] origin-right"
                />
              </div>

              {/* Tripod Mechanical 3-Arm Rotating Hub */}
              <motion.div
                animate={{ rotate: tripodAngle }}
                transition={{ type: 'spring', stiffness: 100, damping: 12 }}
                className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-slate-600 bg-slate-800 shadow-2xl flex items-center justify-center"
              >
                {/* Center Axis Cap */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-300 via-slate-400 to-slate-600 shadow-md border-2 border-slate-200 z-30 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                </div>

                {/* Turnstile Arm 1 (0 deg) */}
                <div className="absolute top-1/2 left-1/2 w-14 sm:w-16 h-3 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400 rounded-full shadow-lg border border-slate-500 origin-left transform -translate-y-1/2" />

                {/* Turnstile Arm 2 (120 deg) */}
                <div className="absolute top-1/2 left-1/2 w-14 sm:w-16 h-3 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400 rounded-full shadow-lg border border-slate-500 origin-left transform -translate-y-1/2 rotate-120" />

                {/* Turnstile Arm 3 (240 deg) */}
                <div className="absolute top-1/2 left-1/2 w-14 sm:w-16 h-3 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400 rounded-full shadow-lg border border-slate-500 origin-left transform -translate-y-1/2 rotate-240" />
              </motion.div>

              {/* Shopper Avatar (Walks through with framer-motion) */}
              <AnimatePresence>
                {personProgress > 0 && (
                  <motion.div
                    initial={{ x: -140, opacity: 0, scale: 0.8 }}
                    animate={{
                      x: personProgress === 50 ? 0 : 150,
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 90, damping: 14 }}
                    className="absolute z-40 flex flex-col items-center justify-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center shadow-lg border-2 border-white">
                      <ShoppingBag className="w-5 h-5 text-slate-950" />
                    </div>
                    <span className="text-[10px] font-black bg-slate-900/90 text-white px-2 py-0.5 rounded-md mt-1 whitespace-nowrap shadow-md">
                      Shopper Cleared ✓
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Stainless Steel Stanchion with Optical Barcode Reader */}
            <div className="relative z-10 w-16 sm:w-20 h-48 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-2xl border-2 border-slate-600 shadow-2xl flex flex-col justify-between p-2">
              {/* Optical Barcode Reader Window on Top */}
              <div className="relative w-full h-10 rounded-xl bg-slate-950 border-2 border-slate-600 overflow-hidden flex items-center justify-center p-1">
                <QrCode className="w-5 h-5 text-slate-400" />
                {/* Vertical Laser Beam Sweep Keyframe */}
                <div className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_8px_#ef4444] animate-laser-sweep" />
              </div>

              {/* Optical Sensor Eye Right */}
              <div className="w-full py-1 bg-slate-950 rounded border border-slate-700 flex items-center justify-center">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    isUnlocked ? 'bg-emerald-400' : 'bg-red-500'
                  }`}
                />
              </div>

              {/* Stanchion Base Plate */}
              <div className="w-full text-[8px] font-mono text-center text-slate-400 uppercase">
                POST B
              </div>
            </div>
          </div>

          {/* DIGITAL EXIT PASS & ACTION CONTROLS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Digital Pass Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">OFFICIAL STORE PASS</div>
                  <div className="font-bold text-white text-sm">{orderId}</div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold">
                  PAID IN FULL ✓
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span>Items Verified:</span>
                <span className="font-bold text-white">{itemCount} Products</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Total Amount Paid:</span>
                <span className="font-bold text-emerald-400 font-mono text-sm">₹{totalAmount}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Anti-Theft Check:</span>
                <span className="text-emerald-400 font-bold">Passed (Weight Matched)</span>
              </div>
            </div>

            {/* Simulation Action Controls */}
            <div className="space-y-3">
              {gateStatus === 'LOCKED' && (
                <button
                  type="button"
                  onClick={handleScanPass}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-[#d71920] hover:from-red-500 hover:to-red-600 active:scale-98 text-white font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-red-600/30 transition cursor-pointer"
                >
                  <QrCode className="w-5 h-5" />
                  <span>Scan Digital Pass at Sensor</span>
                </button>
              )}

              {gateStatus === 'SCANNING' && (
                <div className="w-full py-4 px-6 rounded-2xl bg-slate-800 border border-slate-700 text-slate-300 font-bold text-sm flex items-center justify-center gap-3">
                  <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Invoice against Database...</span>
                </div>
              )}

              {gateStatus === 'VERIFIED' && (
                <button
                  type="button"
                  onClick={handleWalkThrough}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-98 text-white font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/30 transition cursor-pointer animate-bounce"
                >
                  <Footprints className="w-5 h-5" />
                  <span>Step Through Turnstile Gate (Push Arm)</span>
                </button>
              )}

              {(gateStatus === 'PASSING' || gateStatus === 'CLEARED') && (
                <div className="space-y-2">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center text-xs text-emerald-400 font-bold">
                    🎉 Gate Cleared! Thank you for shopping with us!
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleResetGate}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Re-simulate Gate</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onFinishShopping();
                      }}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#d71920] hover:bg-red-700 text-white font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                    >
                      <span>Exit Store</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              <p className="text-[11px] text-slate-500 text-center">
                Uses optical QR laser sensors &amp; physical tripod turnstile arms to verify customer receipts before building exit.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Anti-Theft Weight &amp; Invoice Security Verified</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition cursor-pointer"
          >
            Close Gate
          </button>
        </div>
      </div>
    </div>
  );
};

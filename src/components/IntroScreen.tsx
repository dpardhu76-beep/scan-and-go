import React, { useEffect } from 'react';
import { ArrowRight, ShoppingCart, Zap, Sparkles, Scale, QrCode, FileText, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/audio';
import { AnimatedLogo } from './AnimatedLogo';

interface IntroScreenProps {
  onComplete: () => void;
}

// Module-level guard: guarantees sound runs only once per session
let hasIntroSoundPlayedGlobal = false;

export const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    if (!hasIntroSoundPlayedGlobal) {
      hasIntroSoundPlayedGlobal = true;
      sound.playScanBeep();
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#06080e] text-white flex flex-col items-center justify-between overflow-y-auto select-none p-4 sm:p-6">
      {/* Background radial atmosphere */}
      <div className="absolute inset-0 bg-radial from-red-950/25 via-[#06080e] to-[#030408] pointer-events-none" />

      {/* Ambient background particles and glowing rings */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-red-600/10 blur-[120px] pointer-events-none top-1/4 animate-pulse" />

      {/* Top Brand Badge */}
      <div className="relative z-10 w-full max-w-2xl pt-2 sm:pt-4 flex items-center justify-between">
        <AnimatedLogo size="sm" showText={true} />

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/70 border border-red-600/40 text-red-300 text-[11px] font-bold">
          <Sparkles className="w-3 h-3 text-yellow-400" />
          <span>Zero-Queue Shopping</span>
        </div>
      </div>

      {/* Main Hook & Hero Presentation */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-2xl mx-auto w-full my-auto py-6">
        {/* Animated Single Logo & Scanning Laser */}
        <div className="relative mb-6 flex flex-col items-center">
          <AnimatedLogo size="hero" />
        </div>

        {/* HIGH IMPACT HOOK HEADLINE */}
        <div className="space-y-2 mb-6">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase leading-tight">
            SKIP BILLING LINES. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff3844] via-orange-400 to-[#ff3844]">
              SCAN, PAY &amp; WALK OUT.
            </span>
          </h1>

          <p className="text-xs sm:text-base text-slate-300 font-medium max-w-xl mx-auto pt-1 leading-relaxed">
            India's most advanced self-checkout supermarket experience. Bag items straight from shelves, pay instantly with PhonePe / GPay UPI, and exit via digital turnstile barcode in under 60 seconds.
          </p>
        </div>

        {/* 4 FEATURE DETAILS HIGHLIGHT GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 w-full mb-7 text-left">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex flex-col justify-between">
            <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center mb-2">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black text-white">Live Barcode Scan</div>
              <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">Point camera at shelf barcodes &amp; add to cart</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex flex-col justify-between">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black text-white">Weigh Produce</div>
              <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">Integrated digital scale for fruits &amp; veggies</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex flex-col justify-between">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black text-white">Instant UPI Pay</div>
              <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">PhonePe, GPay, Paytm with zero cashier wait</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex flex-col justify-between">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black text-white">English GST Bill</div>
              <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">WhatsApp tax invoice &amp; turnstile gate pass</div>
            </div>
          </div>
        </div>

        {/* PRIMARY HOOK ACTION: CREATE ACCOUNT & GET STARTED */}
        <div className="w-full max-w-md">
          <button
            onClick={onComplete}
            className="w-full group inline-flex items-center justify-center gap-3.5 px-8 py-4 bg-gradient-to-r from-[#d71920] to-[#b0141a] hover:from-[#e81d26] hover:to-[#c4161c] active:scale-98 text-white font-black text-sm sm:text-base rounded-2xl shadow-2xl shadow-red-600/50 border-2 border-red-500/70 hover:border-red-400 transition-all cursor-pointer"
          >
            <span>GET STARTED • ENTER GOOGLE ID &amp; MOBILE</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform shrink-0" />
          </button>

          <p className="text-[11px] text-slate-400 mt-2.5 flex items-center justify-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Supported at 20+ Supermarkets in Vijayawada • Vishal Mart, Spencers, DMart</span>
          </p>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="relative z-10 text-[11px] text-slate-500 py-2">
        SCAN AND GO • Next-Gen Supermarket Self-Checkout
      </div>
    </div>
  );
};

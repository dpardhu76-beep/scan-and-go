import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Smartphone,
  ShieldCheck,
  Tag,
  Lock,
  ArrowRight,
  Loader2,
  CreditCard,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react';
import { CartItem, LanguageCode, Receipt, StoreLocation } from '../types/store';
import { DEMO_COUPONS, TRANSLATIONS } from '../utils/mockData';
import { sound } from '../utils/audio';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  store: StoreLocation;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  couponCode: string;
  onApplyCoupon: (code: string) => boolean;
  onPaymentSuccess: (receipt: Receipt) => void;
  language: LanguageCode;
  userPhone?: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  store,
  subtotal,
  discount,
  tax,
  total,
  couponCode,
  onApplyCoupon,
  onPaymentSuccess,
  language,
  userPhone,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'phonepe' | 'gpay' | 'paytm' | 'card'>('phonepe');
  const [mobileNumber, setMobileNumber] = useState(userPhone || '9848012345');

  React.useEffect(() => {
    if (userPhone) {
      setMobileNumber(userPhone);
    }
  }, [userPhone, isOpen]);
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [auditStep, setAuditStep] = useState<string | null>(null);

  if (!isOpen) return null;

  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];
  const isTelugu = language === 'te';
  const totalWeightKg = cartItems.reduce((acc, item) => acc + item.measuredWeightKg * item.quantity, 0);

  const upiId = 'supermarket.vja@icici';
  const upiPayUrl = `upi://pay?pa=${upiId}&pn=Vijayawada_Smart_Supermarket&am=${total}&cu=INR&tn=Bill_Checkout`;

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const ok = onApplyCoupon(couponInput.trim().toUpperCase());
    if (ok) {
      setCouponMsg({
        type: 'success',
        text: isTelugu ? 'కూపన్ వర్తించబడింది! (Coupon applied!)' : 'Coupon applied successfully!',
      });
      setCouponInput('');
    } else {
      setCouponMsg({
        type: 'error',
        text: isTelugu
          ? 'చెల్లని కోడ్. "VIJAYAWADA10" లేదా "SMART20" ప్రయత్నించండి'
          : 'Invalid code. Try "VIJAYAWADA10" or "SMART20"',
      });
    }
    setTimeout(() => setCouponMsg(null), 3500);
  };

  const handlePayNow = () => {
    if (!mobileNumber || mobileNumber.length < 10) {
      alert(
        isTelugu
          ? 'దయచేసి 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి'
          : 'Please enter a 10-digit mobile number to receive your WhatsApp bill'
      );
      return;
    }

    setIsProcessing(true);
    setAuditStep('Verifying cart weight & anti-theft sensors...');

    setTimeout(() => {
      setAuditStep(`Connecting to ${paymentMethod.toUpperCase()} UPI Gateway...`);
      setTimeout(() => {
        setAuditStep(`Generating WhatsApp GST e-bill for +91 ${mobileNumber}...`);
        setTimeout(() => {
          sound.playCheckoutSuccess();
          try {
            confetti({
              particleCount: 100,
              spread: 80,
              origin: { y: 0.6 },
            });
          } catch {}

          const cgst = +(tax / 2).toFixed(2);
          const sgst = +(tax / 2).toFixed(2);

          const generatedReceipt: Receipt = {
            orderId: `VJA-${Math.floor(100000 + Math.random() * 900000)}`,
            date: new Date().toLocaleString('en-IN', {
              dateStyle: 'medium',
              timeStyle: 'short',
            }),
            storeName: store.name,
            storeAddress: `${store.address}, ${store.area}`,
            pincode: store.pincode,
            items: [...cartItems],
            subtotal,
            discount,
            cgst,
            sgst,
            total,
            savings:
              discount +
              cartItems.reduce(
                (acc, it) =>
                  acc +
                  (it.product.originalPrice ? it.product.originalPrice - it.product.price : 0) *
                    it.quantity,
                0
              ),
            paymentMethod:
              paymentMethod === 'phonepe'
                ? 'PhonePe UPI (@ybl)'
                : paymentMethod === 'gpay'
                ? 'Google Pay (UPI / NFC)'
                : paymentMethod === 'paytm'
                ? 'Paytm UPI Wallet'
                : 'RuPay / Visa Debit Card',
            mobileNumber: `+91 ${mobileNumber}`,
            upiRefNumber: `UPI${Math.floor(100000000000 + Math.random() * 900000000000)}`,
            gatePassQr: `GATEPASS-VJA-${store.id}-${Date.now()}`,
            securityStatus: 'CLEAR',
            membershipTier: 'Vijayawada Super Shopper Club',
            pointsEarned: Math.round(total / 10),
          };

          setIsProcessing(false);
          setAuditStep(null);
          onPaymentSuccess(generatedReceipt);
        }, 800);
      }, 700);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#d71920] flex items-center justify-center text-white shadow-md shadow-red-500/25">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight">{t.checkout}</h2>
              <p className="text-xs text-slate-400">100% Secure UPI / Card Payment (₹)</p>
            </div>
          </div>
          {!isProcessing && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Mobile Number for WhatsApp / SMS Digital Bill */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl">
            <label className="block text-xs font-black text-emerald-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-700" />
              <span>Bill will be delivered directly to your WhatsApp:</span>
            </label>
            <p className="text-[11px] text-emerald-700 mb-2">
              Digital Tax Invoice & Exit Gate Pass will be sent instantly to your phone
            </p>
            <div className="flex items-center gap-2">
              <span className="px-3 py-2 bg-white rounded-xl border border-emerald-300 font-bold text-xs text-slate-700">
                🇮🇳 +91
              </span>
              <input
                type="tel"
                maxLength={10}
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="10-digit mobile number (e.g. 9848012345)"
                className="flex-1 px-3 py-2 bg-white rounded-xl border border-emerald-300 text-sm font-mono font-bold text-slate-900 outline-hidden focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Anti-Theft Sensor Status */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Cart weight sensor verified: {totalWeightKg.toFixed(2)} kg</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              Verified ✓
            </span>
          </div>

          {/* UPI Payment Options (PhonePe, GPay, Paytm) */}
          <div>
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
              Select UPI / Card Payment Method:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('phonepe')}
                className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer flex items-center justify-between ${
                  paymentMethod === 'phonepe'
                    ? 'border-purple-600 bg-purple-50/80 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center">
                    Pe
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-slate-900">PhonePe</div>
                    <div className="text-[10px] text-purple-700 font-semibold">Instant UPI</div>
                  </div>
                </div>
                {paymentMethod === 'phonepe' && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('gpay')}
                className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer flex items-center justify-between ${
                  paymentMethod === 'gpay'
                    ? 'border-blue-600 bg-blue-50/80 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                    G
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-slate-900">Google Pay</div>
                    <div className="text-[10px] text-blue-700 font-semibold">GPay UPI</div>
                  </div>
                </div>
                {paymentMethod === 'gpay' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('paytm')}
                className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer flex items-center justify-between ${
                  paymentMethod === 'paytm'
                    ? 'border-sky-600 bg-sky-50/80 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-500 text-white font-black text-xs flex items-center justify-center">
                    Pay
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-slate-900">Paytm</div>
                    <div className="text-[10px] text-sky-700 font-semibold">Wallet & UPI</div>
                  </div>
                </div>
                {paymentMethod === 'paytm' && <CheckCircle2 className="w-4 h-4 text-sky-600" />}
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer flex items-center justify-between ${
                  paymentMethod === 'card'
                    ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="font-bold text-xs sm:text-sm">RuPay / Card</div>
                    <div className="text-[10px] opacity-70">Debit & Credit</div>
                  </div>
                </div>
                {paymentMethod === 'card' && <CheckCircle2 className="w-4 h-4 text-white" />}
              </button>
            </div>
          </div>

          {/* Interactive Screen UPI QR Code */}
          <div className="p-3.5 bg-slate-900 text-white rounded-2xl text-center space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
              <span>SCAN ANY UPI APP:</span>
              <span className="font-bold text-amber-400">TOTAL: ₹{total}</span>
            </div>

            <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl shadow flex items-center justify-center relative">
              <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950 fill-current">
                <rect x="4" y="4" width="28" height="28" fill="black" />
                <rect x="8" y="8" width="20" height="20" fill="white" />
                <rect x="12" y="12" width="12" height="12" fill="black" />

                <rect x="68" y="4" width="28" height="28" fill="black" />
                <rect x="72" y="8" width="20" height="20" fill="white" />
                <rect x="76" y="12" width="12" height="12" fill="black" />

                <rect x="4" y="68" width="28" height="28" fill="black" />
                <rect x="8" y="72" width="20" height="20" fill="white" />
                <rect x="12" y="76" width="12" height="12" fill="black" />

                <rect x="36" y="8" width="8" height="8" fill="black" />
                <rect x="48" y="12" width="8" height="8" fill="black" />
                <rect x="40" y="24" width="8" height="8" fill="black" />
                <rect x="52" y="24" width="8" height="8" fill="black" />
                <rect x="12" y="38" width="6" height="6" fill="black" />
                <rect x="22" y="44" width="8" height="8" fill="black" />
                <rect x="46" y="44" width="10" height="10" fill="black" />
                <rect x="60" y="38" width="8" height="8" fill="black" />
                <rect x="74" y="68" width="12" height="12" fill="black" />
              </svg>
              <div className="absolute inset-0 m-auto w-8 h-8 bg-white rounded-md shadow border border-slate-300 flex items-center justify-center text-[9px] font-black text-indigo-700">
                UPI
              </div>
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              {upiId}
            </div>

            <div className="flex justify-center gap-2 pt-1">
              <a
                href={upiPayUrl}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition flex items-center gap-1"
              >
                <Smartphone className="w-3.5 h-3.5 text-purple-400" /> PhonePe Direct Link
              </a>
              <a
                href={upiPayUrl}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition flex items-center gap-1"
              >
                <Smartphone className="w-3.5 h-3.5 text-blue-400" /> GPay Direct Link
              </a>
            </div>
          </div>

          {/* Coupon Code Section */}
          <div>
            <form onSubmit={handleCouponSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder={isTelugu ? 'కూపన్ కోడ్ (e.g. VIJAYAWADA10)' : 'Promo coupon (e.g. VIJAYAWADA10)'}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-mono uppercase focus:border-red-500 outline-hidden"
                />
                <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                {t.applyCoupon}
              </button>
            </form>

            {couponMsg && (
              <p className={`text-xs mt-1 font-semibold ${couponMsg.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
                {couponMsg.text}
              </p>
            )}

            {couponCode && (
              <div className="mt-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 flex items-center justify-between">
                <span>Applied Coupon: {couponCode}</span>
                <span>-₹{discount}</span>
              </div>
            )}
          </div>

          {/* Bill Breakdown in Rupees */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>{t.subtotal} ({cartItems.reduce((a, b) => a + b.quantity, 0)} {isTelugu ? 'వస్తువులు' : 'items'})</span>
              <span className="font-mono font-bold">₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>{t.savings}</span>
                <span className="font-mono">-₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>GST Tax (5%)</span>
              <span className="font-mono font-bold">₹{tax}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-slate-900">
              <span className="text-sm font-black">{t.total}</span>
              <span className="text-2xl font-black font-mono text-[#d71920]">
                ₹{total}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button & Processing Overlay */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          {isProcessing ? (
            <div className="py-3 px-4 rounded-xl bg-slate-900 text-white flex items-center justify-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-red-500" />
              <span className="text-xs font-bold">{auditStep}</span>
            </div>
          ) : (
            <button
              onClick={handlePayNow}
              className="w-full py-4 bg-[#d71920] hover:bg-[#b0141a] active:scale-98 text-white font-black text-sm rounded-2xl shadow-xl shadow-red-600/30 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{isTelugu ? `చెల్లించండి (₹${total})` : `PAY ₹${total} NOW`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

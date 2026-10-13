import React from 'react';
import { X, Smartphone, ArrowRight, CheckCircle2, QrCode, ShieldCheck } from 'lucide-react';
import { ProductItem } from '../types/store';

interface ProductUpiQrModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onDirectPaid: (product: ProductItem) => void;
}

export const ProductUpiQrModal: React.FC<ProductUpiQrModalProps> = ({
  product,
  onClose,
  onDirectPaid,
}) => {
  if (!product) return null;

  const upiId = 'supermarket.vja@icici';
  const upiUrl = `upi://pay?pa=${upiId}&pn=Vijayawada_Smart_Supermarket&am=${product.price}&cu=INR&tn=Item_${product.id}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight">Instant Product UPI QR</h2>
              <p className="text-xs text-purple-200">Scan & Pay directly from your Phone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 text-center space-y-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-left">
            <img src={product.image} alt={product.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
            <div className="min-w-0">
              <h4 className="font-bold text-slate-900 text-sm truncate">{product.name}</h4>
              <p className="text-xs text-slate-500">{product.brand} • {product.unit}</p>
              <div className="text-base font-black text-slate-900 font-mono mt-0.5">₹{product.price}</div>
            </div>
          </div>

          {/* Large High-Contrast UPI QR Code */}
          <div className="w-52 h-52 mx-auto p-3 bg-white rounded-2xl border-4 border-slate-900 shadow-md flex items-center justify-center relative">
            <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950 fill-current">
              {/* Corner position markers */}
              <rect x="4" y="4" width="28" height="28" fill="black" />
              <rect x="8" y="8" width="20" height="20" fill="white" />
              <rect x="12" y="12" width="12" height="12" fill="black" />

              <rect x="68" y="4" width="28" height="28" fill="black" />
              <rect x="72" y="8" width="20" height="20" fill="white" />
              <rect x="76" y="12" width="12" height="12" fill="black" />

              <rect x="4" y="68" width="28" height="28" fill="black" />
              <rect x="8" y="72" width="20" height="20" fill="white" />
              <rect x="12" y="76" width="12" height="12" fill="black" />

              {/* Data pattern */}
              <rect x="36" y="8" width="8" height="8" fill="black" />
              <rect x="48" y="12" width="8" height="8" fill="black" />
              <rect x="40" y="24" width="8" height="8" fill="black" />
              <rect x="52" y="24" width="8" height="8" fill="black" />

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
              <rect x="80" y="84" width="8" height="8" fill="black" />
            </svg>

            {/* UPI Center badge */}
            <div className="absolute inset-0 m-auto w-10 h-10 bg-white rounded-xl shadow border border-slate-300 flex items-center justify-center text-[10px] font-black text-indigo-700">
              UPI
            </div>
          </div>

          <div className="text-xs text-slate-600 font-mono">
            UPI ID: <span className="font-bold text-slate-900">{upiId}</span>
          </div>

          {/* Quick Pay Buttons with PhonePe / Google Pay / Paytm */}
          <div className="pt-2 grid grid-cols-3 gap-2">
            <a
              href={upiUrl}
              onClick={() => onDirectPaid(product)}
              className="p-2.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs flex flex-col items-center justify-center transition cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-purple-700 mb-1" />
              <span>PhonePe</span>
            </a>

            <a
              href={upiUrl}
              onClick={() => onDirectPaid(product)}
              className="p-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs flex flex-col items-center justify-center transition cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-blue-600 mb-1" />
              <span>Google Pay</span>
            </a>

            <a
              href={upiUrl}
              onClick={() => onDirectPaid(product)}
              className="p-2.5 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-900 font-bold text-xs flex flex-col items-center justify-center transition cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-sky-600 mb-1" />
              <span>Paytm</span>
            </a>
          </div>

          <button
            onClick={() => onDirectPaid(product)}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-emerald-600/25"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark Paid & Add to Bill Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};

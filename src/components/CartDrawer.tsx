import React from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Scale,
} from 'lucide-react';
import { CartItem, LanguageCode } from '../types/store';
import { TRANSLATIONS } from '../utils/mockData';
import { WeightSecurityBadge } from './WeightSecurityBadge';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (productId: string, newQty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOpenCheckout: () => void;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  language: LanguageCode;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onOpenCheckout,
  subtotal,
  discount,
  tax,
  total,
  language,
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[language] || TRANSLATIONS['te'];
  const totalItemCount = items.reduce((acc, it) => acc + it.quantity, 0);
  const totalWeightKg = items.reduce((acc, it) => acc + it.measuredWeightKg * it.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#d71920] flex items-center justify-center text-white shadow-md shadow-red-500/30">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight">{t.cart}</h2>
              <p className="text-xs text-slate-400">
                {totalItemCount} {t.itemsInCart} • {totalWeightKg.toFixed(2)} kg
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {items.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs font-semibold text-slate-400 hover:text-red-400 px-2 py-1 rounded transition cursor-pointer"
              >
                ఖాళీ చేయి (Clear)
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Anti-Theft Sensor Status */}
        <div className="p-3 bg-slate-100 border-b border-slate-200">
          <WeightSecurityBadge totalWeightKg={totalWeightKg} itemCount={totalItemCount} />
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-3">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-700 text-base mb-1">{t.emptyCart}</h3>
              <p className="text-xs max-w-xs">{t.emptyCartSub}</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3 hover:border-slate-300 transition"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                    {item.product.name}
                  </div>
                  {item.product.teluguName && (
                    <div className="text-[11px] text-slate-500 truncate">{item.product.teluguName}</div>
                  )}
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                    <span className="font-mono font-bold text-slate-900">₹{item.product.price}</span>
                    <span>•</span>
                    <span className="text-slate-400 font-mono">{(item.measuredWeightKg * item.quantity).toFixed(2)} kg</span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button
                        onClick={() => onUpdateQty(item.product.id, item.quantity - 1)}
                        className="px-2 py-1 text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-slate-800 font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQty(item.product.id, item.quantity + 1)}
                        className="px-2 py-1 text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="p-1 text-slate-300 hover:text-red-500 rounded transition cursor-pointer ml-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-right self-start">
                  <div className="text-sm font-black font-mono text-slate-900">
                    ₹{item.product.price * item.quantity}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Totals and Checkout CTA */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border-t border-slate-200 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>{t.subtotal}</span>
                <span className="font-mono font-bold">₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>{t.savings}</span>
                  <span className="font-mono">-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{t.tax}</span>
                <span className="font-mono font-bold">₹{tax}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-slate-900">
                <span className="text-sm font-black">{t.total}</span>
                <span className="text-2xl font-black font-mono text-[#d71920]">
                  ₹{total}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenCheckout();
              }}
              className="w-full py-4 bg-gradient-to-r from-[#d71920] to-orange-600 hover:from-red-600 hover:to-orange-500 active:scale-98 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-red-600/30 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{t.checkout} (₹{total})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

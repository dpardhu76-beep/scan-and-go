import React, { useState } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Scale,
  ShoppingBag,
  QrCode,
  Check,
  Plus,
  Minus,
  MapPin,
} from 'lucide-react';
import { ProductItem, LanguageCode } from '../types/store';
import { sound } from '../utils/audio';

interface ProductDetailModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onAddToCart: (product: ProductItem, quantity: number) => void;
  onOpenScale: (product: ProductItem) => void;
  onOpenUpiQr: (product: ProductItem) => void;
  language: LanguageCode;
  storeName: string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onOpenScale,
  onOpenUpiQr,
  language,
  storeName,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  if (!product) return null;

  const isTelugu = language === 'te';

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    sound.playScanBeep();
    onAddToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      onClose();
    }, 900);
  };

  const handleWeigh = () => {
    onClose();
    onOpenScale(product);
  };

  const handleUpiPay = () => {
    onClose();
    onOpenUpiQr(product);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 sm:px-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 truncate">
            <span className="text-[10px] font-black uppercase tracking-wider bg-[#d71920] px-2 py-0.5 rounded text-white shrink-0">
              {product.category}
            </span>
            <span className="text-xs text-slate-300 truncate">
              {storeName} • {product.aisle}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer shrink-0 ml-2"
            title="Close Product View"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Top Section: Large Image & Pricing Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            {/* Image Container with Badges */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Assured Badge */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-blue-600/95 backdrop-blur-xs text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>SMART ASSURED</span>
              </div>

              {/* Discount Tag */}
              {discountPercent > 0 && (
                <span className="absolute top-2.5 right-2.5 text-xs font-black bg-emerald-600 text-white px-2.5 py-1 rounded-md shadow-sm">
                  {discountPercent}% OFF
                </span>
              )}

              {/* Aisle Location Floating Chip */}
              <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-slate-900/85 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                <MapPin className="w-3 h-3 text-red-400" />
                <span>{product.aisle}</span>
              </div>
            </div>

            {/* Product Details Overview */}
            <div className="space-y-3">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {product.brand}
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug mt-0.5">
                  {product.name}
                </h2>
                {isTelugu && product.teluguName && (
                  <p className="text-sm text-amber-800 font-bold mt-0.5">
                    {product.teluguName}
                  </p>
                )}
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-black bg-emerald-700 text-white px-2 py-0.5 rounded">
                  <span>{product.rating}</span>
                  <Star className="w-3 h-3 fill-current" />
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  {product.reviewsCount} customer reviews
                </span>
              </div>

              {/* Price Details */}
              <div className="p-3 bg-red-50/60 rounded-xl border border-red-100 space-y-1">
                <div className="flex items-baseline gap-2.5">
                  <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
                    ₹{product.price}
                  </div>
                  {product.originalPrice && (
                    <div className="text-sm line-through text-slate-400 font-mono">
                      ₹{product.originalPrice}
                    </div>
                  )}
                  {discountPercent > 0 && (
                    <span className="text-xs font-extrabold text-emerald-600">
                      Save ₹{product.originalPrice! - product.price}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Unit: <span className="font-bold text-slate-700">{product.unit}</span> ({product.weightKg} kg net weight)
                </div>
              </div>

              {/* Price Assurance Badge */}
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{product.assuranceBadge || 'Store Price Assurance ✓ 100% Genuine Guarantee'}</span>
              </div>
            </div>
          </div>

          {/* Description & Dietary Highlights */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Product Overview
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              {product.description}
            </p>

            {/* Dietary tags */}
            {product.dietary && product.dietary.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {product.dietary.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Big Interactive Retail Barcode Box */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span className="font-bold text-slate-700">SHELF BARCODE (EAN-13):</span>
              <span className="font-black text-slate-900 tracking-wider text-sm">{product.barcode}</span>
            </div>

            {/* Realistic Barcode Graphics */}
            <div className="py-1">
              <div className="h-10 w-full max-w-sm bg-[repeating-linear-gradient(90deg,#111,#111_3px,transparent_3px,transparent_6px,#111_6px,#111_8px,transparent_8px,transparent_11px)] opacity-90 mx-auto rounded-xs shadow-xs" />
            </div>

            <p className="text-[11px] text-slate-500">
              Direct physical shelf barcode ready for laser scanner reading
            </p>
          </div>
        </div>

        {/* Footer Action Bar: Quantity Controls + Add To Cart + UPI */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          {/* Quantity Selector */}
          {!product.isWeighable && (
            <div className="flex items-center justify-between w-full sm:w-auto bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0">
              <span className="text-xs font-bold text-slate-500 px-2 sm:hidden">Quantity:</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-xl bg-white hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center transition cursor-pointer shadow-xs"
                  title="Decrease Quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-black font-mono text-base text-slate-900 w-6 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-xl bg-white hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center transition cursor-pointer shadow-xs"
                  title="Increase Quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto sm:flex-1 justify-end">
            {/* Pay via UPI */}
            <button
              onClick={handleUpiPay}
              className="px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0"
              title="Instant UPI Payment"
            >
              <QrCode className="w-4 h-4 text-purple-700" />
              <span className="hidden sm:inline">UPI QR Pay</span>
              <span className="sm:hidden">UPI Pay</span>
            </button>

            {/* Main Add / Weigh Button */}
            {product.isWeighable ? (
              <button
                onClick={handleWeigh}
                className="flex-1 py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 active:scale-95 transition cursor-pointer"
              >
                <Scale className="w-4 h-4" />
                <span>{isTelugu ? 'డిజిటల్ కాటా తూకం వేయండి' : 'Weigh on Digital Scale'}</span>
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={justAdded}
                className={`flex-1 py-3 px-6 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition cursor-pointer ${
                  justAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#d71920] hover:bg-[#b0141a] text-white shadow-red-600/30'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>{isTelugu ? 'కార్ట్‌కు చేర్చబడింది ✓' : 'Added to Smart Cart ✓'}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      {isTelugu
                        ? `కార్ట్‌కు చేర్చండి • ₹${product.price * quantity}`
                        : `Add to Smart Cart • ₹${product.price * quantity}`}
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

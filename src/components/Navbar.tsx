import React, { useState } from 'react';
import {
  ShoppingBag,
  Barcode,
  Scale,
  CheckSquare,
  Globe,
  MapPin,
  Share2,
  Check,
  User,
  Receipt as ReceiptIcon,
} from 'lucide-react';
import { LanguageCode, StoreLocation, UserProfile } from '../types/store';
import { TRANSLATIONS } from '../utils/mockData';
import { AnimatedLogo } from './AnimatedLogo';

interface NavbarProps {
  currentStore: StoreLocation;
  currentLanguage: LanguageCode;
  cartCount: number;
  cartTotal: number;
  userProfile: UserProfile;
  onOpenStoreModal: () => void;
  onOpenLangModal: () => void;
  onOpenScanner: () => void;
  onOpenScale: () => void;
  onOpenList: () => void;
  onOpenCart: () => void;
  onOpenReceipts: () => void;
  onOpenAccount: () => void;
  completedListCount: number;
  totalListCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStore,
  currentLanguage,
  cartCount,
  cartTotal,
  userProfile,
  onOpenStoreModal,
  onOpenLangModal,
  onOpenScanner,
  onOpenScale,
  onOpenList,
  onOpenCart,
  onOpenReceipts,
  onOpenAccount,
  completedListCount,
  totalListCount,
}) => {
  const [copiedToast, setCopiedToast] = useState(false);
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];
  const isTelugu = currentLanguage === 'te';

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'SCAN AND GO',
          text: 'SCAN AND GO — Smart Supermarket Self-Checkout. Scan shelf barcodes & pay with UPI!',
          url: window.location.href,
        })
        .catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2200);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top micro bar like Flipkart / Amazon */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3 h-3 text-[#d71920]" />
            <span className="text-slate-400">{isTelugu ? 'స్థానం:' : 'Location:'}</span>
            <span className="font-bold text-white truncate">
              {currentStore.area}, Vijayawada - {currentStore.pincode}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-emerald-400 font-semibold hidden sm:inline">
              ✓ Verified GST Self-Checkout
            </span>
            <button
              onClick={onOpenLangModal}
              className="text-white hover:text-amber-300 font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Globe className="w-3 h-3" />
              <span className="uppercase">{currentLanguage}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Store Selector */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <AnimatedLogo size="md" showText={false} interactive={true} />
              <div className="hidden sm:block">
                <div className="font-black text-base tracking-tight text-slate-900 leading-none">
                  SCAN <span className="text-[#d71920]">AND</span> GO
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  {isTelugu ? 'విజయవాడ స్మార్ట్ మార్ట్' : 'Smart Supermarket'}
                </div>
              </div>
            </div>

            {/* Store Branch Pill */}
            <button
              onClick={onOpenStoreModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-xs font-bold text-slate-800 transition cursor-pointer max-w-[150px] sm:max-w-none border border-slate-200"
              title="Change Supermarket Branch"
            >
              <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span className="truncate">{currentStore.name}</span>
            </button>
          </div>

          {/* Center Action Shortcuts */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={onOpenScanner}
              className="px-4 py-2 rounded-xl bg-[#d71920] hover:bg-[#b0141a] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-red-500/25 active:scale-95 transition cursor-pointer"
            >
              <Barcode className="w-4 h-4" />
              <span>{t.scanBarcode}</span>
            </button>

            <button
              onClick={onOpenScale}
              className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-2 transition cursor-pointer"
            >
              <Scale className="w-4 h-4 text-emerald-600" />
              <span>{t.weighProduce}</span>
            </button>

            <button
              onClick={onOpenList}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
              <span>
                {isTelugu ? 'లిస్ట్' : 'List'} ({completedListCount}/{totalListCount})
              </span>
            </button>
          </div>

          {/* Right Utility & Corner Account */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Share App Button */}
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer flex items-center gap-1.5 text-xs font-bold relative"
              title="Share SCAN AND GO"
            >
              {copiedToast ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Share2 className="w-4 h-4 text-[#d71920]" />
              )}
              <span className="hidden sm:inline">{copiedToast ? 'Copied!' : 'Share'}</span>
              {copiedToast && (
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-[10px] rounded-md whitespace-nowrap shadow-lg z-50 animate-in fade-in">
                  Link Copied!
                </span>
              )}
            </button>

            {/* Corner Account Button (Checks Bills & Tools/Items Purchased) */}
            <button
              onClick={onOpenAccount}
              className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-[#d71920] border border-red-200 text-xs font-black transition cursor-pointer shadow-xs active:scale-95"
              title="My Account: Check Bills & Purchased Items"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#d71920] to-orange-500 text-white flex items-center justify-center text-[11px] font-black shadow-xs">
                {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'P'}
              </div>
              <span className="hidden sm:inline truncate max-w-[90px]">
                {userProfile.name ? userProfile.name.split(' ')[0] : 'Account'}
              </span>
            </button>

            {/* Smart Cart Button (Rupee Currency) */}
            <button
              onClick={onOpenCart}
              className="px-4 py-2 bg-slate-900 hover:bg-black active:scale-95 text-white rounded-xl font-bold text-xs flex items-center gap-2.5 transition shadow-sm cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#d71920] text-white text-[10px] font-black flex items-center justify-center animate-in zoom-in-50">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="font-mono text-sm">
                ₹{cartTotal}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

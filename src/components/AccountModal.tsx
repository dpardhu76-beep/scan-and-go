import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Receipt as ReceiptIcon,
  ShoppingBag,
  Award,
  Calendar,
  ArrowRight,
  Plus,
  CheckCircle2,
  Share2,
  ExternalLink,
  Store,
  Globe,
  Package,
} from 'lucide-react';
import { Receipt, UserProfile, ProductItem, CartItem, StoreLocation, LanguageCode } from '../types/store';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  receipts: Receipt[];
  onSelectReceipt: (receipt: Receipt) => void;
  onAddProductAgain: (product: ProductItem) => void;
  onSwitchStore: () => void;
  onSwitchLanguage: () => void;
  currentStore: StoreLocation;
  currentLanguage: LanguageCode;
  onSwitchAccount?: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  receipts,
  onSelectReceipt,
  onAddProductAgain,
  onSwitchStore,
  onSwitchLanguage,
  currentStore,
  currentLanguage,
  onSwitchAccount,
}) => {
  const [activeTab, setActiveTab] = useState<'bills' | 'purchased_items' | 'profile'>('bills');
  const [addedItemToast, setAddedItemToast] = useState<string | null>(null);

  if (!isOpen) return null;

  // Aggregate all unique purchased products / tools across all receipts
  const allPurchasedItems: {
    product: ProductItem;
    totalQuantity: number;
    lastPurchasedDate: string;
    storeName: string;
    orderId: string;
  }[] = [];

  const seenProductIds = new Set<string>();

  receipts.forEach((receipt) => {
    receipt.items.forEach((item) => {
      if (!seenProductIds.has(item.product.id)) {
        seenProductIds.add(item.product.id);
        const totalQty = receipts.reduce((sum, r) => {
          const matched = r.items.find((i) => i.product.id === item.product.id);
          return sum + (matched ? matched.quantity : 0);
        }, 0);

        allPurchasedItems.push({
          product: item.product,
          totalQuantity: totalQty,
          lastPurchasedDate: receipt.date,
          storeName: receipt.storeName,
          orderId: receipt.orderId,
        });
      }
    });
  });

  const handleBuyAgain = (prod: ProductItem) => {
    onAddProductAgain(prod);
    setAddedItemToast(prod.name);
    setTimeout(() => setAddedItemToast(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">
        {/* Header with Account Avatar */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 text-white p-5 sm:p-6 shrink-0 relative overflow-hidden">
          {/* Background decorative glow */}
          <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-red-600/20 blur-2xl pointer-events-none" />

          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d71920] to-orange-500 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-red-500/30 border-2 border-white/20">
                {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'P'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                    {userProfile.name || 'Shopper Account'}
                  </h2>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Award className="w-3 h-3" /> VIP Shopper
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-300 mt-1">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-red-400" />
                    <span>{userProfile.email || 'dpardhu76@gmail.com'}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>+91 {userProfile.phone || '9848012345'}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onSwitchAccount && (
                <button
                  onClick={() => {
                    onClose();
                    onSwitchAccount();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-white/20"
                  title="Switch to another Google ID or Mobile Number"
                >
                  <User className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">Switch User</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer shrink-0"
                title="Close Account"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Shopper Perks Summary Ribbon */}
          <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white/5 rounded-xl p-2 border border-white/5">
              <div className="text-slate-400 text-[10px] uppercase font-bold">Total Bills</div>
              <div className="font-black text-white text-base mt-0.5 font-mono">
                {receipts.length}
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-2 border border-white/5">
              <div className="text-slate-400 text-[10px] uppercase font-bold">Tools / Items Bought</div>
              <div className="font-black text-white text-base mt-0.5 font-mono">
                {allPurchasedItems.length}
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-2 border border-white/5">
              <div className="text-slate-400 text-[10px] uppercase font-bold">Wallet Points</div>
              <div className="font-black text-amber-300 text-base mt-0.5 font-mono">
                {userProfile.walletPoints || 300} Pts
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 shrink-0 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('bills')}
            className={`py-3 px-3.5 font-extrabold text-xs sm:text-sm border-b-2 flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'bills'
                ? 'border-[#d71920] text-[#d71920]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ReceiptIcon className="w-4 h-4" />
            <span>My Bills & GST Invoices ({receipts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('purchased_items')}
            className={`py-3 px-3.5 font-extrabold text-xs sm:text-sm border-b-2 flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'purchased_items'
                ? 'border-[#d71920] text-[#d71920]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Purchased Items & Tools ({allPurchasedItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3.5 font-extrabold text-xs sm:text-sm border-b-2 flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-[#d71920] text-[#d71920]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Shopper Profile</span>
          </button>
        </div>

        {/* Toast alert if re-added */}
        {addedItemToast && (
          <div className="bg-emerald-600 text-white text-xs font-bold py-2 px-4 text-center animate-in fade-in flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Added "{addedItemToast}" back to your Smart Cart!</span>
          </div>
        )}

        {/* Scrollable Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* TAB 1: BILLS & INVOICES */}
          {activeTab === 'bills' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Your Supermarket Tax Invoices</h3>
                  <p className="text-xs text-slate-500">
                    Official 100% English GST bills with turnstile exit gate QR codes
                  </p>
                </div>
              </div>

              {receipts.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-300">
                  <ReceiptIcon className="w-12 h-12 mx-auto text-slate-300 mb-2 stroke-1" />
                  <p className="font-extrabold text-slate-700 text-sm">No Bills Yet</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Scan items from shelves and pay with UPI to generate your first digital GST invoice!
                  </p>
                </div>
              ) : (
                receipts.map((r) => (
                  <div
                    key={r.orderId}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-red-400 bg-white transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs hover:shadow-md group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-sm group-hover:text-red-600 transition">
                          Invoice #{r.orderId}
                        </span>
                        <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> PAID IN FULL
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-700 mt-1">
                        {r.storeName}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{r.date}</span>
                        </span>
                        <span>•</span>
                        <span>{r.items.length} items purchased</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold">Saved ₹{r.savings}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:text-right shrink-0">
                      <div>
                        <div className="text-lg font-black font-mono text-slate-900">₹{r.total}</div>
                        <div className="text-[10px] text-slate-400 font-medium">WhatsApp: {r.mobileNumber}</div>
                      </div>

                      <button
                        onClick={() => {
                          onSelectReceipt(r);
                          onClose();
                        }}
                        className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-[#d71920] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>View Bill</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: PURCHASED ITEMS & TOOLS HISTORY */}
          {activeTab === 'purchased_items' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Purchased Items & Tools History</h3>
                  <p className="text-xs text-slate-500">
                    All groceries, daily staples & household tools you have ever bought
                  </p>
                </div>
              </div>

              {allPurchasedItems.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-300">
                  <Package className="w-12 h-12 mx-auto text-slate-300 mb-2 stroke-1" />
                  <p className="font-extrabold text-slate-700 text-sm">No Purchased Items Yet</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Once you complete a purchase, all your tools, groceries and items will be logged here for quick 1-tap reordering.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {allPurchasedItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition flex items-center gap-3 shadow-xs"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                          {item.product.brand} • {item.product.category}
                        </div>
                        <h4 className="font-black text-slate-900 text-xs truncate">
                          {item.product.name}
                        </h4>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="font-mono font-black text-slate-900 text-sm">
                            ₹{item.product.price}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Bought {item.totalQuantity}x ({item.lastPurchasedDate})
                          </span>
                        </div>
                        <button
                          onClick={() => handleBuyAgain(item.product)}
                          className="mt-2 w-full py-1.5 px-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-extrabold text-[11px] flex items-center justify-center gap-1 transition cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Buy Again (Add to Cart)</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Account Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Full Name</span>
                    <span className="font-bold text-slate-900 text-sm">{userProfile.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Registered Gmail ID</span>
                    <span className="font-bold text-slate-900 text-sm">{userProfile.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Mobile (WhatsApp E-Bills)</span>
                    <span className="font-bold text-slate-900 text-sm">+91 {userProfile.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Membership ID</span>
                    <span className="font-bold text-slate-900 text-sm font-mono">VJA-VIP-9842</span>
                  </div>
                </div>

                {onSwitchAccount && (
                  <div className="pt-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSwitchAccount();
                      }}
                      className="w-full py-2.5 px-3 bg-red-50 hover:bg-red-100 text-[#d71920] border border-red-200 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Switch Account / Sign in as Another Student or Teacher</span>
                    </button>
                    <p className="text-[10px] text-slate-500 text-center mt-1">
                      Sharing with a classmate or teacher? Tap to enter their Google ID, name, and mobile number.
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Actions: Switch Store / Switch Language */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    onClose();
                    onSwitchStore();
                  }}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-left transition cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-red-100 text-[#d71920] flex items-center justify-center">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Switch Vijayawada Store</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[170px]">
                        {currentStore.name}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onSwitchLanguage();
                  }}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-left transition cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Change App Language</div>
                      <div className="text-[11px] text-slate-500 uppercase font-bold">
                        Current: {currentLanguage}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            SCAN AND GO • Vijayawada Supermarket Edition
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Close Account
          </button>
        </div>
      </div>
    </div>
  );
};

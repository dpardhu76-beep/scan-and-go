/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Barcode,
  Scale,
  CheckSquare,
  ShoppingBag,
  Sparkles,
  Tag,
  Zap,
  Footprints,
} from 'lucide-react';

import {
  CartItem,
  LanguageCode,
  ProductItem,
  Receipt,
  ShoppingListItem,
  StoreLocation,
  UserProfile,
} from './types/store';

import {
  DEMO_COUPONS,
  INITIAL_SHOPPING_LIST,
  STORE_LOCATIONS,
  TRANSLATIONS,
  PRODUCT_CATALOG,
} from './utils/mockData';

import { sound } from './utils/audio';

import { IntroScreen } from './components/IntroScreen';
import { AccountSetupScreen } from './components/AccountSetupScreen';
import { LanguageScreen } from './components/LanguageScreen';
import { StoreScreen } from './components/StoreScreen';
import { Navbar } from './components/Navbar';
import { StoreAisleBrowser } from './components/StoreAisleBrowser';
import { ScannerModal } from './components/ScannerModal';
import { ProduceScaleModal } from './components/ProduceScaleModal';
import { ShoppingListModal } from './components/ShoppingListModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ReceiptModal } from './components/ReceiptModal';
import { PastReceiptsModal } from './components/PastReceiptsModal';
import { ProductUpiQrModal } from './components/ProductUpiQrModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AccountModal } from './components/AccountModal';
import { ExitGate } from './components/ExitGate';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Vijayawada Shopper',
  email: 'shopper.vja@gmail.com',
  phone: '9848012345',
  memberTier: 'Vijayawada VIP Shopper',
  walletBalance: 0,
  walletPoints: 350,
  createdAt: new Date().toISOString(),
};

const SEED_RECEIPTS: Receipt[] = [
  {
    orderId: 'VJA-948210',
    date: 'Yesterday, 6:45 PM',
    storeName: 'Vishal Mega Mart — Eluru Road',
    storeAddress: 'Opposite Old Bus Stand, Eluru Road, Governorpet',
    pincode: '520002',
    items: [
      {
        product: {
          id: 'stp-01',
          barcode: '890103003001',
          name: 'Sona Masoori Raw Rice (5 kg Bag)',
          brand: 'Sri Lalitha Super Fine',
          price: 330,
          originalPrice: 380,
          weightKg: 5.0,
          category: 'Staples & Groceries',
          aisle: 'Aisle 3A • Rice & Grains',
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
          unit: '5 kg Bag',
          rating: 4.8,
          reviewsCount: 1420,
          assured: true,
          description: 'Fluffy, slender grain Sona Masoori aged naturally from the Krishna-Godavari delta.',
        },
        quantity: 1,
        measuredWeightKg: 5.0,
        addedAt: new Date(Date.now() - 86400000),
      },
      {
        product: {
          id: 'ele-04',
          barcode: '890103007004',
          name: 'Duracell Chota Power AA Alkaline Batteries (Pack of 4)',
          brand: 'Duracell',
          price: 155,
          originalPrice: 180,
          weightKg: 0.12,
          category: 'Electronics & Home',
          aisle: 'Aisle 7A • Batteries & Hardware',
          image: 'https://images.unsplash.com/photo-1550524514-c5b5f25ff864?auto=format&fit=crop&w=600&q=80',
          unit: 'Pack of 4 AA Batteries',
          rating: 4.9,
          reviewsCount: 4500,
          assured: true,
          description: 'Reliable long-lasting power for remotes, wall clocks, smart locks, and computer mice.',
        },
        quantity: 1,
        measuredWeightKg: 0.12,
        addedAt: new Date(Date.now() - 86400000),
      },
    ],
    subtotal: 485,
    discount: 50,
    cgst: 10.8,
    sgst: 10.8,
    total: 457,
    savings: 95,
    paymentMethod: 'Google Pay (UPI / NFC)',
    mobileNumber: '+91 9848012345',
    upiRefNumber: 'UPI/329481029482/PAY',
    gatePassQr: 'TURNSTILE-VJA-948210-PASS',
    securityStatus: 'CLEAR',
    membershipTier: 'Vijayawada VIP Shopper',
    pointsEarned: 45,
  },
];

export default function App() {
  // Navigation Stages: intro -> account_setup -> language -> store -> shopping
  const [appStage, setAppStage] = useState<'intro' | 'account_setup' | 'language' | 'store' | 'shopping'>('intro');

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('scan_and_go_user_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_PROFILE;
  });

  // Preferences: DEFAULT IS PURE ENGLISH
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [selectedStore, setSelectedStore] = useState<StoreLocation>(STORE_LOCATIONS[0]);

  // Shopping State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>(INITIAL_SHOPPING_LIST);
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponDiscountRate, setCouponDiscountRate] = useState<number>(0);

  // Modals
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isScaleOpen, setIsScaleOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<Receipt | null>(null);
  const [pastReceipts, setPastReceipts] = useState<Receipt[]>(SEED_RECEIPTS);
  const [isPastReceiptsOpen, setIsPastReceiptsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isExitGateOpen, setIsExitGateOpen] = useState(false);
  const [upiQrProduct, setUpiQrProduct] = useState<ProductItem | null>(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState<ProductItem | null>(null);

  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];
  const isTelugu = language === 'te';

  // Add Product to Cart
  const handleAddProductToCart = (
    product: ProductItem,
    customWeight?: number,
    quantityToAdd: number = 1
  ) => {
    const weight = customWeight !== undefined ? customWeight : product.weightKg;
    const qty = quantityToAdd > 0 ? quantityToAdd : 1;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qty,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            product,
            quantity: qty,
            measuredWeightKg: weight,
            addedAt: new Date(),
          },
        ];
      }
    });

    // Automatically check off shopping list item if matched
    setShoppingList((prev) =>
      prev.map((item) => {
        if (!item.checked && product.name.toLowerCase().includes(item.name.toLowerCase())) {
          return { ...item, checked: true };
        }
        return item;
      })
    );
  };

  const handleUpdateQty = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Direct UPI product payment
  const handleDirectUpiPaid = (product: ProductItem) => {
    handleAddProductToCart(product);
    setUpiQrProduct(null);
    setIsCartOpen(true);
  };

  // Calculate Totals in Rupees (₹)
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const discount = Math.round(subtotal * couponDiscountRate);
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableAmount * 0.05); // 5% GST
  const total = taxableAmount + tax;
  const totalCartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  // Apply Coupon
  const handleApplyCoupon = (code: string): boolean => {
    const match = DEMO_COUPONS[code];
    if (match) {
      setCouponCode(code);
      setCouponDiscountRate(match.rate);
      sound.playScanBeep();
      return true;
    }
    return false;
  };

  // On successful payment
  const handlePaymentSuccess = (newReceipt: Receipt) => {
    setPastReceipts((prev) => [newReceipt, ...prev]);
    setActiveReceipt(newReceipt);
    setCartItems([]);
    setCouponCode('');
    setCouponDiscountRate(0);
    setIsCheckoutOpen(false);
  };

  // Shopping List helpers
  const handleToggleListItem = (id: string) => {
    setShoppingList((prev) =>
      prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i))
    );
  };

  const handleAddListItem = (name: string) => {
    setShoppingList((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        name,
        checked: false,
      },
    ]);
  };

  const handleDeleteListItem = (id: string) => {
    setShoppingList((prev) => prev.filter((i) => i.id !== id));
  };

  const completedListCount = shoppingList.filter((i) => i.checked).length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-[#d71920] selection:text-white">
      {/* 1. Cinematic Clean Intro Screen with Hook & Feature Details */}
      {appStage === 'intro' && (
        <IntroScreen onComplete={() => setAppStage('account_setup')} />
      )}

      {/* 2. Account Creation Screen (Gmail ID, Full Name, Mobile) */}
      {appStage === 'account_setup' && (
        <AccountSetupScreen
          currentProfile={userProfile}
          onAccountCreated={(profile) => {
            setUserProfile(profile);
            setAppStage('language');
          }}
        />
      )}

      {/* 3. Indian Languages Selection Screen */}
      {appStage === 'language' && (
        <LanguageScreen
          currentLanguage={language}
          onSelectLanguage={(lang) => setLanguage(lang)}
          onNext={() => setAppStage('store')}
        />
      )}

      {/* 4. Vijayawada Supermarket Branches Screen */}
      {appStage === 'store' && (
        <StoreScreen
          currentStore={selectedStore}
          currentLanguage={language}
          onSelectStore={(store) => setSelectedStore(store)}
          onBack={() => setAppStage('language')}
          onNext={() => setAppStage('shopping')}
        />
      )}

      {/* 5. Flipkart & Amazon Style Supermarket Workspace */}
      {appStage === 'shopping' && (
        <>
          <Navbar
            currentStore={selectedStore}
            currentLanguage={language}
            cartCount={totalCartCount}
            cartTotal={total}
            userProfile={userProfile}
            onOpenStoreModal={() => setAppStage('store')}
            onOpenLangModal={() => setAppStage('language')}
            onOpenScanner={() => setIsScannerOpen(true)}
            onOpenScale={() => setIsScaleOpen(true)}
            onOpenList={() => setIsListOpen(true)}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenReceipts={() => setIsPastReceiptsOpen(true)}
            onOpenAccount={() => setIsAccountOpen(true)}
            completedListCount={completedListCount}
            totalListCount={shoppingList.length}
          />

          {/* Promotion / Store Notice Bar */}
          <div className="bg-gradient-to-r from-red-600 via-orange-600 to-red-700 text-white text-xs py-2 px-3 sm:px-6 shadow-xs">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
                <Tag className="w-3.5 h-3.5 shrink-0" />
                <span className="font-bold">{selectedStore.name}:</span>
                <span className="opacity-95">{selectedStore.dealHighlight}</span>
              </div>
              <div className="hidden md:flex items-center gap-2 font-mono text-[11px] shrink-0 bg-white/20 px-2.5 py-0.5 rounded-full">
                <Zap className="w-3 h-3 text-yellow-300" />
                <span>Use coupon: "VIJAYAWADA10" or "SMART20"</span>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-5 pb-28 md:pb-12">
            {/* Amazon / Flipkart Style Hero Banner */}
            <div className="mb-6 p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-white via-red-50/30 to-orange-50/40 border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-black text-red-600 uppercase tracking-wider bg-red-100/70 px-2.5 py-0.5 rounded-md">
                  <Sparkles className="w-3 h-3 text-red-600" />
                  <span>
                    {isTelugu ? 'క్యూలో వేచి ఉండాల్సిన పనిలేదు' : 'Zero Checkout Queue Experience'}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {isTelugu
                    ? 'వస్తువుల బార్‌కోడ్ స్కాన్ చేయండి • PhonePe / GPay తో చెల్లించండి'
                    : 'Scan Barcodes from Shelves • Pay with PhonePe / GPay UPI'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                  {isTelugu
                    ? `${selectedStore.name} (${selectedStore.area}, విజయవాడ). షెల్ఫ్ నుండి వస్తువులను కార్ట్‌లో వేసుకోండి. డిజిటల్ బిల్లు నేరుగా మీ మొబైల్ వాట్సాప్‌కు వస్తుంది.`
                    : `${selectedStore.name} (${selectedStore.area}, Vijayawada). Bag items directly from shelves. Your digital GST bill will be delivered to your WhatsApp.`}
                </p>
              </div>

              {/* Action Buttons Hub */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
                <button
                  onClick={() => setIsScannerOpen(true)}
                  className="flex-1 sm:flex-none px-6 py-3.5 bg-[#d71920] hover:bg-[#b0141a] active:scale-95 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Barcode className="w-5 h-5" />
                  <span>{t.scanBarcode}</span>
                </button>

                <button
                  onClick={() => setIsScaleOpen(true)}
                  className="flex-1 sm:flex-none px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Scale className="w-5 h-5" />
                  <span>{t.weighProduce}</span>
                </button>

                <button
                  onClick={() => setIsExitGateOpen(true)}
                  className="flex-1 sm:flex-none px-5 py-3.5 bg-slate-900 hover:bg-black active:scale-95 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-slate-900/25 flex items-center justify-center gap-2 transition cursor-pointer border border-slate-700"
                  title="Simulate Turnstile Exit Gate"
                >
                  <Footprints className="w-5 h-5 text-emerald-400" />
                  <span>Exit Gate Pass</span>
                </button>
              </div>
            </div>

            {/* Aisle Shelf Catalog Component with Touch Detail & Infinity Inventory */}
            <StoreAisleBrowser
              onScanItem={(product) => handleAddProductToCart(product)}
              onOpenScale={() => setIsScaleOpen(true)}
              onOpenUpiQr={(product) => setUpiQrProduct(product)}
              onOpenProductDetail={(product) => setSelectedProductDetail(product)}
              language={language}
            />
          </main>

          {/* Sticky Mobile Bottom Navigation */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-2 px-3 flex items-center justify-between shadow-2xl">
            <button
              onClick={() => setIsScannerOpen(true)}
              className="flex-1 py-3 bg-[#d71920] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-red-600/25 active:scale-95 transition cursor-pointer mr-2"
            >
              <Barcode className="w-4 h-4" />
              <span>{isTelugu ? 'స్కాన్ చేయండి' : 'Scan'}</span>
            </button>

            <button
              onClick={() => setIsScaleOpen(true)}
              className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-xl flex items-center justify-center transition cursor-pointer mr-2"
              title="Weigh Produce"
            >
              <Scale className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsExitGateOpen(true)}
              className="p-3 bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center justify-center transition cursor-pointer mr-2 border border-slate-700"
              title="Exit Gate Simulator"
            >
              <Footprints className="w-4 h-4 text-emerald-400" />
            </button>

            <button
              onClick={() => setIsAccountOpen(true)}
              className="p-3 bg-red-50 text-[#d71920] border border-red-200 font-bold text-xs rounded-xl flex items-center justify-center transition cursor-pointer mr-2"
              title="My Account"
            >
              <span className="w-4 h-4 flex items-center justify-center font-black text-xs">
                {userProfile.name ? userProfile.name.charAt(0) : 'P'}
              </span>
            </button>

            <button
              onClick={() => setIsListOpen(true)}
              className="p-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center transition cursor-pointer mr-2"
              title="Shopping List"
            >
              <CheckSquare className="w-4 h-4 text-indigo-600" />
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-3 bg-slate-900 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#d71920] text-white text-[9px] font-black flex items-center justify-center">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <span className="font-mono">₹{total}</span>
            </button>
          </div>

          {/* Modals and Drawers */}
          <ScannerModal
            isOpen={isScannerOpen}
            onClose={() => setIsScannerOpen(false)}
            onScanProduct={(prod) => handleAddProductToCart(prod)}
            language={language}
          />

          <ProduceScaleModal
            isOpen={isScaleOpen}
            onClose={() => setIsScaleOpen(false)}
            onAddWeighedItem={(prod, w) => handleAddProductToCart(prod, w)}
            language={language}
          />

          <ShoppingListModal
            isOpen={isListOpen}
            onClose={() => setIsListOpen(false)}
            items={shoppingList}
            onToggleItem={handleToggleListItem}
            onAddItem={handleAddListItem}
            onDeleteItem={handleDeleteListItem}
            language={language}
          />

          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            items={cartItems}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onOpenCheckout={() => setIsCheckoutOpen(true)}
            subtotal={subtotal}
            discount={discount}
            tax={tax}
            total={total}
            language={language}
          />

          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            cartItems={cartItems}
            store={selectedStore}
            subtotal={subtotal}
            discount={discount}
            tax={tax}
            total={total}
            couponCode={couponCode}
            onApplyCoupon={handleApplyCoupon}
            onPaymentSuccess={handlePaymentSuccess}
            language={language}
            userPhone={userProfile.phone}
          />

          {/* 100% English GST Tax Invoice Receipt */}
          {activeReceipt && (
            <ReceiptModal
              receipt={activeReceipt}
              onClose={() => setActiveReceipt(null)}
              onOpenExitGate={() => setIsExitGateOpen(true)}
            />
          )}

          {/* Turnstile Exit Gate Simulator */}
          <ExitGate
            isOpen={isExitGateOpen}
            onClose={() => setIsExitGateOpen(false)}
            receipt={activeReceipt || (pastReceipts.length > 0 ? pastReceipts[0] : null)}
            storeName={selectedStore.name}
            onFinishShopping={() => {
              setIsExitGateOpen(false);
              setActiveReceipt(null);
            }}
          />

          <PastReceiptsModal
            isOpen={isPastReceiptsOpen}
            onClose={() => setIsPastReceiptsOpen(false)}
            receipts={pastReceipts}
            onSelectReceipt={(r) => setActiveReceipt(r)}
            language={language}
          />

          {/* Corner Account Modal: Check Bills & Purchased Tools/Items */}
          <AccountModal
            isOpen={isAccountOpen}
            onClose={() => setIsAccountOpen(false)}
            userProfile={userProfile}
            receipts={pastReceipts}
            onSelectReceipt={(r) => setActiveReceipt(r)}
            onAddProductAgain={(prod) => handleAddProductToCart(prod)}
            onSwitchStore={() => setAppStage('store')}
            onSwitchLanguage={() => setAppStage('language')}
            onSwitchAccount={() => {
              setIsAccountOpen(false);
              setAppStage('account_setup');
            }}
            currentStore={selectedStore}
            currentLanguage={language}
          />

          {/* Product Detail Modal: Opened when touching any product */}
          <ProductDetailModal
            product={selectedProductDetail}
            onClose={() => setSelectedProductDetail(null)}
            onAddToCart={(product, qty) => handleAddProductToCart(product, undefined, qty)}
            onOpenScale={(product) => setIsScaleOpen(true)}
            onOpenUpiQr={(product) => setUpiQrProduct(product)}
            language={language}
            storeName={selectedStore.name}
          />

          <ProductUpiQrModal
            product={upiQrProduct}
            onClose={() => setUpiQrProduct(null)}
            onDirectPaid={handleDirectUpiPaid}
          />
        </>
      )}
    </div>
  );
}

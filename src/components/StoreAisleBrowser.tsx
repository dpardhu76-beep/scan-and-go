import React, { useState, useMemo } from 'react';
import {
  Search,
  Barcode,
  Scale,
  Check,
  Star,
  ShieldCheck,
  QrCode,
  Zap,
  Eye,
  Sparkles,
  Infinity as InfinityIcon,
  Plus,
} from 'lucide-react';
import { ProductItem, LanguageCode } from '../types/store';
import { PRODUCT_CATALOG, TRANSLATIONS } from '../utils/mockData';
import { EXPANDED_PRODUCTS, generateInfiniteAisleItems } from '../utils/expandedCatalog';
import { sound } from '../utils/audio';

interface StoreAisleBrowserProps {
  onScanItem: (item: ProductItem) => void;
  onOpenScale: () => void;
  onOpenUpiQr: (item: ProductItem) => void;
  onOpenProductDetail: (item: ProductItem) => void;
  language: LanguageCode;
}

const CATEGORIES = [
  'All',
  'Staples & Groceries',
  'Bakery & Snacks',
  'Dairy & Sweets',
  'Fruits & Vegetables',
  'Beverages',
  'Stationery',
  'Electronics & Home',
] as const;

export const StoreAisleBrowser: React.FC<StoreAisleBrowserProps> = ({
  onScanItem,
  onOpenScale,
  onOpenUpiQr,
  onOpenProductDetail,
  language,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [extraInfiniteItems, setExtraInfiniteItems] = useState<ProductItem[]>([]);
  const [infiniteLoadCount, setInfiniteLoadCount] = useState<number>(0);

  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];
  const isTelugu = language === 'te';

  // Base catalog merged from mockData + expandedCatalog
  const baseCombinedCatalog = useMemo(() => {
    const seen = new Set<string>();
    const list: ProductItem[] = [];

    [...PRODUCT_CATALOG, ...EXPANDED_PRODUCTS].forEach((item) => {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        list.push(item);
      }
    });

    return list;
  }, []);

  // Total current catalog including any dynamically added infinite items
  const allCurrentItems = useMemo(() => {
    const seen = new Set<string>();
    const list: ProductItem[] = [];

    [...baseCombinedCatalog, ...extraInfiniteItems].forEach((item) => {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        list.push(item);
      }
    });

    return list;
  }, [baseCombinedCatalog, extraInfiniteItems]);

  const filteredItems = useMemo(() => {
    return allCurrentItems.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesName = item.name.toLowerCase().includes(q);
      const matchesTelugu = item.teluguName ? item.teluguName.includes(q) : false;
      const matchesBarcode = item.barcode.includes(q);
      const matchesBrand = item.brand.toLowerCase().includes(q);
      const matchesCategoryName = item.category.toLowerCase().includes(q);

      return (
        matchesCategory &&
        (matchesName || matchesTelugu || matchesBarcode || matchesBrand || matchesCategoryName)
      );
    });
  }, [allCurrentItems, selectedCategory, searchQuery]);

  const handleScanAction = (item: ProductItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (item.isWeighable) {
      onOpenScale();
    } else {
      sound.playScanBeep();
      onScanItem(item);
      setAddedIds((prev) => ({ ...prev, [item.id]: true }));
      setTimeout(() => {
        setAddedIds((prev) => ({ ...prev, [item.id]: false }));
      }, 1500);
    }
  };

  const handleLoadMoreInfinite = () => {
    sound.playScanBeep();
    const catToGenerate = selectedCategory === 'All' ? 'Staples & Groceries' : selectedCategory;
    const newItems = generateInfiniteAisleItems(catToGenerate, infiniteLoadCount * 12 + 1, 12);
    setExtraInfiniteItems((prev) => [...prev, ...newItems]);
    setInfiniteLoadCount((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Deals & Infinity Catalog Ribbon */}
      <div className="p-3 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white rounded-2xl flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-black">
          <Zap className="w-4 h-4 text-yellow-200 fill-current animate-bounce" />
          <span>
            {isTelugu
              ? 'విజయవాడ సూపర్ మార్కెట్ ఫెస్టివల్: నిత్యావసరాలు మరియు బేకరీపై 40% వరకు తగ్గింపు • అపరిమిత ఉత్పత్తులు'
              : 'SUPERMARKET FESTIVAL: UP TO 40% OFF ON GROCERIES, BAKERY & STAPLES • INFINITE SHELF INVENTORY'}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          <InfinityIcon className="w-3.5 h-3.5" />
          <span>{allCurrentItems.length} Products</span>
        </div>
      </div>

      {/* Category Pills & Search Bar (Amazon / Flipkart layout) */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Horizontal Category Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count =
              cat === 'All'
                ? allCurrentItems.length
                : allCurrentItems.filter((i) => i.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#d71920] text-white shadow-md shadow-red-500/30'
                    : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input field */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isTelugu
                ? 'వస్తువు పేరు, బ్రాండ్ లేదా బార్‌కోడ్ శోధించండి...'
                : 'Search products, staples, bakery or barcode...'
            }
            className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Catalog items count status */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-900">{filteredItems.length}</strong> items in{' '}
          <strong className="text-slate-900">{selectedCategory}</strong>
        </span>
        <span className="text-[11px] text-red-600 font-bold flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>Tap any product card to view details</span>
        </span>
      </div>

      {/* Product Grid - Flipkart / Amazon Card Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map((item) => {
          const isJustAdded = addedIds[item.id];
          const discountPercent = item.originalPrice
            ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
            : 0;

          return (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => onOpenProductDetail(item)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpenProductDetail(item);
                }
              }}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-200 p-3.5 flex flex-col justify-between group hover:border-red-400 relative cursor-pointer active:scale-98"
            >
              <div>
                {/* Photo & Badges - Click to Open Product */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenProductDetail(item);
                  }}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 mb-3 cursor-pointer"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Assured Badge */}
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-blue-600/95 backdrop-blur-xs text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm">
                    <ShieldCheck className="w-3 h-3 text-amber-300" />
                    <span>SMART ASSURED</span>
                  </div>

                  {/* Discount percentage tag */}
                  {discountPercent > 0 && (
                    <span className="absolute top-2 right-2 text-[11px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded shadow-sm">
                      {discountPercent}% OFF
                    </span>
                  )}

                  {/* Dedicated Tap to View Chip */}
                  <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm group-hover:bg-[#d71920] transition-colors">
                    <Eye className="w-3 h-3 text-white" />
                    <span>View Details</span>
                  </div>
                </div>

                {/* Star Rating & Reviews */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-emerald-700 text-white px-1.5 py-0.5 rounded">
                    <span>{item.rating}</span>
                    <Star className="w-3 h-3 fill-current" />
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    ({item.reviewsCount} reviews)
                  </span>
                </div>

                {/* Product Title - Clickable */}
                <h3
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenProductDetail(item);
                  }}
                  className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-red-600 transition-colors cursor-pointer"
                >
                  {item.name}
                </h3>
                {isTelugu && item.teluguName && (
                  <p className="text-xs text-amber-800 font-bold mt-0.5">
                    {item.teluguName}
                  </p>
                )}

                {/* Brand & Quantity Unit */}
                <div className="text-xs text-slate-500 mt-1 mb-1">
                  <span className="font-semibold text-slate-700">{item.brand}</span> • {item.unit}
                </div>

                {/* Price Display in Indian Rupees (₹) */}
                <div className="flex items-baseline gap-2 mt-1">
                  <div className="text-xl sm:text-2xl font-black font-mono text-slate-900">
                    ₹{item.price}
                  </div>
                  {item.originalPrice && (
                    <div className="text-xs line-through text-slate-400 font-mono">
                      ₹{item.originalPrice}
                    </div>
                  )}
                  {discountPercent > 0 && (
                    <span className="text-xs font-bold text-emerald-600">
                      Save ₹{item.originalPrice! - item.price}
                    </span>
                  )}
                </div>

                {/* Shelf Barcode Display Box */}
                <div className="mt-3 p-2 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
                    <span className="font-bold text-slate-700">BARCODE:</span>
                    <span className="font-black text-slate-900 text-xs tracking-wider">{item.barcode}</span>
                  </div>
                  <div className="h-5 w-full bg-[repeating-linear-gradient(90deg,#111,#111_3px,transparent_3px,transparent_6px,#111_6px,#111_8px,transparent_8px,transparent_11px)] opacity-90 mx-auto rounded-xs" />
                </div>
              </div>

              {/* Action Buttons: View Details + Big Scan + Instant UPI */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                {/* Dedicated View Details Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenProductDetail(item);
                  }}
                  className="w-full py-2 px-3 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-600" />
                  <span>View Product Details</span>
                </button>

                {/* Scan / Add Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleScanAction(item, e);
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-98 ${
                    isJustAdded
                      ? 'bg-emerald-600 text-white'
                      : item.isWeighable
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25'
                      : 'bg-[#d71920] hover:bg-[#b0141a] text-white shadow-red-600/25'
                  }`}
                >
                  {isJustAdded ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>{isTelugu ? 'స్కాన్ పూర్తయింది ✓' : 'Item Scanned ✓'}</span>
                    </>
                  ) : item.isWeighable ? (
                    <>
                      <Scale className="w-4 h-4" />
                      <span>{isTelugu ? 'డిజిటల్ కాటా తూకం' : 'Weigh on Scale'}</span>
                    </>
                  ) : (
                    <>
                      <Barcode className="w-4 h-4" />
                      <span>{t.scanBarcode}</span>
                    </>
                  )}
                </button>

                {/* Instant Product UPI QR Pay button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenUpiQr(item);
                  }}
                  className="w-full py-1.5 px-3 rounded-xl font-bold text-xs bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 text-purple-700" />
                  <span>
                    {isTelugu
                      ? `UPI తో కొనండి (₹${item.price})`
                      : `UPI Pay (₹${item.price})`}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Infinite Products Load More Button */}
      <div className="pt-6 pb-4 text-center">
        <button
          onClick={handleLoadMoreInfinite}
          className="px-8 py-3.5 bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 hover:from-slate-800 hover:to-red-900 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl border border-slate-700 flex items-center justify-center gap-2 mx-auto transition cursor-pointer active:scale-95"
        >
          <InfinityIcon className="w-4 h-4 text-red-400" />
          <span>LOAD MORE INFINITE PRODUCTS (+12)</span>
          <Plus className="w-4 h-4 text-yellow-400" />
        </button>
        <p className="text-[11px] text-slate-400 mt-2">
          Endless Vijayawada supermarket inventory available on demand
        </p>
      </div>
    </div>
  );
};

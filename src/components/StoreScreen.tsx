import React, { useState, useMemo } from 'react';
import { MapPin, Navigation, Tag, ShoppingCart, ArrowLeft, ArrowRight, Check, Search } from 'lucide-react';
import { LanguageCode, StoreLocation } from '../types/store';
import { STORE_LOCATIONS, TRANSLATIONS } from '../utils/mockData';

interface StoreScreenProps {
  currentStore: StoreLocation;
  currentLanguage: LanguageCode;
  onSelectStore: (store: StoreLocation) => void;
  onBack: () => void;
  onNext: () => void;
}

export const StoreScreen: React.FC<StoreScreenProps> = ({
  currentStore,
  currentLanguage,
  onSelectStore,
  onBack,
  onNext,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChainFilter, setSelectedChainFilter] = useState<string>('all');

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];
  const isTelugu = currentLanguage === 'te';

  const filteredStores = useMemo(() => {
    return STORE_LOCATIONS.filter((store) => {
      const matchesSearch =
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.pincode.includes(searchQuery);

      const matchesChain =
        selectedChainFilter === 'all' ||
        store.chain.toLowerCase().includes(selectedChainFilter.toLowerCase());

      return matchesSearch && matchesChain;
    });
  }, [searchQuery, selectedChainFilter]);

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-6 bg-slate-100">
      <div className="w-full max-w-[880px] bg-white rounded-3xl p-5 sm:p-8 shadow-xl border border-slate-200 animate-in fade-in duration-300 flex flex-col max-h-[92vh]">
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isTelugu ? 'వెనుకకు' : 'Back to Language'}</span>
          </button>
          <div className="text-[11px] font-extrabold text-red-600 uppercase tracking-wider bg-red-50 px-3 py-1 rounded-full border border-red-200">
            {STORE_LOCATIONS.length} Stores in Vijayawada Area
          </div>
        </div>

        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">
            {t.selectStore}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            {t.selectStoreDesc}
          </p>
        </div>

        {/* Search Bar & Quick Filters */}
        <div className="space-y-2.5 mb-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search area or store (e.g. Gollapudi, Benz Circle, MG Road, Kanuru, Enikepadu)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-red-500 focus:bg-white transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-bold">
            <button
              onClick={() => setSelectedChainFilter('all')}
              className={`px-3 py-1 rounded-full transition cursor-pointer shrink-0 ${
                selectedChainFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Stores ({STORE_LOCATIONS.length})
            </button>
            <button
              onClick={() => setSelectedChainFilter('dmart')}
              className={`px-3 py-1 rounded-full transition cursor-pointer shrink-0 ${
                selectedChainFilter === 'dmart'
                  ? 'bg-[#d71920] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              DMart (3)
            </button>
            <button
              onClick={() => setSelectedChainFilter('reliance')}
              className={`px-3 py-1 rounded-full transition cursor-pointer shrink-0 ${
                selectedChainFilter === 'reliance'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Reliance Smart (3)
            </button>
            <button
              onClick={() => setSelectedChainFilter('more')}
              className={`px-3 py-1 rounded-full transition cursor-pointer shrink-0 ${
                selectedChainFilter === 'more'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              More (2)
            </button>
            <button
              onClick={() => setSelectedChainFilter('vishal')}
              className={`px-3 py-1 rounded-full transition cursor-pointer shrink-0 ${
                selectedChainFilter === 'vishal'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Vishal Mega Mart (2)
            </button>
            <button
              onClick={() => setSelectedChainFilter('spencers')}
              className={`px-3 py-1 rounded-full transition cursor-pointer shrink-0 ${
                selectedChainFilter === 'spencers'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Spencer's (2)
            </button>
          </div>
        </div>

        {/* Vijayawada Stores Scrollable Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          {filteredStores.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No store matching "{searchQuery}". Try searching "Benz Circle", "Gollapudi", or "Kanuru".
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredStores.map((store) => {
                const isSelected = currentStore.id === store.id;
                return (
                  <button
                    key={store.id}
                    onClick={() => onSelectStore(store)}
                    className={`text-left p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer relative ${
                      isSelected
                        ? 'border-[#d71920] bg-red-50/50 shadow-md shadow-red-100 scale-[1.01]'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    {/* Store Chain Badge */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900 text-white">
                        {store.chain}
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#d71920] text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-start gap-2 mb-1">
                      <MapPin className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-[#d71920]' : 'text-slate-500'}`} />
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-snug">
                          {store.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {store.address}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {store.area}, PIN: {store.pincode}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-6 text-xs font-semibold text-emerald-700 my-1.5">
                      <Navigation className="w-3.5 h-3.5" />
                      <span>{store.distance}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500 font-normal">{store.openHours}</span>
                    </div>

                    <div className="bg-amber-50/80 rounded-xl p-2 text-xs text-amber-900 border border-amber-200/80 flex items-start gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-1 font-semibold">{store.dealHighlight}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Store Confirmation Footer */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-left text-xs text-slate-600">
            {isTelugu ? 'ఎంచుకున్న స్టోర్:' : 'Selected Store:'}{' '}
            <span className="font-extrabold text-slate-900">{currentStore.name}</span>
            <div className="text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{currentStore.cartCapacity}</span>
            </div>
          </div>

          <button
            onClick={onNext}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#d71920] hover:bg-[#b0141a] text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-600/30 active:scale-95 transition-all cursor-pointer"
          >
            <span>{isTelugu ? 'స్టోర్‌లోకి ప్రవేశించండి' : 'ENTER STORE'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Scale, Plus, Minus, Check } from 'lucide-react';
import { ProductItem, LanguageCode } from '../types/store';
import { PRODUCT_CATALOG, TRANSLATIONS } from '../utils/mockData';
import { sound } from '../utils/audio';

interface ProduceScaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWeighedItem: (product: ProductItem, weightKg: number) => void;
  language: LanguageCode;
}

export const ProduceScaleModal: React.FC<ProduceScaleModalProps> = ({
  isOpen,
  onClose,
  onAddWeighedItem,
  language,
}) => {
  const weighableItems = PRODUCT_CATALOG.filter((item) => item.isWeighable);

  const [selectedItem, setSelectedItem] = useState<ProductItem>(weighableItems[0] || PRODUCT_CATALOG[0]);
  const [currentWeightKg, setCurrentWeightKg] = useState<number>(1.25);
  const [scaleStable, setScaleStable] = useState<boolean>(true);

  if (!isOpen) return null;

  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];
  const isTelugu = language === 'te';
  const ratePerKg = selectedItem.pricePerKg || 40;
  const calculatedPrice = Math.round(currentWeightKg * ratePerKg);

  const handleAdjustWeight = (delta: number) => {
    setScaleStable(false);
    setCurrentWeightKg((prev) => {
      const next = Math.max(0.2, Math.min(10.0, +(prev + delta).toFixed(2)));
      return next;
    });
    setTimeout(() => {
      setScaleStable(true);
    }, 200);
  };

  const handleAddToBasket = () => {
    sound.playScaleBeep();
    const customItem: ProductItem = {
      ...selectedItem,
      price: calculatedPrice,
      weightKg: currentWeightKg,
      unit: `${currentWeightKg.toFixed(2)} kg @ ₹${ratePerKg}/kg`,
    };
    onAddWeighedItem(customItem, currentWeightKg);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-emerald-800 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shadow-md">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold leading-tight">{t.weighProduce}</h2>
              <p className="text-xs text-emerald-200">
                {isTelugu ? 'సర్టిఫైడ్ ఎలక్ట్రానిక్ కాటా తూకం' : 'Certified Electronic Scale & PLU Station'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Step 1: Select Item */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2.5">
              {isTelugu ? '1. తాజా కూరగాయలు లేదా పండ్లను ఎంచుకోండి:' : '1. Select Fresh Produce Item / PLU:'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {weighableItems.map((item) => {
                const isSelected = selectedItem.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedItem(item);
                      setScaleStable(false);
                      setTimeout(() => setScaleStable(true), 250);
                    }}
                    className={`p-2.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-sm scale-[1.02]'
                        : 'border-slate-200 hover:border-emerald-400 bg-slate-50'
                    }`}
                  >
                    <div className="aspect-square rounded-xl overflow-hidden bg-white mb-2 border border-slate-200">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 line-clamp-1">{item.name}</div>
                      {isTelugu && item.teluguName && (
                        <div className="text-[10px] text-emerald-800 font-semibold">{item.teluguName}</div>
                      )}
                      <div className="text-xs font-black text-emerald-700 font-mono mt-0.5">
                        ₹{item.pricePerKg}/kg
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Digital Scale Display */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2.5">
              {isTelugu ? '2. డిజిటల్ కాటా డిస్ప్లే & తూకం:' : '2. Digital Scale Platter & Weight Sensor:'}
            </label>
            <div className="p-4 rounded-2xl bg-slate-900 text-white border-2 border-slate-800 shadow-inner">
              <div className="flex items-center justify-between mb-3 text-xs text-slate-400 border-b border-slate-800 pb-2">
                <span className="flex items-center gap-1.5 font-mono">
                  <span className={`w-2 h-2 rounded-full ${scaleStable ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'}`} />
                  {scaleStable
                    ? isTelugu
                      ? 'SCALE STABLE • కచ్చితమైన తూకం'
                      : 'SCALE STABLE • ZERO TARE'
                    : 'CALIBRATING SENSOR...'}
                </span>
                <span className="font-mono text-slate-500">ACCURACY ±2g</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center my-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {isTelugu ? 'బరువు (WEIGHT)' : 'WEIGHT (KG)'}
                  </div>
                  <div className="text-3xl font-black font-mono text-emerald-400 mt-1">
                    {currentWeightKg.toFixed(2)} <span className="text-sm font-normal text-emerald-600">kg</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {isTelugu ? 'ధర (TOTAL PRICE)' : 'TOTAL PRICE'}
                  </div>
                  <div className="text-3xl font-black font-mono text-yellow-400 mt-1">
                    ₹{calculatedPrice}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">@ ₹{ratePerKg} / kg</div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-800">
                <span className="text-xs text-slate-400 mr-1">
                  {isTelugu ? 'బరువు సర్దుబాటు:' : 'Adjust Weight:'}
                </span>
                <button
                  onClick={() => handleAdjustWeight(-0.25)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition cursor-pointer flex items-center gap-1"
                >
                  <Minus className="w-3.5 h-3.5" /> 0.25 kg
                </button>
                <button
                  onClick={() => handleAdjustWeight(0.25)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> 0.25 kg
                </button>
                <button
                  onClick={() => handleAdjustWeight(0.5)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> 0.5 kg
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            {isTelugu ? 'రద్దు చేయి' : 'Cancel'}
          </button>
          <button
            onClick={handleAddToBasket}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/25 transition cursor-pointer flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>
              {isTelugu ? `కార్ట్‌లో చేర్చండి (₹${calculatedPrice})` : `Add to Cart (₹${calculatedPrice})`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Globe, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { LanguageCode } from '../types/store';
import { TRANSLATIONS } from '../utils/mockData';

interface LanguageScreenProps {
  currentLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  onNext: () => void;
}

const INDIAN_LANGUAGES: {
  code: LanguageCode;
  name: string;
  nativeName: string;
  region: string;
  badge?: string;
}[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English (India)',
    region: 'All India & Digital Pay',
    badge: 'Default',
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    region: 'Andhra Pradesh & Vijayawada',
    badge: 'Regional',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    region: 'National',
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    region: 'Tamil Nadu',
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    region: 'Kerala',
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    region: 'Karnataka',
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    region: 'West Bengal',
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    region: 'Maharashtra',
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    region: 'Gujarat',
  },
];

export const LanguageScreen: React.FC<LanguageScreenProps> = ({
  currentLanguage,
  onSelectLanguage,
  onNext,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-6 bg-slate-100">
      <div className="w-full max-w-[760px] bg-white rounded-3xl p-5 sm:p-9 shadow-xl border border-slate-200 text-center animate-in fade-in duration-300">
        {/* Brand Logo */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#d71920] text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-red-500/25">
          <ShoppingBag className="w-8 h-8" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-4 mb-1 tracking-tight">
          {t.selectLanguage}
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto">
          {t.selectLanguageDesc}
        </p>

        {/* Indian Languages Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
          {INDIAN_LANGUAGES.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => onSelectLanguage(lang.code)}
                className={`group relative p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-[#d71920] bg-red-50/60 shadow-md shadow-red-100 scale-[1.02]'
                    : 'border-slate-200 hover:border-red-300 bg-white hover:bg-slate-50/70'
                }`}
              >
                {lang.badge && (
                  <span className="absolute top-2.5 right-2 text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {lang.badge}
                  </span>
                )}

                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-slate-900 text-lg sm:text-xl group-hover:text-[#d71920] transition-colors">
                    {lang.nativeName}
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#d71920] text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                <div className="text-xs font-semibold text-slate-700">{lang.name}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{lang.region}</div>
              </button>
            );
          })}
        </div>

        {/* Continue Button (English, changes dynamically if Telugu is selected) */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Globe className="w-4 h-4 text-emerald-600" />
            <span>All Indian Regional Languages Supported</span>
          </div>

          <button
            onClick={onNext}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#d71920] hover:bg-[#b0141a] text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-600/30 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{currentLanguage === 'te' ? 'ముందుకు సాగండి' : 'CONTINUE'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

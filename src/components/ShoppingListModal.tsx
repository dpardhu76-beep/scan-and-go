import React, { useState } from 'react';
import { X, CheckSquare, Square, Plus, Trash2, CheckCircle2, ShoppingBag } from 'lucide-react';
import { ShoppingListItem, LanguageCode } from '../types/store';
import { TRANSLATIONS } from '../utils/mockData';

interface ShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ShoppingListItem[];
  onToggleItem: (id: string) => void;
  onAddItem: (name: string) => void;
  onDeleteItem: (id: string) => void;
  language: LanguageCode;
}

export const ShoppingListModal: React.FC<ShoppingListModalProps> = ({
  isOpen,
  onClose,
  items,
  onToggleItem,
  onAddItem,
  onDeleteItem,
  language,
}) => {
  const [newItemName, setNewItemName] = useState('');

  if (!isOpen) return null;

  const t = TRANSLATIONS[language];
  const completedCount = items.filter((i) => i.checked).length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim()) {
      onAddItem(newItemName.trim());
      setNewItemName('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold leading-tight">{t.shoppingList}</h2>
              <p className="text-xs text-slate-400">
                {completedCount} of {items.length} items scanned into cart ({progressPercent}%)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5">
          <div
            className="bg-emerald-500 h-1.5 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Add item input */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Add item to your list (e.g. Eggs, Coffee, Pasta)..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-600 outline-hidden"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </form>

          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] font-semibold text-slate-400">Quick Add:</span>
            {['Almond Milk', 'Yogurt', 'Avocados', 'Chocolate', 'Pasta'].map((quick) => (
              <button
                key={quick}
                onClick={() => onAddItem(quick)}
                className="text-[11px] bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200 transition cursor-pointer"
              >
                + {quick}
              </button>
            ))}
          </div>

          {/* List items */}
          <div className="space-y-2 pt-2">
            {items.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  item.checked
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => onToggleItem(item.id)}
                  className="flex items-center gap-3 text-left flex-1 min-w-0 cursor-pointer"
                >
                  {item.checked ? (
                    <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                  <span
                    className={`text-sm font-semibold truncate ${
                      item.checked ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}
                  >
                    {item.name}
                  </span>
                  {item.checked && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full shrink-0">
                      In Cart ✓
                    </span>
                  )}
                </button>

                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <span>Items auto-check when scanned into cart</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 font-bold text-slate-800 hover:text-black cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { X, Receipt as ReceiptIcon, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Receipt, LanguageCode } from '../types/store';

interface PastReceiptsModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipts: Receipt[];
  onSelectReceipt: (r: Receipt) => void;
  language: LanguageCode;
}

export const PastReceiptsModal: React.FC<PastReceiptsModalProps> = ({
  isOpen,
  onClose,
  receipts,
  onSelectReceipt,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-white">
              <ReceiptIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight">My Past Bills & Exit Passes</h2>
              <p className="text-xs text-slate-400">Vijayawada Supermarket Invoices & Gate Passes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {receipts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <ReceiptIcon className="w-12 h-12 mx-auto text-slate-300 mb-2 stroke-1" />
              <p className="font-semibold text-slate-600 text-sm">No Past Bills Found</p>
              <p className="text-xs text-slate-400 mt-1">Your itemized GST bills and turnstile passes will appear here after checkout.</p>
            </div>
          ) : (
            receipts.map((r) => (
              <div
                key={r.orderId}
                onClick={() => {
                  onSelectReceipt(r);
                  onClose();
                }}
                className="p-4 rounded-2xl border border-slate-200 hover:border-red-400 bg-white hover:bg-red-50/20 transition cursor-pointer flex items-center justify-between shadow-xs group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm group-hover:text-red-600 transition">
                      Invoice #{r.orderId}
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Paid
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{r.storeName}</div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{r.date}</span>
                    <span>•</span>
                    <span>{r.items.length} Items</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-black font-mono text-slate-900">₹{r.total}</div>
                  <div className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-1 justify-end group-hover:translate-x-0.5 transition-transform">
                    <span>View Bill</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 font-bold text-xs text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

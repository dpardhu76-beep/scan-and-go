import React from 'react';
import { ShieldCheck, Scale, AlertTriangle } from 'lucide-react';

interface WeightSecurityBadgeProps {
  totalWeightKg: number;
  itemCount: number;
}

export const WeightSecurityBadge: React.FC<WeightSecurityBadgeProps> = ({
  totalWeightKg,
  itemCount,
}) => {
  const isOptimal = true; // Calibrated sensor simulation

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-3 sm:p-4 border border-slate-800 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Smart Cart Weight Sensor</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Synchronized with in-cart scale load cell
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm sm:text-base font-black font-mono text-white">
            {totalWeightKg.toFixed(2)} <span className="text-xs font-normal text-slate-400">kg</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center justify-end gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Bag Area Matched ✓</span>
          </div>
        </div>
      </div>
    </div>
  );
};

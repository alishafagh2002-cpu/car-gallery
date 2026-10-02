import React from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { Vehicle, CurrencyMode } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { getSafeImageUrl, handleImageError } from '../../utils/imageHelper';

interface CompareDrawerProps {
  vehicles: Vehicle[];
  currency: CurrencyMode;
  onRemove: (id: string) => void;
  onClear: () => void;
  onSelectCar: (car: Vehicle) => void;
  onClose: () => void;
}

export const CompareDrawer: React.FC<CompareDrawerProps> = ({
  vehicles,
  currency,
  onRemove,
  onClear,
  onSelectCar,
  onClose,
}) => {
  if (vehicles.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-lg border-t border-white/10 shadow-2xl p-4 sm:p-6 transition-transform">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase">
              VEHICLE COMPARISON ({vehicles.length}/3)
            </span>
            <span className="text-xs text-white/50">مقایسه فنی و حقوقی خودروها</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClear}
              className="text-xs text-white/50 hover:text-white transition-colors"
            >
              پاک‌کردن همه
            </button>
            <button onClick={onClose} className="p-1 text-white/50 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-x-auto">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="bg-black/40 border border-white/[0.08] p-3.5 flex flex-col justify-between relative group"
            >
              <button
                onClick={() => onRemove(v.id)}
                className="absolute top-2 left-2 p-1 text-white/40 hover:text-rose-400 z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex gap-3 items-center">
                <img
                  src={getSafeImageUrl(v.images[0]?.url)}
                  alt={v.modelNameEn}
                  onError={handleImageError}
                  className="w-20 h-14 object-cover shrink-0 bg-neutral-900"
                />
                <div className="overflow-hidden">
                  <div className="text-[10px] text-[#D4AF37] font-semibold">{v.brandNameEn}</div>
                  <div className="text-xs font-bold text-white truncate">{v.modelNameEn}</div>
                  <div className="text-xs text-white/80 font-latin font-bold tabular-nums">
                    {formatPrice(v.priceToman, currency, { compact: true })}
                  </div>
                </div>
              </div>

              {/* Specs Snapshot */}
              <div className="mt-3 pt-2 border-t border-white/[0.05] grid grid-cols-3 gap-2 text-center text-[11px] text-white/70 font-latin">
                <div>
                  <span className="text-[10px] text-white/30 block">قدرت</span>
                  <span className="font-semibold text-white">{v.enginePower} HP</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/30 block">۰ تا ۱۰۰</span>
                  <span className="font-semibold text-white">{v.specifications.acceleration0to100}s</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/30 block">پلاک</span>
                  <span className="text-[10px] text-[#D4AF37] font-persian truncate block">
                    {v.temporaryImport ? 'گذر موقت' : v.freeZoneNameFa ? v.freeZoneNameFa.replace('منطقه آزاد ', '') : 'ملی'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onSelectCar(v)}
                className="mt-3 w-full py-1.5 text-[11px] font-semibold text-white bg-white/10 hover:bg-[#D4AF37] hover:text-black transition-colors"
              >
                مشاهده پرونده کامل
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

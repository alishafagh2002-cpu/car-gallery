import React from 'react';
import { Vehicle, CurrencyMode } from '../../types';
import { formatPrice, formatMileage } from '../../utils/formatters';
import { ArrowLeft, Clock, ShieldCheck, Heart } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  currency: CurrencyMode;
  onSelect: (vehicle: Vehicle) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (vehicleId: string) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  currency,
  onSelect,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const primaryImage =
    vehicle.images.find((img) => img.isPrimary)?.url ||
    vehicle.images[0]?.url ||
    '/src/assets/images/hero_luxury_hypercar_1790889964433.jpg';

  return (
    <article
      onClick={() => onSelect(vehicle)}
      className="group relative cursor-pointer bg-[#0A0A0A] border border-white/[0.08] hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden"
    >
      {/* Top Media Showcase Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#050505]">
        <img
          src={primaryImage}
          alt={`${vehicle.brandNameEn} ${vehicle.modelNameEn}`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Gentle dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80" />

        {/* Favorite Button (Functional affordance only) */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(vehicle.id);
            }}
            aria-label="افزودن به علاقه‌مندی‌ها"
            className="absolute top-3 left-3 p-2 bg-black/60 backdrop-blur-sm text-white/70 hover:text-white transition-colors"
          >
            <Heart
              className={`w-4 h-4 ${isFavorite ? 'fill-[#D4AF37] text-[#D4AF37]' : ''}`}
            />
          </button>
        )}

        {/* Quiet Customs Plate / Status Indicator (Zero-Pill: pure unboxed text) */}
        <div className="absolute bottom-3 right-3 text-xs tracking-wider text-white/90 drop-shadow-md">
          {vehicle.temporaryImport ? (
            <span className="text-[#E5C07B] flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>گذر موقت · {vehicle.temporaryLicenseDaysRemaining || 90} روز باقی‌مانده</span>
            </span>
          ) : vehicle.freeZoneNameFa ? (
            <span className="text-[#98C379] flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>پلاک {vehicle.freeZoneNameFa}</span>
            </span>
          ) : (
            <span className="text-white/70">پلاک ملی ترخیص شده</span>
          )}
        </div>
      </div>

      {/* Editorial Content Section */}
      <div className="p-6 flex flex-col flex-grow justify-between gap-4">
        {/* Brand & Model Name */}
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-semibold mb-1">
            {vehicle.brandNameEn}
          </div>
          <h3 className="text-lg font-bold text-[#F2F0EA] group-hover:text-white transition-colors line-clamp-1">
            {vehicle.modelNameEn}
            <span className="text-sm font-normal text-white/50 mr-2 font-persian">
              {vehicle.modelNameFa}
            </span>
          </h3>
          <p className="text-xs text-white/50 line-clamp-1 mt-1 font-persian">
            {vehicle.headlineFa}
          </p>
        </div>

        {/* Clean Unboxed Metadata Specs with Separators */}
        <div className="flex items-center flex-wrap gap-2 text-xs text-white/60 font-latin border-t border-white/[0.04] pt-3">
          <span className="tabular-nums">{vehicle.year}</span>
          <span aria-hidden="true" className="text-white/20">·</span>
          <span>{formatMileage(vehicle.mileage)}</span>
          <span aria-hidden="true" className="text-white/20">·</span>
          <span className="tabular-nums">{vehicle.enginePower} HP</span>
          <span aria-hidden="true" className="text-white/20">·</span>
          <span className="font-persian">{vehicle.locationCityFa}</span>
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
          <div>
            <div className="text-[10px] text-white/40 tracking-wider">قیمت کارشناسی</div>
            <div className="text-base sm:text-lg font-bold text-white font-latin tabular-nums">
              {formatPrice(vehicle.priceToman, currency, { compact: true })}
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#D4AF37] group-hover:translate-x-[-4px] transition-transform">
            <span>بررسی پرونده</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </article>
  );
};

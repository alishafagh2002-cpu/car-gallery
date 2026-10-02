import React from 'react';
import { Vehicle, CurrencyMode } from '../../types';
import { formatPrice, formatMileage } from '../../utils/formatters';
import { getSafeImageUrl, handleImageError } from '../../utils/imageHelper';
import { ArrowLeft, Clock, ShieldCheck, Heart, Wallet, CheckCircle } from 'lucide-react';
import { AuctionCountdown } from './AuctionCountdown';
import { useVirtualWallet } from '../../context/VirtualWalletContext';

interface VehicleCardProps {
  vehicle: Vehicle;
  currency: CurrencyMode;
  onSelect: (vehicle: Vehicle) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (vehicleId: string) => void;
  showAuctionCountdown?: boolean;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  currency,
  onSelect,
  isFavorite = false,
  onToggleFavorite,
  showAuctionCountdown = false,
}) => {
  const primaryImage = getSafeImageUrl(
    vehicle.images.find((img) => img.isPrimary)?.url || vehicle.images[0]?.url
  );

  const { getAffordabilityInfo } = useVirtualWallet();
  const affordability = getAffordabilityInfo(vehicle.priceToman);

  // Show auction countdown for featured high-end vehicles or when requested
  const hasAuction =
    showAuctionCountdown ||
    vehicle.id === 'veh-001' || // 911 GT3 RS
    vehicle.id === 'veh-002' || // Ferrari Roma
    vehicle.id === 'veh-004' || // G63 AMG
    vehicle.priceToman >= 20000000000;

  return (
    <article
      onClick={() => onSelect(vehicle)}
      className="group relative cursor-pointer bg-white/[0.03] backdrop-blur-xl border border-white/[0.12] hover:border-[#D4AF37]/70 hover:bg-white/[0.07] transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.55)] hover:shadow-[0_16px_48px_rgba(212,175,55,0.18)]"
    >
      {/* Top Media Showcase Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#050505]/60">
        <img
          src={primaryImage}
          alt={`${vehicle.brandNameEn} ${vehicle.modelNameEn}`}
          onError={handleImageError}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Gentle dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* Glassmorphic Auction Countdown Widget (Top Right) */}
        {hasAuction && (
          <div className="absolute top-3 right-3 z-10">
            <AuctionCountdown compact={true} label="فروش ویژه VIP" />
          </div>
        )}

        {/* Favorite Button (Top Left Glassmorphic pill) */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(vehicle.id);
            }}
            aria-label="افزودن به علاقه‌مندی‌ها"
            className="absolute top-3 left-3 z-10 p-2 bg-black/50 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:border-[#D4AF37]/50 transition-all shadow-lg"
          >
            <Heart
              className={`w-4 h-4 ${isFavorite ? 'fill-[#D4AF37] text-[#D4AF37]' : ''}`}
            />
          </button>
        )}

        {/* Customs Plate / Status Indicator (Bottom Right Glass pill) */}
        <div className="absolute bottom-3 right-3 z-10 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 text-xs tracking-wider text-white shadow-md">
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
            <span className="text-white/80">پلاک ترخیص شده</span>
          )}
        </div>
      </div>

      {/* Glassmorphic Content Body */}
      <div className="p-6 flex flex-col flex-grow justify-between gap-4 bg-gradient-to-b from-transparent to-black/30 backdrop-blur-md">
        {/* Brand & Model Name */}
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-semibold mb-1 font-mono">
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

        {/* Metadata Specs with Separators */}
        <div className="flex items-center flex-wrap gap-2 text-xs text-white/60 font-latin border-t border-white/[0.06] pt-3">
          <span className="tabular-nums font-mono">{vehicle.year}</span>
          <span aria-hidden="true" className="text-white/20">·</span>
          <span>{formatMileage(vehicle.mileage)}</span>
          <span aria-hidden="true" className="text-white/20">·</span>
          <span className="tabular-nums font-mono">{vehicle.enginePower} HP</span>
          <span aria-hidden="true" className="text-white/20">·</span>
          <span className="font-persian">{vehicle.locationCityFa}</span>
        </div>

        {/* Virtual Wallet Affordability Indicator */}
        <div className="bg-white/[0.03] border border-white/[0.06] p-2 flex items-center justify-between text-[11px] backdrop-blur-sm">
          <div className="flex items-center gap-1.5 text-white/70">
            <Wallet className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>بودجه کیف پول:</span>
          </div>

          {affordability.canAfford ? (
            <div className="flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>پوشش کامل (۱۰۰٪)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-[#D4AF37]"
                  style={{ width: `${affordability.coveragePercent}%` }}
                />
              </div>
              <span className="font-mono text-[10px] text-[#D4AF37] tabular-nums">
                {affordability.coveragePercent}٪
              </span>
            </div>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
          <div>
            <div className="text-[10px] text-white/40 tracking-wider">قیمت کارشناسی</div>
            <div className="text-base sm:text-lg font-bold text-white font-latin tabular-nums">
              {formatPrice(vehicle.priceToman, currency, { compact: true })}
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#D4AF37] group-hover:translate-x-[-4px] transition-transform font-medium">
            <span>بررسی پرونده</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </article>
  );
};

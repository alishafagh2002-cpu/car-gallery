import React, { useEffect, useState } from 'react';
import { ArrowRight, ShieldCheck, MapPin, CheckCircle, Phone } from 'lucide-react';
import { Vehicle, CurrencyMode, FreeZoneInfo } from '../types';
import { FREE_ZONES } from '../data/locations';
import { CarService } from '../services/api';
import { VehicleCard } from '../components/vehicles/VehicleCard';
import { VehicleListSkeleton } from '../components/vehicles/VehicleListSkeleton';
import { getSafeImageUrl, handleImageError } from '../utils/imageHelper';

interface LocationDetailPageProps {
  zoneSlug: string;
  currency: CurrencyMode;
  onSelectCar: (car: Vehicle) => void;
  onNavigate: (path: string) => void;
  onOpenConsultation: () => void;
}

export const LocationDetailPage: React.FC<LocationDetailPageProps> = ({
  zoneSlug,
  currency,
  onSelectCar,
  onNavigate,
  onOpenConsultation,
}) => {
  const zone: FreeZoneInfo | undefined = FREE_ZONES[zoneSlug] || FREE_ZONES['kish'];
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    CarService.getCars({ freeZone: zone.slug }).then((res) => {
      setVehicles(res.vehicles);
      setLoading(false);
    });
  }, [zone.slug]);

  return (
    <div className="min-h-screen bg-[#050505] text-[#F2F0EA] py-8">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به صفحه اصلی</span>
        </button>
      </div>

      {/* Location Hero */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative aspect-[21/9] min-h-[360px] w-full overflow-hidden border border-white/10 bg-[#0A0A0A]">
          <img
            src={getSafeImageUrl(zone.coverImage)}
            alt={zone.nameFa}
            onError={handleImageError}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />

          {/* Hero Content */}
          <div className="absolute bottom-8 right-8 left-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#D4AF37] uppercase">
                <MapPin className="w-3.5 h-3.5" />
                <span>{zone.provinceFa} · کد گمرک {zone.customsCode}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold text-white font-persian">
                {zone.nameFa}
              </h1>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-persian">
                {zone.descriptionFa}
              </p>
            </div>

            <div className="bg-black/80 backdrop-blur-md border border-white/10 p-5 shrink-0 text-left">
              <div className="text-[11px] text-white/40 uppercase tracking-widest">موجودی آماده تحویل</div>
              <div className="text-3xl font-bold text-white font-latin tabular-nums">
                {vehicles.length} خودرو
              </div>
              <div className="text-xs text-[#D4AF37] mt-1 font-medium">{zone.taxIncentive}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Customs Regulations & Rules */}
        <section className="bg-[#0A0A0A] border border-white/[0.08] p-6 sm:p-8">
          <h3 className="text-sm font-mono tracking-widest text-[#D4AF37] uppercase mb-4">
            CUSTOMS & OPERATIONAL REGULATIONS · {zone.nameEn.toUpperCase()}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-white/80">
            {zone.rulesFa.map((rule, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Zone Inventory Showcase */}
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <h2 className="text-2xl font-bold text-white font-persian">
              خودروهای پلاک {zone.nameFa}
            </h2>
            <span className="text-xs text-white/50">{vehicles.length} مورد یافت شد</span>
          </div>

          {loading ? (
            <VehicleListSkeleton count={3} gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" />
          ) : vehicles.length === 0 ? (
            <div className="text-center py-16 bg-[#0A0A0A] border border-white/[0.08] text-xs text-white/50">
              در حال حاضر خودرویی با پلاک این منطقه در نمایشگاه ثبت نشده است. برای سفارش با واحد بازرگانی تماس حاصل فرمایید.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((v) => (
                <VehicleCard
                  key={v.id}
                  vehicle={v}
                  currency={currency}
                  onSelect={onSelectCar}
                />
              ))}
            </div>
          )}
        </section>

        {/* Free Zone Switcher Footer Tabs */}
        <section className="pt-8 border-t border-white/[0.08]">
          <h4 className="text-xs text-white/50 mb-4 uppercase tracking-wider">سایر مناطق آزاد تجاری:</h4>
          <div className="flex flex-wrap gap-3">
            {Object.values(FREE_ZONES).map((z) => (
              <button
                key={z.slug}
                onClick={() => onNavigate(`/locations/${z.slug}`)}
                className={`px-4 py-2 text-xs border transition-colors ${
                  z.slug === zone.slug
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white font-semibold'
                    : 'border-white/10 text-white/60 hover:text-white'
                }`}
              >
                {z.nameFa}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

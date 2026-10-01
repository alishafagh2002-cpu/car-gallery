import React, { useEffect, useState } from 'react';
import { HeroCinematic } from '../components/hero/HeroCinematic';
import { VehicleCard } from '../components/vehicles/VehicleCard';
import { Vehicle, CurrencyMode, FreeZoneInfo } from '../types';
import { CarService } from '../services/api';
import { FREE_ZONES } from '../data/locations';
import { ArrowLeft, ArrowUpRight, ShieldCheck, FileText, Anchor, Compass, Clock, Award } from 'lucide-react';

interface HomePageProps {
  currency: CurrencyMode;
  onSelectCar: (car: Vehicle) => void;
  onNavigate: (path: string) => void;
  onOpenConsultation: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  currency,
  onSelectCar,
  onNavigate,
  onOpenConsultation,
}) => {
  const [featuredCars, setFeaturedCars] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CarService.getFeaturedCars().then((cars) => {
      setFeaturedCars(cars.slice(0, 6));
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-[#F2F0EA]">
      {/* 1. Cinematic Hero Section */}
      <HeroCinematic
        onExploreCars={() => onNavigate('/cars')}
        onOpenConsultation={onOpenConsultation}
      />

      {/* 2. Featured Flagship Collection */}
      <section className="py-24 border-b border-white/[0.08] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold mb-2 font-latin">
              CURATED COLLECTION
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#F2F0EA] font-persian">
              منتخب سوپراسپرت‌ها و خودروهای پرچمدار
            </h2>
            <p className="text-xs sm:text-sm text-white/50 mt-2 max-w-xl font-persian">
              خودروهای برگزیده با کارشناسی کامل رنگ و موتور، دارای مجوز تردد رسمی و امکان تحویل فوری در کیش، اروند و تهران.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/cars')}
            className="flex items-center gap-2 text-xs font-semibold text-white/80 hover:text-[#D4AF37] transition-colors self-start md:self-auto group"
          >
            <span>مشاهده همه خودروها</span>
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 bg-white/[0.03] animate-pulse border border-white/[0.05]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCars.map((car) => (
              <VehicleCard
                key={car.id}
                vehicle={car}
                currency={currency}
                onSelect={onSelectCar}
              />
            ))}
          </div>
        )}
      </section>

      {/* 3. Free Trade Zones Interactive Gateway */}
      <section className="py-24 border-b border-white/[0.08] bg-[#080808]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <div className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold mb-2 font-latin">
              SPECIAL ECONOMIC ZONES
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white font-persian">
              دروازه مناطق آزاد تجاری ایران
            </h2>
            <p className="text-xs sm:text-sm text-white/60 mt-2 leading-relaxed">
              هر منطقه آزاد دارای قوانین و معافیت‌های گمرکی ویژه‌ای است. خودروی مدنظر خود را بر اساس موقعیت جغرافیایی و شرایط تردد استانی انتخاب نمایید.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(FREE_ZONES).map((zone) => (
              <div
                key={zone.slug}
                onClick={() => onNavigate(`/locations/${zone.slug}`)}
                className="group relative cursor-pointer overflow-hidden border border-white/10 bg-[#0c0c0e] hover:border-[#D4AF37]/60 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <img
                    src={zone.coverImage}
                    alt={zone.nameFa}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-black/40 to-transparent" />
                  <div className="absolute top-3 left-3 text-[11px] font-mono tracking-wider text-white/70 bg-black/60 px-2 py-0.5 border border-white/10">
                    {zone.customsCode}
                  </div>
                </div>

                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                        {zone.nameFa}
                      </h3>
                      <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                    </div>
                    <div className="text-[11px] text-[#D4AF37] mt-1 font-medium">
                      {zone.taxIncentive}
                    </div>
                    <p className="text-xs text-white/50 mt-3 line-clamp-2 leading-relaxed">
                      {zone.descriptionFa}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/60">
                    <span>موجودی کارشناسی شده:</span>
                    <span className="font-bold text-white font-latin tabular-nums">
                      {zone.vehicleCount} خودرو
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. The Editorial Manifesto: "The Art of Acquisition" */}
      <section className="py-24 border-b border-white/[0.08] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold font-latin">
              TRANSPARENT CURATION & COMPLIANCE
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight font-persian">
              هنر خرید مطمئن خودروهای گذر موقت و آزاد
            </h2>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              بازار خودروهای وارداتی خاص در ایران در سالیان گذشته با دغدغه‌های متعدد اصالت اسناد، تمدید گذر موقت و انتقال سند روبرو بوده است. نوآر موتورز به عنوان مرجع تخصصی، فرایند معامله را با سه اصل بنیادین بازآفرینی کرده است:
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex gap-4 items-start">
                <div className="p-2.5 bg-white/[0.04] border border-white/10 text-[#D4AF37] shrink-0 mt-1">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">کارشناسی ۱۰۰ قسمتی رنگ، شاسی و الکترونیک</h4>
                  <p className="text-xs text-white/50 mt-1 leading-relaxed">
                    هر دستگاه پیش از بارگذاری در سیستم توسط معتبرترین دستگاه‌های دیجیتال ضخامت‌سنجی و دیاگ رسمی کمپانی بازرسی کامل می‌شود.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-2.5 bg-white/[0.04] border border-white/10 text-[#D4AF37] shrink-0 mt-1">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">استعلام سیستمی گمرک و پلیس راهور</h4>
                  <p className="text-xs text-white/50 mt-1 leading-relaxed">
                    بررسی دقیق کارنه دوپاساژ، پروانه ورود موقت، مفاصاحساب مالیاتی و تطابق کامل شماره VIN با برگه سبز گمرک.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-2.5 bg-white/[0.04] border border-white/10 text-[#D4AF37] shrink-0 mt-1">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">همراهی رسمی در تمدید و خروج موقت</h4>
                  <p className="text-xs text-white/50 mt-1 leading-relaxed">
                    ارائه خدمات حقوقی تمدید دوره‌ای گذر موقت در گمرکات تهران و تبریز و اخذ مرخصی تردد برای خودروهای پلاک کیش و اروند.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Box */}
          <div className="relative aspect-[4/3] border border-white/10 overflow-hidden bg-black/40">
            <img
              src="/src/assets/images/hero_luxury_sedan_1790889996887.jpg"
              alt="Noir Motors VIP Inspection Lounge"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 inset-x-6 bg-black/80 backdrop-blur-md border border-white/10 p-5 text-xs space-y-2">
              <div className="text-[11px] font-mono text-[#D4AF37] uppercase tracking-wider">
                CONFIDENTIAL VIP ACQUISITION
              </div>
              <p className="text-white/80 leading-relaxed font-persian">
                «خریداران ما تنها یک اتومبیل انتخاب نمی‌کنند؛ آن‌ها آرامش خاطر و تضمین قطعی انتقال مالکیت را تجربه می‌نمایند.»
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Big VIP Concierge Action Banner */}
      <section className="py-20 bg-gradient-to-b from-[#080808] to-[#050505]">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-xs tracking-widest text-[#D4AF37] uppercase font-mono">
            <Award className="w-4 h-4" />
            <span>BESPOKE AUTOMOTIVE CONSULTING</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold text-white font-persian leading-snug">
            در جستجوی مدلی خاص یا سفارشی هستید؟
          </h2>

          <p className="text-xs sm:text-sm text-white/60 max-w-xl mx-auto leading-relaxed">
            تیم بازرگانی و ترخیص نوآر موتورز آمادگی دارد خودروی مورد نظر شما را مستقیماً از امارات، آلمان یا مناطق آزاد کشور با تضمین قانونی تامین نماید.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenConsultation}
              className="px-8 py-3.5 text-xs font-bold text-[#050505] bg-[#F2F0EA] hover:bg-[#D4AF37] transition-colors"
            >
              هماهنگی جلسه با مدیر بازرگانی VIP
            </button>
            <button
              onClick={() => onNavigate('/cars')}
              className="px-8 py-3.5 text-xs font-medium text-white border border-white/20 hover:border-white/60 transition-colors"
            >
              مرور تمامی خودروهای موجود
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

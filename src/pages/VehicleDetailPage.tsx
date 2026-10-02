import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Clock,
  FileText,
  RotateCw,
  Heart,
  Share2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  Gauge,
  Zap,
  ArrowRight,
  ArrowLeft,
  Layers,
  MapPin,
  Building,
  Download,
} from 'lucide-react';
import { Vehicle, CurrencyMode } from '../types';
import { CarService } from '../services/api';
import { VehicleViewer360 } from '../components/vehicles/VehicleViewer360';
import { VehicleCard } from '../components/vehicles/VehicleCard';
import { PurchaseModal } from '../components/vehicles/PurchaseModal';
import { AppointmentModal } from '../components/vehicles/AppointmentModal';
import { VehiclePdfBrochureModal } from '../components/vehicles/VehiclePdfBrochureModal';
import { formatPrice, formatMileage } from '../utils/formatters';
import { getSafeImageUrl, handleImageError } from '../utils/imageHelper';

interface VehicleDetailPageProps {
  vehicle: Vehicle;
  currency: CurrencyMode;
  onBack: () => void;
  onSelectCar: (car: Vehicle) => void;
  onAddToCompare: (car: Vehicle) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export const VehicleDetailPage: React.FC<VehicleDetailPageProps> = ({
  vehicle,
  currency,
  onBack,
  onSelectCar,
  onAddToCompare,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const [activeMediaTab, setActiveMediaTab] = useState<'GALLERY' | 'VIEWER360'>('GALLERY');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [appointmentModalType, setAppointmentModalType] = useState<'VIEWING' | 'TEST_DRIVE' | null>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [similarCars, setSimilarCars] = useState<Vehicle[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    CarService.getSimilarCars(vehicle).then(setSimilarCars);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [vehicle]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F2F0EA] py-10">
      {/* Top Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به فهرست موجودی</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title & Price Header */}
        <div className="pb-8 border-b border-white/[0.08] flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-xs tracking-widest text-[#D4AF37] font-semibold uppercase font-latin">
              <span>{vehicle.brandNameEn}</span>
              <span className="text-white/20">/</span>
              <span>{vehicle.trim || vehicle.modelNameEn}</span>
              <span className="text-white/20">/</span>
              <span>مدل {vehicle.year}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight font-persian">
              {vehicle.brandNameFa} {vehicle.modelNameFa}
              <span className="text-xl sm:text-2xl font-normal text-white/50 mr-3 font-latin">
                {vehicle.modelNameEn}
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-white/60 max-w-2xl font-persian">
              {vehicle.headlineFa}
            </p>
          </div>

          {/* Pricing Module & Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 lg:text-left">
            <div>
              <div className="text-[11px] text-white/40 tracking-wider">قیمت کارشناسی شده</div>
              <div className="text-2xl sm:text-4xl font-bold text-white font-latin tabular-nums">
                {formatPrice(vehicle.priceToman, currency, { compact: false })}
              </div>
              <div className="text-xs text-[#D4AF37] mt-0.5 font-latin">
                {currency === 'TOMAN'
                  ? `معادل ${formatPrice(vehicle.priceToman, 'USD')} دلار آمریکا`
                  : `معادل ${formatPrice(vehicle.priceToman, 'TOMAN', { compact: true })}`}
              </div>
            </div>

            {/* Action Bar (Favorite, Compare, Share) */}
            <div className="flex items-center gap-2">
              {onToggleFavorite && (
                <button
                  onClick={() => onToggleFavorite(vehicle.id)}
                  title="افزودن به علاقه‌مندی‌ها"
                  className="p-3 bg-[#0A0A0A] border border-white/10 hover:border-white/30 text-white transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${isFavorite ? 'fill-[#D4AF37] text-[#D4AF37]' : ''}`}
                  />
                </button>
              )}

              <button
                onClick={() => onAddToCompare(vehicle)}
                title="افزودن به لیست مقایسه"
                className="p-3 bg-[#0A0A0A] border border-white/10 hover:border-white/30 text-white transition-colors flex items-center gap-2 text-xs"
              >
                <Layers className="w-5 h-5 text-[#D4AF37]" />
                <span className="hidden sm:inline">مقایسه</span>
              </button>

              <button
                onClick={handleShare}
                title="اشتراک‌گذاری پرونده"
                className="p-3 bg-[#0A0A0A] border border-white/10 hover:border-white/30 text-white transition-colors relative"
              >
                <Share2 className="w-5 h-5" />
                {copiedLink && (
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black border border-white/20 text-[10px] px-2 py-0.5 whitespace-nowrap text-[#D4AF37]">
                    لینک کپی شد
                  </span>
                )}
              </button>

              {/* PDF Brochure & Dossier Button */}
              <button
                onClick={() => setShowPdfModal(true)}
                title="دریافت شناسنامه فنی و شرایط خرید (فایل PDF)"
                className="p-3 bg-[#0A0A0A] border border-[#D4AF37]/50 hover:border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors flex items-center gap-2 text-xs font-semibold shadow-[0_0_10px_rgba(212,175,55,0.15)]"
              >
                <FileText className="w-5 h-5 text-[#D4AF37]" />
                <span className="hidden sm:inline">کاتالوگ و شناسنامه PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Media Showcase Layer (Gallery vs 360 Viewer Switcher) */}
        <div className="my-8 space-y-4">
          {/* Media Mode Tabs */}
          <div className="flex items-center justify-between">
            <div className="flex items-center bg-[#0A0A0A] border border-white/10 p-1 text-xs">
              <button
                onClick={() => setActiveMediaTab('GALLERY')}
                className={`px-4 py-2 transition-colors ${
                  activeMediaTab === 'GALLERY'
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                گالری عکس فول HD ({vehicle.images.length})
              </button>
              <button
                onClick={() => setActiveMediaTab('VIEWER360')}
                className={`px-4 py-2 flex items-center gap-1.5 transition-colors ${
                  activeMediaTab === 'VIEWER360'
                    ? 'bg-[#D4AF37]/20 text-[#D4AF37] font-semibold border border-[#D4AF37]/30'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>نمای گردان ۳۶۰ درجه</span>
              </button>
            </div>

            {/* Customs Status Indicator Banner */}
            <div className="hidden sm:flex items-center gap-3 text-xs">
              {vehicle.temporaryImport ? (
                <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 text-amber-300">
                  <Clock className="w-4 h-4" />
                  <span>پلاک گذر موقت فراجا · {vehicle.temporaryLicenseDaysRemaining || 90} روز مهلت تردد</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-emerald-300">
                  <ShieldCheck className="w-4 h-4" />
                  <span>پلاک رسمی {vehicle.freeZoneNameFa || 'منطقه آزاد'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Active View Display */}
          {activeMediaTab === 'VIEWER360' ? (
            <VehicleViewer360 vehicle={vehicle} />
          ) : (
            <div className="space-y-4">
              {/* Primary Large Image Frame */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#0A0A0A] border border-white/10">
                <img
                  src={getSafeImageUrl(vehicle.images[selectedImageIndex]?.url || vehicle.images[0]?.url)}
                  alt={vehicle.modelNameEn}
                  onError={handleImageError}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Thumbnails Row */}
              <div className="flex items-center gap-4 overflow-x-auto pb-2">
                {vehicle.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-28 h-18 shrink-0 overflow-hidden border transition-all ${
                      selectedImageIndex === idx
                        ? 'border-[#D4AF37] scale-102 opacity-100'
                        : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={getSafeImageUrl(img.url)}
                      alt=""
                      onError={handleImageError}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2-Column Dossier Content: Left is Details & Specs, Right is Sticky Purchase Module */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-6">
          {/* Main Specifications & Dossier (8 Columns) */}
          <div className="lg:col-span-8 space-y-12">
            {/* 1. Quick Performance Matrix */}
            <section className="bg-[#0A0A0A] border border-white/[0.08] p-6">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] mb-4">
                PERFORMANCE SPECIFICATIONS MATRIX
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                <div className="p-3 bg-black/40 border border-white/[0.04]">
                  <div className="text-[11px] text-white/40 mb-1">شتاب ۰ تا ۱۰۰</div>
                  <div className="text-2xl font-bold text-white font-latin tabular-nums">
                    {vehicle.specifications.acceleration0to100}s
                  </div>
                </div>

                <div className="p-3 bg-black/40 border border-white/[0.04]">
                  <div className="text-[11px] text-white/40 mb-1">حداکثر سرعت</div>
                  <div className="text-2xl font-bold text-white font-latin tabular-nums">
                    {vehicle.specifications.topSpeedKmh} km/h
                  </div>
                </div>

                <div className="p-3 bg-black/40 border border-white/[0.04]">
                  <div className="text-[11px] text-white/40 mb-1">توان موتور</div>
                  <div className="text-2xl font-bold text-white font-latin tabular-nums">
                    {vehicle.enginePower} HP
                  </div>
                </div>

                <div className="p-3 bg-black/40 border border-white/[0.04]">
                  <div className="text-[11px] text-white/40 mb-1">گشتاور خروجی</div>
                  <div className="text-2xl font-bold text-white font-latin tabular-nums">
                    {vehicle.specifications.torqueNm} Nm
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Comprehensive Technical Specifications */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-white font-persian flex items-center gap-2">
                <Gauge className="w-5 h-5 text-[#D4AF37]" />
                <span>مشخصات فنی و مکانیکی</span>
              </h3>

              <div className="bg-[#0A0A0A] border border-white/[0.08] divide-y divide-white/[0.04] text-xs">
                <div className="flex justify-between p-3.5">
                  <span className="text-white/50">پیشرانه و آرایش سیلندرها:</span>
                  <span className="font-semibold text-white font-latin">{vehicle.engine}</span>
                </div>
                {vehicle.specifications.displacementCc && (
                  <div className="flex justify-between p-3.5">
                    <span className="text-white/50">حجم دقیق موتور:</span>
                    <span className="font-semibold text-white font-latin tabular-nums">
                      {vehicle.specifications.displacementCc} cc
                    </span>
                  </div>
                )}
                <div className="flex justify-between p-3.5">
                  <span className="text-white/50">سیستم انتقال قدرت و گیربکس:</span>
                  <span className="font-semibold text-white">
                    {vehicle.transmission === 'DUAL_CLUTCH'
                      ? 'دوکلاچه اتوماتیک سریع با پدال شیفتر پشت فرمان'
                      : vehicle.transmission === 'MANUAL'
                      ? 'گیربکس دستی اسپرت ۶ سرعته'
                      : 'اتوماتیک هوشمند تیپ‌ترونیک'}
                  </span>
                </div>
                <div className="flex justify-between p-3.5">
                  <span className="text-white/50">آرایش دیفرانسیل:</span>
                  <span className="font-semibold text-white font-latin">
                    {vehicle.driveType === 'AWD'
                      ? 'چهارچرخ متحرک هوشمند (All-Wheel Drive)'
                      : vehicle.driveType === '4WD'
                      ? 'دو دیفرانسیل با قفل مکانیکی و الکترونیکی'
                      : 'دیفرانسیل عقب پرفورمنس (RWD)'}
                  </span>
                </div>
                <div className="flex justify-between p-3.5">
                  <span className="text-white/50">کارکرد واقعی:</span>
                  <span className="font-semibold text-white font-latin">
                    {formatMileage(vehicle.mileage)}
                  </span>
                </div>
                <div className="flex justify-between p-3.5">
                  <span className="text-white/50">رنگ بدنه (خارجی):</span>
                  <span className="font-semibold text-white">
                    {vehicle.exteriorColorFa} ({vehicle.exteriorColorEn})
                  </span>
                </div>
                <div className="flex justify-between p-3.5">
                  <span className="text-white/50">تریم و چرم کابین:</span>
                  <span className="font-semibold text-white">
                    {vehicle.interiorColorFa}
                  </span>
                </div>
                {vehicle.specifications.dimensionsMm && (
                  <div className="flex justify-between p-3.5">
                    <span className="text-white/50">ابعاد خودرو (طول × عرض × ارتفاع):</span>
                    <span className="font-semibold text-white font-latin">
                      {vehicle.specifications.dimensionsMm} mm
                    </span>
                  </div>
                )}
              </div>
            </section>

            {/* 3. Factory Equipment & Features Bullets */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-white font-persian flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#D4AF37]" />
                <span>امکانات و تجهیزات کارخانه‌ای شاخص</span>
              </h3>

              <div className="bg-[#0A0A0A] border border-white/[0.08] p-5">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-white/80">
                  {vehicle.specifications.featuresFa.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* 4. Customs, Legal & License Transparency */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-white font-persian flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                <span>پرونده گمرکی و وضعیت حقوقی اسناد</span>
              </h3>

              <div className="bg-[#0A0A0A] border border-white/[0.08] p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-black/40 border border-white/[0.04]">
                    <span className="text-white/40 block mb-1">نوع پلاک و تردد:</span>
                    <span className="text-white font-semibold text-sm">
                      {vehicle.temporaryImport
                        ? 'گذر موقت گمرکی (تردد در سراسر کشور)'
                        : `پلاک ${vehicle.freeZoneNameFa || 'منطقه آزاد'}`}
                    </span>
                  </div>

                  <div className="p-3 bg-black/40 border border-white/[0.04]">
                    <span className="text-white/40 block mb-1">وضعیت مالکیت و انتقال:</span>
                    <span className="text-emerald-400 font-semibold text-sm">
                      آماده انتقال رسمی در دفترخانه اسناد رسمی
                    </span>
                  </div>
                </div>

                <p className="text-xs text-white/60 leading-relaxed pt-2 border-t border-white/[0.06]">
                  {vehicle.descriptionFa}
                </p>

                {/* Verified Documents */}
                <div className="pt-2">
                  <div className="text-xs font-semibold text-white/80 mb-2">مدارک تایید شده:</div>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] text-xs text-white/70"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{doc.titleFa}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Price History Audit Record */}
            {vehicle.priceHistories && vehicle.priceHistories.length > 0 && (
              <section className="space-y-4">
                <h3 className="text-lg font-bold text-white font-persian flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-[#D4AF37]" />
                  <span>تاریخچه تغییرات قیمت کارشناسی</span>
                </h3>

                <div className="bg-[#0A0A0A] border border-white/[0.08] p-4 space-y-2 text-xs">
                  {vehicle.priceHistories.map((ph) => (
                    <div
                      key={ph.id}
                      className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0"
                    >
                      <div>
                        <span className="text-white/80 font-medium">{ph.changeReason}</span>
                        <span className="text-white/40 font-latin text-[11px] block mt-0.5">
                          {ph.changedAt}
                        </span>
                      </div>
                      <div className="text-left font-latin">
                        <span className="line-through text-white/40 ml-2">
                          {formatPrice(ph.oldPriceToman, currency)}
                        </span>
                        <span className="font-bold text-[#D4AF37]">
                          {formatPrice(ph.newPriceToman, currency)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Sticky Purchase & Appointment Action Module (4 Columns) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              {/* Primary Purchase Card */}
              <div className="bg-[#0A0A0A] border border-[#D4AF37]/40 p-6 space-y-6 shadow-2xl">
                <div>
                  <div className="text-[11px] font-mono tracking-widest text-[#D4AF37] uppercase">
                    ACQUISITION & CONCIERGE
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1">
                    درخواست خرید و بیعانه رسمی
                  </h3>
                  <p className="text-xs text-white/50 mt-1">
                    ثبت پیش‌فاکتور با کد رهگیری و هماهنگی جلسه در شو‌روم اختصاصی.
                  </p>
                </div>

                <div className="space-y-2 border-y border-white/[0.08] py-4 text-xs">
                  <div className="flex justify-between text-white/70">
                    <span>محل استقرار خودرو:</span>
                    <span className="text-white font-medium">{vehicle.locationCityFa}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>وضعیت تحویل:</span>
                    <span className="text-emerald-400 font-medium">آماده تحویل فوری ۲۴ ساعته</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>گارانتی اصالت نوآر:</span>
                    <span className="text-[#D4AF37] font-medium">۱۰۰٪ گارانتی استرداد وجه</span>
                  </div>
                </div>

                {/* Primary CTA */}
                <button
                  onClick={() => setShowPurchaseModal(true)}
                  className="w-full py-4 text-sm font-bold text-[#050505] bg-[#F2F0EA] hover:bg-[#D4AF37] transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>درخواست خرید (۵ مرحله)</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>

                {/* Secondary Appointment Actions */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => setAppointmentModalType('VIEWING')}
                    className="py-2.5 px-2 text-xs font-medium text-white/90 bg-white/[0.04] border border-white/10 hover:border-white/30 transition-colors text-center"
                  >
                    رزرو بازدید حضوری
                  </button>

                  <button
                    onClick={() => setAppointmentModalType('TEST_DRIVE')}
                    className="py-2.5 px-2 text-xs font-medium text-[#D4AF37] bg-white/[0.04] border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-colors text-center"
                  >
                    درخواست تست درایو
                  </button>
                </div>

                {/* PDF Dossier & Brochure Download Button */}
                <button
                  onClick={() => setShowPdfModal(true)}
                  className="w-full mt-3 py-2.5 px-3 text-xs font-semibold text-[#D4AF37] bg-[#D4AF37]/5 border border-[#D4AF37]/40 hover:border-[#D4AF37] hover:bg-[#D4AF37]/15 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>دریافت شناسنامه فنی و شرایط خرید (PDF)</span>
                </button>
              </div>

              {/* Showroom & Concierge Contact Card */}
              <div className="bg-[#0A0A0A] border border-white/[0.08] p-5 space-y-3 text-xs">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Building className="w-4 h-4 text-[#D4AF37]" />
                  <span>دپارتمان فروش نوآر موتورز</span>
                </div>
                <p className="text-white/50 leading-relaxed text-[11px]">
                  مشاوره تخصصی در خصوص پلاک مناطق آزاد، خروج موقت به سرزمین اصلی و استعلام عوارض گمرکی.
                </p>
                <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-white/70">
                  <span>خط ارتباط مستقیم VIP:</span>
                  <span dir="ltr" className="font-mono text-white font-semibold">+98 21 2200 8899</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Vehicles Carousel / Grid */}
        {similarCars.length > 0 && (
          <div className="mt-24 pt-12 border-t border-white/[0.08] space-y-8">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold font-latin">
                SIMILAR ACQUISITIONS
              </div>
              <h2 className="text-2xl font-bold text-white font-persian mt-1">
                خودروهای مشابه پیشنهادی
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarCars.map((car) => (
                <VehicleCard
                  key={car.id}
                  vehicle={car}
                  currency={currency}
                  onSelect={onSelectCar}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <PurchaseModal
          vehicle={vehicle}
          currency={currency}
          onClose={() => setShowPurchaseModal(false)}
        />
      )}

      {/* Appointment Modal */}
      {appointmentModalType && (
        <AppointmentModal
          vehicle={vehicle}
          type={appointmentModalType}
          onClose={() => setAppointmentModalType(null)}
        />
      )}

      {/* PDF Brochure & Dossier Modal */}
      {showPdfModal && (
        <VehiclePdfBrochureModal
          vehicle={vehicle}
          currency={currency}
          onClose={() => setShowPdfModal(false)}
        />
      )}
    </div>
  );
};

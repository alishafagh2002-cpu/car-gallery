import React, { useRef, useState } from 'react';
import { X, Download, ShieldCheck, Printer, CheckCircle2, Award, FileText, Clock, Sparkles, Building, Loader2 } from 'lucide-react';
import { Vehicle, CurrencyMode } from '../../types';
import { formatPrice, formatMileage } from '../../utils/formatters';
import { getSafeImageUrl } from '../../utils/imageHelper';
import { generateVehiclePdf } from '../../utils/pdfGenerator';

interface VehiclePdfBrochureModalProps {
  vehicle: Vehicle;
  currency: CurrencyMode;
  onClose: () => void;
}

export const VehiclePdfBrochureModal: React.FC<VehiclePdfBrochureModalProps> = ({
  vehicle,
  currency,
  onClose,
}) => {
  const dossierRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = async () => {
    if (!dossierRef.current) return;
    setIsGenerating(true);
    try {
      const fileName = `NOIR-MOTORS-${vehicle.brandNameEn}-${vehicle.modelNameEn}-${vehicle.year}`.replace(/\s+/g, '-');
      await generateVehiclePdf(dossierRef.current, fileName);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const primaryImage = getSafeImageUrl(
    vehicle.images.find((img) => img.isPrimary)?.url || vehicle.images[0]?.url
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-[#0A0A0A] border border-[#D4AF37]/50 shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        {/* Top Control Bar */}
        <div className="px-6 py-4 bg-[#0F0F11] border-b border-white/[0.08] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest">
                OFFICIAL VEHICLE DOSSIER & CERTIFICATION
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white font-persian">
                شناسنامه فنی و پرونده حقوقی {vehicle.brandNameFa} {vehicle.modelNameFa}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="px-4 py-2 text-xs font-bold text-[#050505] bg-[#D4AF37] hover:bg-[#F2F0EA] transition-colors flex items-center gap-2 disabled:opacity-50 shadow-[0_0_15px_rgba(212,175,55,0.3)]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>در حال ایجاد PDF...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                  <span>دانلود شد</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>دریافت فایل PDF</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-white/50 hover:text-white hover:bg-white/[0.05] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Container */}
        <div className="overflow-y-auto p-4 sm:p-8 bg-[#050505] flex justify-center flex-grow">
          {/* A4 Sheet Container */}
          <div
            ref={dossierRef}
            className="w-full max-w-[800px] bg-[#070708] text-[#F2F0EA] border border-white/10 p-6 sm:p-10 space-y-8 font-persian relative shadow-2xl"
            style={{ direction: 'rtl' }}
          >
            {/* Background Decorative Gold Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.02] text-center select-none">
              <div className="text-9xl font-bold font-latin">NOIR</div>
            </div>

            {/* Document Header */}
            <div className="border-b border-[#D4AF37]/30 pb-6 flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-mono tracking-[0.25em] text-[#D4AF37] uppercase font-latin font-bold">
                  NOIR MOTORS IRAN · OFFICIAL DOSSIER
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  شناسنامه فنی، ترخیص و ارزش‌گذاری خودرو
                </h1>
                <p className="text-xs text-white/60 mt-1">
                  تاییدیه رسمی دپارتمان کارشناسی خودرو و حقوق گمرکی مناطق آزاد و گذر موقت
                </p>
              </div>

              <div className="text-left text-[11px] font-mono shrink-0 space-y-1 bg-black/60 p-3 border border-white/10">
                <div className="text-white/40 uppercase tracking-widest text-[9px]">DOSSIER REF:</div>
                <div className="text-[#D4AF37] font-bold">NM-{vehicle.id.toUpperCase()}-2026</div>
                <div className="text-white/40 text-[9px] pt-1">تاریخ صدور: {new Date().toLocaleDateString('fa-IR')}</div>
                <div className="text-emerald-400 font-semibold text-[10px]">وضعیت: معتبر و قابل استعلام</div>
              </div>
            </div>

            {/* Vehicle Main Showcase */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="text-xs tracking-widest text-[#D4AF37] uppercase font-latin font-semibold">
                    {vehicle.brandNameEn} / {vehicle.trim || vehicle.modelNameEn} / {vehicle.year}
                  </div>
                  <h2 className="text-2xl font-bold text-white mt-0.5">
                    {vehicle.brandNameFa} {vehicle.modelNameFa}
                  </h2>
                  <p className="text-xs text-white/70 mt-1 max-w-xl">
                    {vehicle.headlineFa}
                  </p>
                </div>

                <div className="bg-[#0F0F12] border border-[#D4AF37]/30 p-3.5 text-left shrink-0">
                  <div className="text-[10px] text-white/40 uppercase tracking-wider">ارزش کارشناسی شده</div>
                  <div className="text-xl font-bold text-white font-latin tabular-nums">
                    {formatPrice(vehicle.priceToman, 'TOMAN')}
                  </div>
                  <div className="text-[11px] text-[#D4AF37] font-latin mt-0.5">
                    معادل {formatPrice(vehicle.priceToman, 'USD')} دلار آمریکا
                  </div>
                </div>
              </div>

              {/* Main Photo Frame */}
              <div className="relative aspect-[16/9] w-full overflow-hidden border border-white/10 bg-black">
                <img
                  src={primaryImage}
                  alt={vehicle.modelNameEn}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 border border-white/10 text-xs">
                  {vehicle.temporaryImport ? (
                    <span className="text-amber-400 flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>پلاک گذر موقت فراجا ({vehicle.temporaryLicenseDaysRemaining || 90} روز مهلت تردد)</span>
                    </span>
                  ) : (
                    <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>پلاک رسمی {vehicle.freeZoneNameFa || 'منطقه آزاد تجاری'}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Customs & Legal Identity Matrix */}
            <div className="bg-[#0E0E10] border border-white/[0.08] p-5 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>وضعیت پرونده گمرکی و حقوقی</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-1">
                <div className="space-y-1">
                  <div className="text-white/40 text-[11px]">نوع پلاک و منطقه:</div>
                  <div className="font-semibold text-white">
                    {vehicle.temporaryImport ? 'گذر موقت سراسر کشور' : vehicle.freeZoneNameFa}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-white/40 text-[11px]">موقعیت فیزیکی خودرو:</div>
                  <div className="font-semibold text-white">
                    شوروم نوآر موتورز {vehicle.locationCityFa}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-white/40 text-[11px]">وضعیت ترخیص و اسناد:</div>
                  <div className="font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>تایید قطعی گمرک / سند دست اول</span>
                  </div>
                </div>
              </div>

              {/* Verified Documents */}
              <div className="pt-3 border-t border-white/[0.06] flex flex-wrap gap-2 text-[11px]">
                {vehicle.documents?.map((doc) => (
                  <span
                    key={doc.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.04] border border-white/[0.08] text-white/80"
                  >
                    <CheckCircle2 className="w-3 h-3 text-[#D4AF37]" />
                    <span>{doc.titleFa}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Technical Specifications Matrix */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#D4AF37]">
                مشخصات فنی و عملکرد (TECHNICAL SPECIFICATIONS)
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-[#0A0A0C] border border-white/[0.06] p-3 space-y-1">
                  <div className="text-white/40 text-[10px]">پیشرانه</div>
                  <div className="font-bold text-white text-[11px] truncate">{vehicle.engine}</div>
                </div>

                <div className="bg-[#0A0A0C] border border-white/[0.06] p-3 space-y-1">
                  <div className="text-white/40 text-[10px]">توان خروجی</div>
                  <div className="font-bold text-white text-[11px] font-latin">{vehicle.enginePower} اسب بخار</div>
                </div>

                <div className="bg-[#0A0A0C] border border-white/[0.06] p-3 space-y-1">
                  <div className="text-white/40 text-[10px]">شتاب ۰ تا ۱۰۰</div>
                  <div className="font-bold text-[#D4AF37] text-[11px] font-latin">
                    {vehicle.specifications.acceleration0to100} ثانیه
                  </div>
                </div>

                <div className="bg-[#0A0A0C] border border-white/[0.06] p-3 space-y-1">
                  <div className="text-white/40 text-[10px]">حداکثر سرعت</div>
                  <div className="font-bold text-white text-[11px] font-latin">
                    {vehicle.specifications.topSpeedKmh} کیلومتر/ساعت
                  </div>
                </div>

                <div className="bg-[#0A0A0C] border border-white/[0.06] p-3 space-y-1">
                  <div className="text-white/40 text-[10px]">گیربکس</div>
                  <div className="font-bold text-white text-[11px] truncate">{vehicle.transmission}</div>
                </div>

                <div className="bg-[#0A0A0C] border border-white/[0.06] p-3 space-y-1">
                  <div className="text-white/40 text-[10px]">محور محرک</div>
                  <div className="font-bold text-white text-[11px] font-latin">{vehicle.driveType}</div>
                </div>

                <div className="bg-[#0A0A0C] border border-white/[0.06] p-3 space-y-1">
                  <div className="text-white/40 text-[10px]">کارکرد کارشناسی</div>
                  <div className="font-bold text-white text-[11px] font-latin">
                    {formatMileage(vehicle.mileage)}
                  </div>
                </div>

                <div className="bg-[#0A0A0C] border border-white/[0.06] p-3 space-y-1">
                  <div className="text-white/40 text-[10px]">رنگ بدنه</div>
                  <div className="font-bold text-white text-[11px] truncate">{vehicle.exteriorColorFa}</div>
                </div>
              </div>
            </div>

            {/* Key Features & Options List */}
            {vehicle.specifications.featuresFa && vehicle.specifications.featuresFa.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#D4AF37]">
                  تجهیزات و آپشن‌های کارخانه‌ای (FACTORY INSTALLED PACKAGES)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-white/80">
                  {vehicle.specifications.featuresFa.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 bg-white/[0.02] p-2 border border-white/[0.04]">
                      <span className="text-[#D4AF37] font-bold">·</span>
                      <span className="leading-tight">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Terms of Acquisition & Certification Stamp */}
            <div className="pt-6 border-t border-[#D4AF37]/30 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              <div className="sm:col-span-8 space-y-2 text-[11px] text-white/60 leading-relaxed">
                <div className="font-bold text-white text-xs">تعهدات و شرایط قرارداد خرید نوآر موتورز:</div>
                <p>
                  ۱. تضمین ۱۰۰٪ اصالت مدارک گمرکی، برگه سبز ترخیص و عدم توقیف پلاک فراجا.
                  ۲. بازرسی کامل رنگ، شاسی و سلامت موتور توسط مهندسین فنی مورد تایید نوآر موتورز قبل از تحویل.
                  ۳. امکان واگذاری و انتقال قطعی سند در دفتر اسناد رسمی همراه با عقد قرارداد بیع رسمی.
                </p>
                <div className="pt-1 text-[#D4AF37] font-mono text-[10px]">
                  پشتیبانی اختصاصی VIP: 021-22008899 · تهران / کیش
                </div>
              </div>

              {/* Official Seal / Stamp Graphic */}
              <div className="sm:col-span-4 flex justify-center">
                <div className="w-36 h-36 rounded-full border-2 border-[#D4AF37]/40 p-2 flex flex-col items-center justify-center text-center rotate-[-4deg] bg-[#D4AF37]/5">
                  <div className="w-full h-full border border-dashed border-[#D4AF37]/60 rounded-full flex flex-col items-center justify-center p-2 space-y-1">
                    <Award className="w-5 h-5 text-[#D4AF37]" />
                    <div className="text-[9px] font-bold text-white">NOIR MOTORS IRAN</div>
                    <div className="text-[8px] text-[#D4AF37] font-semibold">دپارتمان کارشناسی رسمی</div>
                    <div className="text-[7px] text-white/50 font-mono">VIN VERIFIED 2026</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Footer Disclaimer */}
            <div className="pt-4 border-t border-white/[0.06] text-center text-[10px] text-white/30 font-mono">
              CONFIDENTIAL DOCUMENT · GENERATED EXCLUSIVELY BY NOIR MOTORS CLIENT PORTAL · ALL RIGHTS RESERVED
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

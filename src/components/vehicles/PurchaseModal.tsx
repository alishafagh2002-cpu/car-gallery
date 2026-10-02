import React, { useState } from 'react';
import { X, Check, ShieldCheck, ArrowLeft, ArrowRight, CreditCard, Calendar, Phone, User, FileText } from 'lucide-react';
import { Vehicle, CurrencyMode, PurchaseRequestRecord } from '../../types';
import { CarService } from '../../services/api';
import { paymentProviders } from '../../services/paymentProvider';
import { formatPrice } from '../../utils/formatters';
import { ProgressTracker, ProgressStep } from '../common/ProgressTracker';

interface PurchaseModalProps {
  vehicle: Vehicle;
  currency: CurrencyMode;
  onClose: () => void;
  onSuccess?: (request: PurchaseRequestRecord) => void;
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  vehicle,
  currency,
  onClose,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<PurchaseRequestRecord | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [city, setCity] = useState(vehicle.locationCityFa || 'تهران');
  const [contactMethod, setContactMethod] = useState<'PHONE_CALL' | 'WHATSAPP' | 'IN_PERSON'>('PHONE_CALL');
  const [preferredAppointmentDate, setPreferredAppointmentDate] = useState('2026-10-05T11:00');
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyMode>(currency);
  const [paymentProviderId, setPaymentProviderId] = useState<'escrow' | 'shaparak'>('escrow');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation for Step 1
  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim() || fullName.trim().length < 3) {
      errs.fullName = 'لطفاً نام و نام‌خانوادگی کامل را وارد فرمایید.';
    }
    const cleanPhone = phone.replace(/\s+/g, '');
    if (!cleanPhone || !/^(\+98|0)?9\d{9}$/.test(cleanPhone)) {
      errs.phone = 'شماره تلفن همراه معتبر (مثال: 09121234567) وارد نمایید.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1 && currentStep < 5) {
      setCurrentStep((prev) => (prev - 1) as any);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const record = await CarService.submitPurchaseRequest({
        vehicleId: vehicle.id,
        fullName,
        phone,
        nationalId: nationalId || undefined,
        city,
        contactMethod,
        preferredAppointmentDate,
        preferredCurrency: selectedCurrency,
        notes: notes || undefined,
      });

      // Initiate payment provider contract
      const provider = paymentProviders[paymentProviderId];
      if (provider) {
        await provider.initiate({
          amount: vehicle.priceToman,
          currency: selectedCurrency,
          orderId: record.trackingCode,
          userPhone: phone,
          customerName: fullName,
          callbackUrl: window.location.origin + `/request/${record.trackingCode}`,
          description: `بیعانه درخواست خرید خودرو ${vehicle.headlineFa}`,
        });
      }

      setSubmittedRecord(record);
      setCurrentStep(5);
      if (onSuccess) onSuccess(record);
    } catch (err: any) {
      alert(err.message || 'خطا در ثبت درخواست');
    } finally {
      setIsSubmitting(false);
    }
  };

  const workflowSteps: ProgressStep[] = [
    { number: 1, label: 'مشخصات خریدار', description: 'هویت و تماس' },
    { number: 2, label: 'شرایط مالی', description: 'ارز و ودیعه' },
    { number: 3, label: 'روش هماهنگی', description: 'نحوه ارتباط' },
    { number: 4, label: 'جلسه کارشناسی', description: 'تعیین زمان' },
    { number: 5, label: 'صدور پیش‌فاکتور', description: 'کد رهگیری' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#0A0A0A] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/[0.08] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono tracking-widest text-[#D4AF37] uppercase">
              VIP ACQUISITION WORKFLOW · STEP {currentStep} OF 5
            </div>
            <h2 className="text-lg font-bold text-white font-persian mt-0.5">
              {workflowSteps[currentStep - 1]?.label}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cinematic Gold Progress Tracker */}
        <div className="px-6 py-3.5 bg-black/50 border-b border-white/[0.06]">
          <ProgressTracker
            steps={workflowSteps}
            currentStep={currentStep}
            onStepClick={(step) => {
              if (step < currentStep && currentStep < 5) {
                setCurrentStep(step as any);
              }
            }}
          />
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-grow">
          {/* STEP 1: Customer Details */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-white/60 leading-relaxed">
                اطلاعات وارد شده محرمانه بوده و صرفاً جهت استعلام اولیه اهراز هویت و صدور پیش‌فاکتور رسمی در دپارتمان حقوقی نوآر موتورز استفاده می‌گردد.
              </p>

              <div>
                <label className="block text-xs font-medium text-white/80 mb-1.5">
                  نام و نام خانوادگی خریدار (مطابق شناسنامه / پاسپورت) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثال: کیوان سهرابی"
                    className="w-full bg-black/50 border border-white/10 px-4 py-3 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                  <User className="absolute left-3 top-3.5 w-4 h-4 text-white/30" />
                </div>
                {errors.fullName && <p className="text-[11px] text-rose-400 mt-1">{errors.fullName}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1.5">
                    شماره تلفن همراه (جهت تماس کارشناس VIP) *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      dir="ltr"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0912xxxxxxx"
                      className="w-full bg-black/50 border border-white/10 px-4 py-3 text-sm text-white focus:border-[#D4AF37] focus:outline-none font-mono"
                    />
                    <Phone className="absolute left-3 top-3.5 w-4 h-4 text-white/30" />
                  </div>
                  {errors.phone && <p className="text-[11px] text-rose-400 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1.5">
                    کد ملی / شماره پاسپورت (اختیاری)
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    placeholder="0012345678"
                    className="w-full bg-black/50 border border-white/10 px-4 py-3 text-sm text-white focus:border-[#D4AF37] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/80 mb-1.5">
                  شهر سکونت خریدار
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="تهران، اهواز، کیش، مشهد..."
                  className="w-full bg-black/50 border border-white/10 px-4 py-3 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Vehicle Details & Financial Confirmation */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.08] p-4">
                <img
                  src={vehicle.images[0]?.url}
                  alt={vehicle.modelNameEn}
                  className="w-24 h-16 object-cover bg-black"
                />
                <div className="flex-grow">
                  <div className="text-xs text-[#D4AF37] font-semibold">{vehicle.brandNameEn}</div>
                  <div className="text-sm font-bold text-white">{vehicle.modelNameEn}</div>
                  <div className="text-xs text-white/50 mt-0.5">
                    {vehicle.year} · {vehicle.engine} · {vehicle.locationCityFa}
                  </div>
                </div>
              </div>

              <div className="space-y-3 bg-black/40 border border-white/10 p-4 text-xs">
                <div className="flex justify-between py-1.5 border-b border-white/[0.05]">
                  <span className="text-white/60">مبلغ کارشناسی و قیمت خودرو:</span>
                  <span className="font-bold text-white font-latin tabular-nums">
                    {formatPrice(vehicle.priceToman, selectedCurrency, { compact: false })}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/[0.05]">
                  <span className="text-white/60">وضعیت پلاک و مجوز تردد:</span>
                  <span className="text-[#D4AF37]">
                    {vehicle.temporaryImport ? 'گذر موقت گمرکی قابل تمدید' : `پلاک ${vehicle.freeZoneNameFa || 'منطقه آزاد'}`}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-white/60">وضعیت اسناد و ترخیص:</span>
                  <span className="text-emerald-400">سند آماده انتقال رسمی در دفترخانه</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/80 mb-2">
                  ارز مرجع ترجیحی جهت تسویه حساب
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['TOMAN', 'USD', 'AED'] as CurrencyMode[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedCurrency(c)}
                      className={`py-2.5 px-3 text-xs font-semibold border transition-all text-center ${
                        selectedCurrency === c
                          ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white'
                          : 'border-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      {c === 'TOMAN' ? 'میلیارد تومان (IRR)' : c === 'USD' ? 'دلار آمریکا (USD)' : 'درهم امارات (AED)'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Contact & Coordination Preference */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <p className="text-xs text-white/60">
                مشاوران ارشد نوآر موتورز بر اساس اولویت انتخابی با شما ارتباط برقرار خواهند کرد:
              </p>

              <div className="space-y-3">
                {[
                  {
                    id: 'PHONE_CALL',
                    title: 'تماس تلفنی مستقیم توسط مدیر فروش VIP',
                    desc: 'تماس در ساعات کاری جهت هماهنگی فوری، پاسخ به سوالات حقوقی و ارسال اسناد',
                  },
                  {
                    id: 'WHATSAPP',
                    title: 'هماهنگی از طریق پیام‌رسان واتساپ / تلگرام',
                    desc: 'ارسال تصاویر با کیفیت فول HD، ویدیو استارت و برگه کارشناسی رنگ در پیام‌رسان',
                  },
                  {
                    id: 'IN_PERSON',
                    title: 'جلسه حضوری در شو‌روم مرکزی نوآر موتورز',
                    desc: 'پذیرایی در لانژ اختصاصی فرشته تهران یا برج بهکیش کیش همراه با کارشناس معتمد',
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setContactMethod(item.id as any)}
                    className={`p-4 border cursor-pointer transition-all ${
                      contactMethod === item.id
                        ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-white">{item.title}</div>
                      {contactMethod === item.id && <Check className="w-4 h-4 text-[#D4AF37]" />}
                    </div>
                    <div className="text-xs text-white/50 mt-1">{item.desc}</div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium text-white/80 mb-1.5">
                  توضیحات تکمیلی یا درخواست خاص (اختیاری)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="مثال: درخواست بررسی امکان تمدید ۶ ماه دوم گذر موقت..."
                  className="w-full bg-black/50 border border-white/10 px-4 py-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Appointment & Inspection Scheduling */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <p className="text-xs text-white/60">
                تاریخ پیشنهادی جهت رویت حضوری خودرو، تست درایو در پیست اختصاصی و بازبینی اسناد گمرکی:
              </p>

              <div>
                <label className="block text-xs font-medium text-white/80 mb-2">
                  تاریخ و ساعت ترجیحی بازدید
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={preferredAppointmentDate}
                    onChange={(e) => setPreferredAppointmentDate(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 px-4 py-3 text-sm text-white focus:border-[#D4AF37] focus:outline-none font-mono"
                  />
                  <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-white/40" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/80 mb-2">
                  شیوه تسویه و واریز بیعانه رسمی
                </label>
                <div className="space-y-3">
                  <div
                    onClick={() => setPaymentProviderId('escrow')}
                    className={`p-4 border cursor-pointer transition-all ${
                      paymentProviderId === 'escrow'
                        ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                        : 'border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-white">
                        حساب امانی اختصاصی نوآر (بانک مرکزی و دفترخانه)
                      </div>
                      <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    <div className="text-xs text-white/50 mt-1">
                      صدور پیش‌فاکتور با شماره شبا اختصاصی جهت واریز حواله ساتنا بدون سقف کارت به کارت.
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentProviderId('shaparak')}
                    className={`p-4 border cursor-pointer transition-all ${
                      paymentProviderId === 'shaparak'
                        ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                        : 'border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-white">
                        درگاه پرداخت الکترونیک شاپرک (بیعانه اولیه)
                      </div>
                      <CreditCard className="w-4 h-4 text-white/50" />
                    </div>
                    <div className="text-xs text-white/50 mt-1">
                      واریز فوری بیعانه رزرو ۲۴ ساعته تا سقف مجاز کارت‌های شتابی.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Confirmation & Tracking Code */}
          {currentStep === 5 && submittedRecord && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37] flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-[#D4AF37]" />
              </div>

              <div>
                <div className="text-xs tracking-widest text-[#D4AF37] uppercase font-mono">
                  PURCHASE REQUEST CONFIRMED
                </div>
                <h3 className="text-xl font-bold text-white mt-1">
                  درخواست خرید با موفقیت در سامانه ثبت گردید
                </h3>
                <p className="text-xs text-white/60 mt-2 max-w-md mx-auto leading-relaxed">
                  پرونده خرید این خودرو برای واحد حقوقی و کارشناس فروش VIP ارجاع شد. حداکثر ظرف مدت ۲ ساعت کاری با شما تماس گرفته خواهد شد.
                </p>
              </div>

              {/* Tracking Code Box */}
              <div className="bg-black/60 border border-[#D4AF37]/30 p-5 max-w-sm mx-auto text-center">
                <div className="text-[11px] text-white/50 uppercase tracking-widest">
                  کد رهگیری اختصاصی پرونده
                </div>
                <div className="text-2xl font-bold font-mono tracking-widest text-white mt-1 text-[#D4AF37]">
                  {submittedRecord.trackingCode}
                </div>
              </div>

              {/* Details Dossier Recap */}
              <div className="bg-white/[0.02] border border-white/[0.06] p-4 text-right text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between text-white/70">
                  <span>خریدار محترم:</span>
                  <span className="text-white font-medium">{submittedRecord.fullName}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>خودروی انتخابی:</span>
                  <span className="text-white font-medium">{vehicle.modelNameEn}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>روش هماهنگی:</span>
                  <span className="text-white font-medium">
                    {submittedRecord.contactMethod === 'IN_PERSON' ? 'جلسه در شو‌روم VIP' : 'تماس تلفنی اختصاصی'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-white/[0.08] flex items-center justify-between bg-black/40">
          {currentStep > 1 && currentStep < 5 ? (
            <button
              onClick={handlePrev}
              className="px-4 py-2.5 text-xs text-white/70 hover:text-white border border-white/10 flex items-center gap-2"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>مرحله قبل</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs font-semibold text-[#050505] bg-[#F2F0EA] hover:bg-[#D4AF37] transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <span>{currentStep === 4 ? (isSubmitting ? 'در حال ثبت پرونده...' : 'تایید نهایی و ثبت درخواست') : 'مرحله بعد'}</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-3 text-xs font-semibold text-[#050505] bg-[#D4AF37] hover:bg-white transition-colors"
            >
              بستن و بازگشت به بازار
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

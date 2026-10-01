import React from 'react';
import { ShieldCheck, Award, FileText, Landmark, Users } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (path: string) => void;
  onOpenConsultation: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onOpenConsultation }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-[#F2F0EA] py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Header Manifesto */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold font-latin">
            NOIR MOTORS IRAN · THE MANIFESTO
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white font-persian leading-tight">
            تعریف دوباره تجربه خرید خودروهای فاخر
          </h1>
          <p className="text-sm sm:text-base text-white/70 leading-relaxed font-persian">
            نوآر موتورز با هدف پایان‌دادن به عدم‌قطعیت و چالش‌های حقوقی در معامله خودروهای مناطق آزاد و گذر موقت پایه‌گذاری شد.
          </p>
        </div>

        {/* Feature Editorial Image */}
        <div className="relative aspect-[21/9] w-full border border-white/10 overflow-hidden bg-black">
          <img
            src="/src/assets/images/hero_luxury_sedan_1790889996887.jpg"
            alt="Noir Motors Showroom Pavilion"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#0A0A0A] border border-white/[0.08] p-8 space-y-4">
            <div className="p-3 bg-white/[0.04] text-[#D4AF37] w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-persian">کارشناسی و اصالت بی قید و شرط</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              هیچ اتومبیلی بدون گذراندن چک‌لیست ۱۰۰ نقطه‌ای شامل بازرسی شاسی با لیزر، سلامت موتور و گیربکس و مطابقت VIN با پروانه ترخیص وارد سامانه نمی‌شود.
            </p>
          </div>

          <div className="bg-[#0A0A0A] border border-white/[0.08] p-8 space-y-4">
            <div className="p-3 bg-white/[0.04] text-[#D4AF37] w-fit">
              <Landmark className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-persian">تسلط کامل بر حقوق گمرکی</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              تیم حقوقی ما متخصص در سامانه‌های EPL، کارنه دوپاساژ و قوانین ترخیص خودروهای مناطق آزاد هفت‌گانه ایران، ریسک تمدید گذر موقت را به صفر می‌رساند.
            </p>
          </div>

          <div className="bg-[#0A0A0A] border border-white/[0.08] p-8 space-y-4">
            <div className="p-3 bg-white/[0.04] text-[#D4AF37] w-fit">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-persian">همراهی VIP تا پلاک نهایی</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              از اولین مشاوره تخصصی تا هماهنگی جلسه در شو‌روم‌های فرشته و کیش، عقد قرارداد رسمی در دفتر اسناد رسمی و تحویل با خودروبر اختصاصی.
            </p>
          </div>
        </div>

        {/* Narrative Section */}
        <div className="bg-[#0A0A0A] border border-white/[0.08] p-8 sm:p-12 space-y-6">
          <h2 className="text-2xl font-bold text-white font-persian">
            چرا مناطق آزاد و گذر موقت؟
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-white/70 leading-relaxed font-persian">
            <p>
              محدودیت‌های واردات خودرو در سال‌های گذشته، دسترسی علاقه‌مندان و متخصصان به جدیدترین فناوری‌های صنعت خودروسازی جهان را محدود کرده بود. مناطق آزاد تجاری ایران نظیر کیش، اروند، قشم و انزلی بستری استثنایی را مهیا ساختند تا بدون عوارض سنگین پلاک ملی، جدیدترین دستاوردهای مهندسی پورشه، مرسدس بنز، ب‌ام‌و و لکسوس در دسترس قرار گیرند.
            </p>
            <p>
              نوآر موتورز این جریان را شفاف، سازمان‌یافته و امن ساخته است تا هر خریدار، با اعتماد کامل به آینده سرمایه‌گذاری و مدارک حقوقی، خودروی رویایی خود را انتخاب کند.
            </p>
          </div>

          <div className="pt-6 border-t border-white/[0.06] flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate('/cars')}
              className="px-6 py-3 text-xs font-bold text-[#050505] bg-[#F2F0EA] hover:bg-[#D4AF37] transition-colors"
            >
              مشاهده تمامی موجودی خودروها
            </button>
            <button
              onClick={onOpenConsultation}
              className="px-6 py-3 text-xs font-medium text-white border border-white/20 hover:border-white/60 transition-colors"
            >
              درخواست جلسه اختصاصی
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

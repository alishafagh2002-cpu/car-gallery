import React from 'react';
import { ShieldCheck, Phone, MapPin, Clock, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#050505] border-t border-white/[0.08] text-[#F2F0EA]/70 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Manifesto */}
          <div className="space-y-4">
            <span className="font-luxury text-xl tracking-[0.2em] font-bold text-white block">
              NOIR MOTORS
            </span>
            <p className="text-xs leading-relaxed text-white/60">
              سامانه تخصصی کارشناسی، اصالت‌سنجی و مبادله سوپراسپرت‌ها و خودروهای لوکس مناطق آزاد و گذر موقت در سراسر ایران. تعهد به شفافیت کامل مدارک و همراهی گام‌به‌گام حقوقی.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-[#D4AF37]">
              <ShieldCheck className="w-4 h-4" />
              <span>کارشناسی رسمی ۱۰۰ قسمتی رنگ و فنی</span>
            </div>
          </div>

          {/* Free Zones Gateway */}
          <div className="space-y-3">
            <h4 className="text-white font-medium text-xs tracking-wider uppercase">
              مناطق آزاد ویژه
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('/locations/kish')}
                  className="hover:text-white transition-colors flex items-center justify-between w-full text-right"
                >
                  <span>منطقه آزاد کیش</span>
                  <ArrowUpRight className="w-3 h-3 opacity-40" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/locations/arvand')}
                  className="hover:text-white transition-colors flex items-center justify-between w-full text-right"
                >
                  <span>منطقه آزاد اروند (اهواز/آبادان)</span>
                  <ArrowUpRight className="w-3 h-3 opacity-40" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/locations/qeshm')}
                  className="hover:text-white transition-colors flex items-center justify-between w-full text-right"
                >
                  <span>منطقه آزاد قشم</span>
                  <ArrowUpRight className="w-3 h-3 opacity-40" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/locations/anzali')}
                  className="hover:text-white transition-colors flex items-center justify-between w-full text-right"
                >
                  <span>منطقه آزاد انزلی</span>
                  <ArrowUpRight className="w-3 h-3 opacity-40" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/locations/chabahar')}
                  className="hover:text-white transition-colors flex items-center justify-between w-full text-right"
                >
                  <span>منطقه آزاد چابهار</span>
                  <ArrowUpRight className="w-3 h-3 opacity-40" />
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Access */}
          <div className="space-y-3">
            <h4 className="text-white font-medium text-xs tracking-wider uppercase">
              دسترسی سریع
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/cars')} className="hover:text-white transition-colors">
                  فهرست موجودی خودروها
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/cars?temporaryImport=true')} className="hover:text-white transition-colors">
                  خودروهای گذر موقت
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-white transition-colors">
                  درباره نوآر موتورز
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-white transition-colors">
                  رزرو مشاوره حضوری
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/admin')} className="text-[#D4AF37]/80 hover:text-[#D4AF37] transition-colors">
                  پنل مدیریت متمرکز
                </button>
              </li>
            </ul>
          </div>

          {/* Showroom Contacts */}
          <div className="space-y-3">
            <h4 className="text-white font-medium text-xs tracking-wider uppercase">
              دفاتر و شو‌روم‌های مرکزی
            </h4>
            <div className="space-y-2.5 text-xs text-white/60">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>تهران: خیابان فرشته (شهید فیاضی)، برج نگین، طبقه VIP</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>کیش: بلوار ایران، برج مالی بهکیش</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span dir="ltr" className="font-mono text-white/80">+98 21 2200 8899</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>شنبه تا پنجشنبه: ۱۰:۰۰ الی ۲۱:۰۰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hairline divider & Bottom quiet legal text */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between text-xs text-white/40 gap-4">
          <p>
            © {new Date().getFullYear()} NOIR MOTORS IRAN. تمامی حقوق مادی و معنوی محفوظ است.
          </p>
          <p className="text-[11px] text-white/30 text-center md:text-left">
            کلیه معاملات تحت نظارت وکلای پایه یک دادگستری و استعلام رسمی سامانه گمرک و پلیس راهور انجام می‌پذیرد.
          </p>
        </div>
      </div>
    </footer>
  );
};

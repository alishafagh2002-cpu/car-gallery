import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('مشاوره خرید خودرو گذر موقت');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F2F0EA] py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold font-latin">
            NOIR MOTORS CONCIERGE & SHOWROOMS
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white font-persian">
            ارتباط مستقیم و دفاتر مرکزی
          </h1>
          <p className="text-xs sm:text-sm text-white/60">
            جهت استعلام مدارک، رزرو وقت مشاوره در شو‌روم VIP یا پیگیری پرونده با کارشناسان ارشد تماس حاصل فرمایید.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Contact Info & Showrooms (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Showrooms Information */}
            <div className="bg-[#0A0A0A] border border-white/[0.08] p-6 space-y-6">
              <h3 className="text-sm font-bold text-white font-persian border-b border-white/[0.06] pb-3">
                شو‌روم‌ها و دفاتر پذیرایی VIP
              </h3>

              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <div className="font-semibold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#D4AF37]" />
                    <span>دفتر مرکزی و لانژ پذیرایی تهران</span>
                  </div>
                  <p className="text-white/60 pr-6 leading-relaxed">
                    خیابان فرشته (شهید فیاضی)، بالاتر از خیابان چناران، برج نگین فرشته، طبقه ۱۵ VIP
                  </p>
                  <p className="text-[#D4AF37] font-mono pr-6 pt-1 text-[11px]" dir="ltr">
                    +98 21 2200 8899
                  </p>
                </div>

                <div className="space-y-1.5 pt-4 border-t border-white/[0.04]">
                  <div className="font-semibold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#D4AF37]" />
                    <span>مرکز تحویل و ترخیص جزیره کیش</span>
                  </div>
                  <p className="text-white/60 pr-6 leading-relaxed">
                    بلوار ایران، میدان سنایی، برج مالی بهکیش، طبقه همکف تجاری، پلاک ۴
                  </p>
                  <p className="text-[#D4AF37] font-mono pr-6 pt-1 text-[11px]" dir="ltr">
                    +98 76 4442 7070
                  </p>
                </div>

                <div className="space-y-1.5 pt-4 border-t border-white/[0.04]">
                  <div className="font-semibold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#D4AF37]" />
                    <span>ساعات کاری شو‌روم‌ها</span>
                  </div>
                  <p className="text-white/60 pr-6 leading-relaxed">
                    شنبه تا چهارشنبه: ۱۰:۰۰ الی ۲۱:۰۰ | پنجشنبه‌ها: ۱۰:۰۰ الی ۱۷:۰۰ (جمعه‌ها با هماهنگی قبلی)
                  </p>
                </div>
              </div>
            </div>

            {/* Social & Messengers */}
            <div className="bg-[#0A0A0A] border border-white/[0.08] p-6 space-y-4">
              <h3 className="text-sm font-bold text-white font-persian">
                شبکه‌های ارتباطی مستقیم
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <a
                  href="https://wa.me/989121112233"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-white/[0.03] border border-white/10 hover:border-[#D4AF37] transition-colors flex items-center justify-between"
                >
                  <span>واتساپ VIP</span>
                  <span className="text-[#D4AF37] font-mono">WhatsApp</span>
                </a>
                <a
                  href="https://t.me/noirmotors_ir"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-white/[0.03] border border-white/10 hover:border-[#D4AF37] transition-colors flex items-center justify-between"
                >
                  <span>کانال تلگرام</span>
                  <span className="text-[#D4AF37] font-mono">Telegram</span>
                </a>
                <a
                  href="https://instagram.com/noirmotors_ir"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-white/[0.03] border border-white/10 hover:border-[#D4AF37] transition-colors flex items-center justify-between"
                >
                  <span>صفحه اینستاگرام</span>
                  <span className="text-[#D4AF37] font-mono">Instagram</span>
                </a>
                <div className="p-3 bg-white/[0.03] border border-white/10 flex items-center justify-between">
                  <span>پشتیبانی ایمیل</span>
                  <span className="font-mono text-white/50 text-[10px]">vip@noir.ir</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact & Inquiry Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#0A0A0A] border border-white/[0.08] p-8 sm:p-10">
            {submitted ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center mx-auto text-[#D4AF37]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white font-persian">
                  پیام شما با موفقیت به واحد تشریفات ارجاع شد
                </h3>
                <p className="text-xs text-white/60 max-w-md mx-auto leading-relaxed">
                  مشاوران ارشد نوآر موتورز ظرف مدت کمتر از ۲ ساعت کاری جهت هماهنگی جلسه و ارسال کاتالوگ با شما تماس خواهند گرفت.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 px-6 py-2.5 text-xs font-semibold bg-[#F2F0EA] text-[#050505] hover:bg-[#D4AF37]"
                >
                  ارسال پیام جدید
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-white font-persian">
                    فرم رزرو وقت مشاوره و کارشناسی خودرو
                  </h3>
                  <p className="text-xs text-white/50 mt-1">
                    لطفاً اطلاعات خود را وارد فرمایید تا مدیر فروش مجرب اختصاصی به شما معرفی گردد.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/80 mb-1.5">
                      نام و نام‌خانوادگی *
                    </label>
                    <input
                      required
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="مثال: مهندس رادین شمس"
                      className="w-full bg-black/60 border border-white/10 px-4 py-3 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-white/80 mb-1.5">
                      شماره تماس مستقیم *
                    </label>
                    <input
                      required
                      dir="ltr"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0912xxxxxxx"
                      className="w-full bg-black/60 border border-white/10 px-4 py-3 text-xs text-white focus:border-[#D4AF37] focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-white/80 mb-1.5">
                    موضوع درخواست مشاوره
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 px-4 py-3 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="مشاوره خرید خودرو گذر موقت">مشاوره خرید خودرو گذر موقت (سراسری)</option>
                    <option value="خرید خودرو در منطقه آزاد کیش">خرید خودرو در منطقه آزاد کیش</option>
                    <option value="خرید خودرو در منطقه آزاد اروند">خرید خودرو در منطقه آزاد اروند</option>
                    <option value="کارشناسی رنگ و اسناد گمرکی">کارشناسی رنگ و استعلام اسناد گمرکی</option>
                    <option value="سفارش گذاری و واردات خودروی خاص">سفارش‌گذاری و واردات خودروی خاص</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-white/80 mb-1.5">
                    متن پیام یا مشخصات خودروی مدنظر
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="مدل خودرو، بودجه تقریبی، یا سوالات حقوقی مربوط به ترخیص و پلاک..."
                    className="w-full bg-black/60 border border-white/10 px-4 py-3 text-xs text-white focus:border-[#D4AF37] focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 text-xs font-bold text-[#050505] bg-[#F2F0EA] hover:bg-[#D4AF37] transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'در حال ارسال پیام...' : 'ارسال درخواست به دپارتمان تشریفات'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-white/40 pt-2 border-t border-white/[0.04]">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>تمامی اطلاعات ارسالی در سرور اختصاصی نوآر موتورز رمزنگاری می‌شوند.</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

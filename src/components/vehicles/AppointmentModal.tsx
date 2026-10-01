import React, { useState } from 'react';
import { X, Check, Calendar, Phone, User, Clock, MapPin, Gauge } from 'lucide-react';
import { Vehicle } from '../../types';
import { CarService } from '../../services/api';

interface AppointmentModalProps {
  vehicle: Vehicle;
  type: 'VIEWING' | 'TEST_DRIVE';
  onClose: () => void;
  onSuccess?: (trackingCode: string) => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  vehicle,
  type,
  onClose,
  onSuccess,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('2026-10-06');
  const [timeSlot, setTimeSlot] = useState<'MORNING' | 'AFTERNOON' | 'EVENING'>('AFTERNOON');
  const [showroomLocation, setShowroomLocation] = useState(
    vehicle.freeZoneSlug === 'kish'
      ? 'شو‌روم جزیره کیش (برج مالی بهکیش)'
      : vehicle.freeZoneSlug === 'arvand'
      ? 'شو‌روم اهواز (بلوار پاسداران)'
      : 'شو‌روم مرکزی تهران (خیابان فرشته)'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedCode, setConfirmedCode] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;
    setIsSubmitting(true);
    try {
      const record = await CarService.submitViewingRequest({
        vehicleId: vehicle.id,
        fullName,
        phone,
        preferredDate,
        preferredTimeSlot: timeSlot,
        showroomLocation,
        requestType: type,
      });
      setConfirmedCode(record.trackingCode);
      if (onSuccess) onSuccess(record.trackingCode);
    } catch (err: any) {
      alert(err.message || 'خطا در ثبت نوبت');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 shadow-2xl p-6 overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37] uppercase">
            {type === 'TEST_DRIVE' ? <Gauge className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
            <span>{type === 'TEST_DRIVE' ? 'VIP TEST DRIVE BOOKING' : 'PRIVATE SHOWROOM VIEWING'}</span>
          </div>
          <button onClick={onClose} className="p-1.5 text-white/50 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {confirmedCode ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center mx-auto text-[#D4AF37]">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-persian">
              نوبت {type === 'TEST_DRIVE' ? 'تست درایو' : 'بازدید حضوری'} با موفقیت رزرو شد
            </h3>
            <p className="text-xs text-white/60">
              کد پیگیری نوبت شما:
              <span className="font-mono font-bold text-[#D4AF37] block text-xl mt-1">
                {confirmedCode}
              </span>
            </p>
            <p className="text-[11px] text-white/40">
              همکاران تشریفات شو‌روم برای هماهنگی نهایی ساعت و پذیرایی با شما تماس خواهند گرفت.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 text-xs font-semibold bg-[#F2F0EA] text-[#050505] hover:bg-[#D4AF37]"
            >
              متشکرم، بستن
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="pt-4 space-y-4">
            <div className="text-xs text-white/50">
              رزرو برای: <span className="text-white font-semibold">{vehicle.brandNameEn} {vehicle.modelNameEn}</span>
            </div>

            <div>
              <label className="block text-xs text-white/80 mb-1">نام و نام‌خانوادگی *</label>
              <input
                required
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="مثال: رامین فرهمند"
                className="w-full bg-black/60 border border-white/10 px-3.5 py-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-white/80 mb-1">شماره همراه *</label>
              <input
                required
                dir="ltr"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912xxxxxxx"
                className="w-full bg-black/60 border border-white/10 px-3.5 py-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-white/80 mb-1">تاریخ پیشنهادی</label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-white/80 mb-1">بازه زمانی</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value as any)}
                  className="w-full bg-black/60 border border-white/10 px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="MORNING">صبح (۱۰ الی ۱۳)</option>
                  <option value="AFTERNOON">عصر (۱۵ الی ۱۸)</option>
                  <option value="EVENING">شب (۱۸ الی ۲۱)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/80 mb-1">محل شو‌روم انتخابی</label>
              <select
                value={showroomLocation}
                onChange={(e) => setShowroomLocation(e.target.value)}
                className="w-full bg-black/60 border border-white/10 px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="شو‌روم مرکزی تهران (خیابان فرشته)">شو‌روم مرکزی تهران (خیابان فرشته)</option>
                <option value="شو‌روم جزیره کیش (برج مالی بهکیش)">شو‌روم جزیره کیش (برج مالی بهکیش)</option>
                <option value="شو‌روم اهواز (بلوار پاسداران)">شو‌روم اهواز (بلوار پاسداران اروند)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 py-3 text-xs font-semibold text-[#050505] bg-[#F2F0EA] hover:bg-[#D4AF37] transition-colors"
            >
              {isSubmitting ? 'در حال ثبت نوبت...' : 'تایید و دریافت کد پیگیری نوبت'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

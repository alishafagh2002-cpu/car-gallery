import React, { useState, useEffect } from 'react';
import { Clock, Flame, Sparkles } from 'lucide-react';

interface AuctionCountdownProps {
  targetDate?: string;
  label?: string;
  compact?: boolean;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export const AuctionCountdown: React.FC<AuctionCountdownProps> = ({
  targetDate,
  label = 'مزایده ویژه VIP',
  compact = false,
}) => {
  // Generate deterministic end time ~48 to 72 hours from fixed seed date or dynamic future target
  const [endTime] = useState<number>(() => {
    if (targetDate) {
      return new Date(targetDate).getTime();
    }
    // Default: 2 days, 14 hours, 45 minutes from current session time
    return Date.now() + (2 * 24 * 60 * 60 + 14 * 60 * 60 + 45 * 60) * 1000;
  });

  const calculateTimeRemaining = (): TimeRemaining => {
    const total = endTime - Date.now();
    if (total <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return { days, hours, minutes, seconds, isExpired: false };
  };

  const [time, setTime] = useState<TimeRemaining>(calculateTimeRemaining);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md border border-[#D4AF37]/50 px-2 py-1 text-[10px] text-white shadow-[0_0_12px_rgba(212,175,55,0.25)]">
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500" />
        </span>
        <span className="text-[#D4AF37] font-semibold text-[9px]">{label}:</span>
        <div className="flex items-center gap-0.5 font-mono font-bold text-white tabular-nums tracking-wider" dir="ltr">
          {time.days > 0 && <span>{time.days}d:</span>}
          <span>{pad(time.hours)}</span>:
          <span>{pad(time.minutes)}</span>:
          <span className="text-[#D4AF37]">{pad(time.seconds)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-black/80 via-[#0A0A0C]/90 to-black/80 backdrop-blur-xl border border-[#D4AF37]/60 p-2.5 sm:p-3 shadow-[0_4px_24px_rgba(212,175,55,0.2)]">
      {/* Top Tag */}
      <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
          <span className="text-[11px] font-bold text-white">{label}</span>
        </div>
        <span className="text-[9px] font-mono tracking-widest text-[#D4AF37] uppercase bg-[#D4AF37]/10 px-1.5 py-0.5 border border-[#D4AF37]/30">
          AUCTION ENDING
        </span>
      </div>

      {/* Countdown Digits Matrix */}
      <div className="grid grid-cols-4 gap-1.5 text-center font-mono" dir="ltr">
        {/* Days */}
        <div className="bg-black/60 border border-white/10 p-1">
          <div className="text-xs sm:text-sm font-bold text-white tabular-nums">{pad(time.days)}</div>
          <div className="text-[8px] text-white/40 font-persian">روز</div>
        </div>

        {/* Hours */}
        <div className="bg-black/60 border border-white/10 p-1">
          <div className="text-xs sm:text-sm font-bold text-white tabular-nums">{pad(time.hours)}</div>
          <div className="text-[8px] text-white/40 font-persian">ساعت</div>
        </div>

        {/* Minutes */}
        <div className="bg-black/60 border border-white/10 p-1">
          <div className="text-xs sm:text-sm font-bold text-white tabular-nums">{pad(time.minutes)}</div>
          <div className="text-[8px] text-white/40 font-persian">دقیقه</div>
        </div>

        {/* Seconds */}
        <div className="bg-black/60 border border-[#D4AF37]/40 p-1 shadow-[0_0_8px_rgba(212,175,55,0.2)]">
          <div className="text-xs sm:text-sm font-bold text-[#D4AF37] tabular-nums">{pad(time.seconds)}</div>
          <div className="text-[8px] text-[#D4AF37]/70 font-persian">ثانیه</div>
        </div>
      </div>
    </div>
  );
};

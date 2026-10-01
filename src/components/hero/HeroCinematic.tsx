import React, { useState } from 'react';
import { ChevronDown, ArrowLeft, Box, Sparkles } from 'lucide-react';
import { VehicleThreeCanvas } from './VehicleThreeCanvas';

interface HeroCinematicProps {
  onExploreCars: () => void;
  onOpenConsultation: () => void;
}

export const HeroCinematic: React.FC<HeroCinematicProps> = ({
  onExploreCars,
  onOpenConsultation,
}) => {
  const [viewMode, setViewMode] = useState<'CINEMATIC_PHOTO' | 'THREE_3D'>('CINEMATIC_PHOTO');

  return (
    <section className="relative w-full h-[calc(100vh-80px)] min-h-[640px] max-h-[1050px] overflow-hidden bg-[#050505] flex items-center">
      {/* Background Layer: High-impact cinematic photograph OR Three.js 3D spatial canvas */}
      <div className="absolute inset-0 z-0">
        {viewMode === 'THREE_3D' ? (
          <VehicleThreeCanvas interactive={true} />
        ) : (
          <div className="relative w-full h-full">
            <img
              src="/src/assets/images/hero_luxury_hypercar_1790889964433.jpg"
              alt="NOIR MOTORS Flagship Hypercar"
              className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
            />
            {/* Measured luxury contrast scrims */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-[#050505]/60" />
            <div className="absolute inset-0 bg-radial from-transparent via-[#050505]/50 to-[#050505]" />
          </div>
        )}
      </div>

      {/* Mode Switcher Floating Pill in Hero (Toggle between 3D Canvas and Cinematic Photography) */}
      <div className="absolute top-8 left-6 z-20 hidden sm:flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 p-1 text-xs">
        <button
          onClick={() => setViewMode('CINEMATIC_PHOTO')}
          className={`px-3 py-1.5 transition-colors ${
            viewMode === 'CINEMATIC_PHOTO'
              ? 'bg-white/15 text-white font-medium'
              : 'text-white/50 hover:text-white'
          }`}
        >
          روایت سینمایی
        </button>
        <button
          onClick={() => setViewMode('THREE_3D')}
          className={`px-3 py-1.5 flex items-center gap-1.5 transition-colors ${
            viewMode === 'THREE_3D'
              ? 'bg-[#D4AF37]/20 text-[#D4AF37] font-medium border border-[#D4AF37]/30'
              : 'text-white/50 hover:text-white'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>استودیو سه‌بعدی Three.js</span>
        </button>
      </div>

      {/* Hero Content Overlay Layer */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-8 pb-16 flex flex-col justify-between h-full">
        {/* Top subtle brand badge */}
        <div className="pt-4">
          <div className="inline-flex items-center gap-2 text-xs tracking-widest text-[#D4AF37] uppercase">
            <span className="w-2 h-[1px] bg-[#D4AF37]" />
            <span>EXECUTIVE PERSIAN AUTOMOTIVE CURATION</span>
            <span className="w-2 h-[1px] bg-[#D4AF37]" />
          </div>
        </div>

        {/* Central Typographic Manifesto */}
        <div className="max-w-3xl space-y-6">
          <h1
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#F2F0EA] leading-[1.2] font-persian"
            style={{ textWrap: 'balance' }}
          >
            خودرو، فراتر از یک انتخاب.
          </h1>

          <p
            className="text-lg sm:text-xl text-[#F2F0EA]/80 font-normal leading-relaxed max-w-2xl font-persian"
            style={{ textWrap: 'balance' }}
          >
            مجموعه‌ای منتخب از خودروهای مناطق آزاد و گذر موقت.
          </p>

          <p className="text-xs sm:text-sm text-[#F2F0EA]/55 leading-relaxed max-w-xl">
            اصالت‌سنجی حقوقی، پلاک رسمی مناطق آزاد کیش، اروند، قشم، انزلی و ترخیص قطعی گذر موقت همراه با استعلام گمرکی و کارشناسی تخصصی.
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={onExploreCars}
              className="px-8 py-4 text-sm font-semibold tracking-wide text-[#050505] bg-[#F2F0EA] hover:bg-[#D4AF37] transition-all flex items-center gap-3 group shadow-2xl"
            >
              <span>مشاهده خودروها</span>
              <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenConsultation}
              className="px-8 py-4 text-sm font-medium tracking-wide text-[#F2F0EA] bg-transparent border border-white/20 hover:border-white/60 hover:bg-white/[0.04] transition-all"
            >
              مشاوره خرید
            </button>
          </div>
        </div>

        {/* Bottom Metrics Bar & Scroll Indicator */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          {/* Unboxed Metadata Metrics (Zero-Pill Discipline) */}
          <div className="flex items-center gap-8 text-xs text-white/70">
            <div>
              <div className="text-xl font-bold text-white font-latin tabular-nums">۲۰+</div>
              <div className="text-[11px] text-white/40 mt-0.5">خودروی کارشناسی شده</div>
            </div>
            <div className="h-6 w-[1px] bg-white/10" />
            <div>
              <div className="text-xl font-bold text-white font-latin tabular-nums">۶</div>
              <div className="text-[11px] text-white/40 mt-0.5">منطقه آزاد تجاری</div>
            </div>
            <div className="h-6 w-[1px] bg-white/10" />
            <div>
              <div className="text-xl font-bold text-[#D4AF37] font-latin tabular-nums">۱۰۰٪</div>
              <div className="text-[11px] text-white/40 mt-0.5">تضمین اصالت اسناد</div>
            </div>
          </div>

          {/* Scroll cue */}
          <button
            onClick={onExploreCars}
            className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors self-start sm:self-auto"
          >
            <span>کاوش در کلکسیون</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
};

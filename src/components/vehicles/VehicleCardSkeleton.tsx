import React from 'react';

interface VehicleCardSkeletonProps {
  className?: string;
}

export const VehicleCardSkeleton: React.FC<VehicleCardSkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`group relative bg-[#0A0A0A] border border-white/[0.08] flex flex-col justify-between overflow-hidden luxury-shimmer ${className}`}
      aria-hidden="true"
    >
      {/* 1. Media Aspect Frame Placeholder */}
      <div className="relative aspect-[16/10] w-full bg-[#111113] overflow-hidden">
        {/* Subtle radial depth */}
        <div className="absolute inset-0 bg-radial from-white/[0.02] to-black/60" />

        {/* Top-left favorite button ghost */}
        <div className="absolute top-3 left-3 w-8 h-8 bg-white/[0.04] border border-white/[0.06]" />

        {/* Center subtle car silhouette icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-16 h-8 border border-[#D4AF37] rounded-sm transform -skew-x-12" />
        </div>

        {/* Bottom-right Plate Status Ghost */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded-full bg-[#D4AF37]/20" />
          <div className="h-3 w-24 bg-[#D4AF37]/20 rounded-xs" />
        </div>

        {/* Subtle dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-90" />
      </div>

      {/* 2. Card Body Content Placeholder */}
      <div className="p-5 sm:p-6 flex flex-col justify-between flex-grow space-y-4">
        <div>
          {/* Top Brand / Year Row */}
          <div className="flex items-center justify-between mb-2">
            <div className="h-2.5 w-16 bg-[#D4AF37]/30 rounded-xs" />
            <div className="h-2.5 w-10 bg-white/10 rounded-xs" />
          </div>

          {/* Model Title */}
          <div className="h-5 w-4/5 bg-white/15 rounded-xs mb-2" />
          <div className="h-3.5 w-2/5 bg-white/10 rounded-xs mb-3" />

          {/* Headline snippet */}
          <div className="space-y-1.5">
            <div className="h-2.5 w-full bg-white/[0.06] rounded-xs" />
            <div className="h-2.5 w-3/4 bg-white/[0.04] rounded-xs" />
          </div>
        </div>

        {/* 3. Performance Matrix Grid Ghost */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/[0.05] text-center">
          <div className="space-y-1.5 flex flex-col items-center">
            <div className="h-2 w-8 bg-white/10 rounded-xs" />
            <div className="h-3 w-12 bg-white/20 rounded-xs" />
          </div>
          <div className="space-y-1.5 flex flex-col items-center border-x border-white/[0.05]">
            <div className="h-2 w-8 bg-white/10 rounded-xs" />
            <div className="h-3 w-12 bg-[#D4AF37]/30 rounded-xs" />
          </div>
          <div className="space-y-1.5 flex flex-col items-center">
            <div className="h-2 w-8 bg-white/10 rounded-xs" />
            <div className="h-3 w-14 bg-white/20 rounded-xs" />
          </div>
        </div>

        {/* 4. Bottom Price & Action Ghost */}
        <div className="pt-2 flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="h-2 w-14 bg-white/10 rounded-xs" />
            <div className="h-4.5 w-28 bg-[#D4AF37]/30 rounded-xs" />
          </div>

          <div className="h-8 w-24 bg-white/[0.06] border border-white/[0.08]" />
        </div>
      </div>
    </div>
  );
};

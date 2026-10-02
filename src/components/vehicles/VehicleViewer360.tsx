import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, Play, Pause, ChevronRight, ChevronLeft } from 'lucide-react';
import { Vehicle } from '../../types';

interface VehicleViewer360Props {
  vehicle: Vehicle;
}

export const VehicleViewer360: React.FC<VehicleViewer360Props> = ({ vehicle }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const totalFrames = 36; // 36 steps of 10 degrees = 360°

  // Auto-rotation timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRotating) {
      interval = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % totalFrames);
      }, 90);
    }
    return () => clearInterval(interval);
  }, [isRotating, totalFrames]);

  // Drag interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    setIsRotating(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - startXRef.current;
    if (Math.abs(delta) > 10) {
      const step = delta > 0 ? -1 : 1;
      setCurrentFrame((prev) => (prev + step + totalFrames) % totalFrames);
      startXRef.current = e.clientX;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startXRef.current = e.touches[0].clientX;
    setIsRotating(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const delta = e.touches[0].clientX - startXRef.current;
    if (Math.abs(delta) > 12) {
      const step = delta > 0 ? -1 : 1;
      setCurrentFrame((prev) => (prev + step + totalFrames) % totalFrames);
      startXRef.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const currentAngle = currentFrame * 10;
  const getPerspectiveLabel = (angle: number) => {
    if (angle >= 340 || angle <= 20) return 'نمای روبرو (Front)';
    if (angle > 20 && angle < 70) return 'سه‌رخ جلو راست (Quarter Front)';
    if (angle >= 70 && angle <= 110) return 'نیم‌رخ راست (Profile)';
    if (angle > 110 && angle < 160) return 'سه‌رخ عقب راست (Quarter Rear)';
    if (angle >= 160 && angle <= 200) return 'نمای پشت (Rear)';
    if (angle > 200 && angle < 250) return 'سه‌رخ عقب چپ (Quarter Rear)';
    if (angle >= 250 && angle <= 290) return 'نیم‌رخ چپ (Profile)';
    return 'سه‌رخ جلو چپ (Quarter Front)';
  };

  // Pick corresponding visual asset
  const baseImg = vehicle.images[0]?.url || '/images/hero_supercar_studio_1790889986619.jpg';

  return (
    <div
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="relative w-full aspect-[16/9] bg-[#050505] border border-white/[0.08] overflow-hidden select-none flex flex-col justify-between"
    >
      {/* 360 Visual Render with Dynamic Angle Drift */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full h-full relative cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden"
      >
        <img
          src={baseImg}
          alt={`زاویه ${currentAngle} درجه ${vehicle.modelNameEn}`}
          className="w-full h-full object-cover transition-transform duration-75"
          style={{
            transform: `perspective(1000px) rotateY(${(currentAngle % 40) - 20}deg) scale(${1 + Math.sin((currentAngle * Math.PI) / 180) * 0.04})`,
            filter: `brightness(${0.85 + Math.cos((currentAngle * Math.PI) / 180) * 0.15}) contrast(1.05)`,
          }}
        />

        {/* Ambient showroom reflection floor */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent pointer-events-none" />

        {/* Angle HUD overlay */}
        <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 text-xs text-white/80 flex items-center gap-2">
          <RotateCw className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="font-latin tabular-nums font-semibold text-white">{currentAngle}°</span>
          <span className="text-white/40">·</span>
          <span>{getPerspectiveLabel(currentAngle)}</span>
        </div>
      </div>

      {/* Control Bar */}
      <div className="absolute bottom-4 inset-x-4 z-10 flex items-center justify-between bg-black/75 backdrop-blur-md border border-white/10 px-4 py-2.5 text-xs">
        <div className="flex items-center gap-2 text-white/60">
          <button
            onClick={() => setCurrentFrame((prev) => (prev - 1 + totalFrames) % totalFrames)}
            className="p-1 hover:text-white"
            title="چرخش به چپ"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsRotating(!isRotating)}
            className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-white font-medium"
          >
            {isRotating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isRotating ? 'توقف چرخش' : 'چرخش خودکار ۳۶۰°'}</span>
          </button>
          <button
            onClick={() => setCurrentFrame((prev) => (prev + 1) % totalFrames)}
            className="p-1 hover:text-white"
            title="چرخش به راست"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="text-[11px] text-white/50 hidden sm:block">
          برای چرخش ۳۶۰ درجه، تصویر را به چپ یا راست بکشید
        </div>
      </div>
    </div>
  );
};

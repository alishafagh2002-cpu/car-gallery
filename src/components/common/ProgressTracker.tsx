import React from 'react';
import { Check } from 'lucide-react';

export interface ProgressStep {
  number: number;
  label: string;
  description?: string;
}

interface ProgressTrackerProps {
  steps: ProgressStep[];
  currentStep: number;
  onStepClick?: (stepNumber: number) => void;
  className?: string;
  variant?: 'full' | 'compact';
}

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const toPersianNum = (n: number) => n.toString().replace(/\d/g, (d) => PERSIAN_DIGITS[parseInt(d, 10)]);

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  steps,
  currentStep,
  onStepClick,
  className = '',
  variant = 'full',
}) => {
  return (
    <div className={`w-full ${className}`} aria-label="مراحل فرآیند">
      {/* Desktop / Full view */}
      <div className={variant === 'compact' ? 'block' : 'hidden sm:block'}>
        <div className="relative flex items-center justify-between">
          {/* Background Connecting Track Line */}
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[2px] bg-white/[0.08] z-0" />

          {/* Active Progress Fill Line */}
          <div
            className="absolute top-1/2 right-0 -translate-y-1/2 h-[2px] bg-gradient-to-l from-[#D4AF37] to-[#C5A880] transition-all duration-500 ease-out z-0"
            style={{
              width: steps.length > 1
                ? `${Math.min(100, Math.max(0, ((currentStep - 1) / (steps.length - 1)) * 100))}%`
                : '0%',
            }}
          />

          {/* Stepper Nodes */}
          {steps.map((step) => {
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;
            const isPending = step.number > currentStep;
            const isClickable = onStepClick && isCompleted;

            return (
              <div
                key={step.number}
                onClick={() => {
                  if (isClickable) onStepClick(step.number);
                }}
                className={`relative z-10 flex flex-col items-center group ${
                  isClickable ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                {/* Node Circle */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 font-latin ${
                    isCompleted
                      ? 'bg-[#D4AF37] text-black shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                      : isCurrent
                      ? 'bg-[#0A0A0A] border-2 border-[#D4AF37] text-[#D4AF37] shadow-[0_0_16px_rgba(212,175,55,0.3)] ring-4 ring-[#D4AF37]/15'
                      : 'bg-[#141414] border border-white/10 text-white/30'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <span>{toPersianNum(step.number)}</span>
                  )}
                </div>

                {/* Step Labels */}
                <div className="mt-2 text-center max-w-[110px]">
                  <div
                    className={`text-[11px] font-persian font-medium transition-colors leading-tight ${
                      isCurrent
                        ? 'text-white font-bold'
                        : isCompleted
                        ? 'text-white/80 group-hover:text-white'
                        : 'text-white/30'
                    }`}
                  >
                    {step.label}
                  </div>
                  {step.description && (
                    <div
                      className={`text-[10px] mt-0.5 hidden lg:block leading-tight ${
                        isCurrent
                          ? 'text-[#D4AF37]'
                          : isCompleted
                          ? 'text-white/40'
                          : 'text-white/20'
                      }`}
                    >
                      {step.description}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Compact View (When in 'full' mode on small screens) */}
      {variant === 'full' && (
        <div className="sm:hidden space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-persian text-white/60">
              مرحله {toPersianNum(currentStep)} از {toPersianNum(steps.length)}:
            </span>
            <span className="font-bold text-[#D4AF37] font-persian">
              {steps[currentStep - 1]?.label}
            </span>
          </div>

          {/* Stepper Segments */}
          <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}>
            {steps.map((step) => {
              const isCompleted = step.number < currentStep;
              const isCurrent = step.number === currentStep;

              return (
                <div
                  key={step.number}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isCompleted
                      ? 'bg-[#D4AF37]'
                      : isCurrent
                      ? 'bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.6)]'
                      : 'bg-white/10'
                  }`}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

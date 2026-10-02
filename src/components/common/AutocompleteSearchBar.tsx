import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, Sparkles, ShieldCheck, Clock, ArrowUpLeft, ChevronRight, Car } from 'lucide-react';
import { Vehicle, CurrencyMode } from '../../types';
import { CarService } from '../../services/api';
import { formatPrice } from '../../utils/formatters';
import { getSafeImageUrl } from '../../utils/imageHelper';

interface AutocompleteSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSelectCar: (car: Vehicle) => void;
  currency: CurrencyMode;
  placeholder?: string;
}

const POPULAR_TAGS = [
  { label: 'پورشه ۹۱۱', query: 'پورشه ۹۱۱' },
  { label: 'مرسدس G63', query: 'مرسدس بنز جی۶۳' },
  { label: 'فراری روما', query: 'فراری' },
  { label: 'مدل ۲۰۲۴', query: '2024' },
  { label: 'پلاک کیش', query: 'کیش' },
  { label: 'پلاک اروند', query: 'اروند' },
  { label: 'گذر موقت', query: 'گذر موقت' },
];

export const AutocompleteSearchBar: React.FC<AutocompleteSearchBarProps> = ({
  value,
  onChange,
  onSelectCar,
  currency,
  placeholder = 'جستجوی هوشمند بر اساس برند (پورشه، فراری...)، مدل (۹۱۱، G63...) یا سال ساخت (۲۰۲۴)...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [allCars, setAllCars] = useState<Vehicle[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load all vehicles once for zero-latency local autocomplete
  useEffect(() => {
    CarService.getCars({ limit: 100 }).then((res) => {
      setAllCars(res.vehicles);
    });
  }, []);

  // Normalize digits (Persian to English) for flexible year searches
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
  };

  // Instant matching vehicles based on input
  const suggestions = useMemo(() => {
    if (!value.trim()) return allCars.slice(0, 5); // Default top showcase if query empty

    const q = normalizeText(value);
    return allCars.filter((car) => {
      const brandEn = normalizeText(car.brandNameEn);
      const brandFa = normalizeText(car.brandNameFa);
      const modelEn = normalizeText(car.modelNameEn);
      const modelFa = normalizeText(car.modelNameFa);
      const yearStr = car.year.toString();
      const headline = normalizeText(car.headlineFa);
      const city = normalizeText(car.locationCityFa);
      const zone = car.freeZoneNameFa ? normalizeText(car.freeZoneNameFa) : '';
      const isTemp = car.temporaryImport ? 'گذر موقت' : '';

      return (
        brandEn.includes(q) ||
        brandFa.includes(q) ||
        modelEn.includes(q) ||
        modelFa.includes(q) ||
        yearStr.includes(q) ||
        headline.includes(q) ||
        city.includes(q) ||
        zone.includes(q) ||
        isTemp.includes(q)
      );
    }).slice(0, 6); // Max 6 results for clean popup
  }, [value, allCars]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation (ArrowDown, ArrowUp, Enter, Escape)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
        return;
      }
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        e.preventDefault();
        const selected = suggestions[selectedIndex];
        onSelectCar(selected);
        setIsOpen(false);
      } else {
        // Just submit query to filter the page
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };

  const handleSelectSuggestion = (car: Vehicle) => {
    onSelectCar(car);
    setIsOpen(false);
  };

  const handleTagClick = (query: string) => {
    onChange(query);
    inputRef.current?.focus();
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Input Box */}
      <div className="relative group">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setSelectedIndex(-1);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-[#08080A] border border-white/10 hover:border-white/20 focus:border-[#D4AF37] px-4 py-3.5 pr-11 pl-16 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none transition-all shadow-inner font-persian"
        />

        {/* Search Icon */}
        <Search className="absolute right-3.5 top-3.5 sm:top-4 w-4 h-4 text-[#D4AF37] group-focus-within:text-[#D4AF37] pointer-events-none transition-colors" />

        {/* Clear Button */}
        {value && (
          <button
            onClick={() => {
              onChange('');
              inputRef.current?.focus();
            }}
            title="پاک کردن جستجو"
            className="absolute left-10 top-3.5 sm:top-4 text-white/40 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Keyboard shortcut hint icon */}
        <span className="hidden sm:inline-flex absolute left-3 top-3.5 sm:top-4 text-[9px] font-mono text-white/30 border border-white/10 px-1.5 py-0.5 pointer-events-none">
          ESC
        </span>
      </div>

      {/* Autocomplete Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-[#09090B] border border-[#D4AF37]/40 shadow-[0_12px_36px_rgba(0,0,0,0.85)] backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Header Bar */}
          <div className="px-4 py-2.5 bg-black/60 border-b border-white/[0.08] flex items-center justify-between text-[11px] text-white/50 font-persian">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>
                {value.trim()
                  ? `نتایج پیشنهادی برای «${value}» (${suggestions.length} خودرو)`
                  : 'پیشنهادات اختصاصی نوآر موتورز'}
              </span>
            </div>
            <span className="font-mono text-[10px] text-white/40">
              کلید ↑↓ برای انتخاب · Enter تایید
            </span>
          </div>

          {/* Quick Popular Searches Tags */}
          <div className="px-4 py-2 border-b border-white/[0.06] bg-white/[0.01] flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
            <span className="text-white/40 shrink-0 text-[10px]">جستجوهای متداول:</span>
            {POPULAR_TAGS.map((tag, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleTagClick(tag.query)}
                className="px-2 py-0.5 bg-white/[0.04] hover:bg-[#D4AF37]/20 border border-white/[0.08] hover:border-[#D4AF37]/50 text-white/70 hover:text-white shrink-0 text-[10px] transition-all font-persian"
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* Suggestions List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-white/[0.04]">
            {suggestions.length > 0 ? (
              suggestions.map((car, idx) => {
                const isSelected = selectedIndex === idx;
                const img = getSafeImageUrl(
                  car.images.find((i) => i.isPrimary)?.url || car.images[0]?.url
                );

                return (
                  <div
                    key={car.id}
                    onClick={() => handleSelectSuggestion(car)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`p-3 sm:px-4 sm:py-3 cursor-pointer flex items-center justify-between gap-3 transition-colors ${
                      isSelected
                        ? 'bg-[#D4AF37]/15 border-r-2 border-r-[#D4AF37]'
                        : 'hover:bg-white/[0.04]'
                    }`}
                  >
                    {/* Left: Thumbnail & Titles */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 h-10 sm:w-16 sm:h-11 shrink-0 overflow-hidden bg-black/60 border border-white/10 relative">
                        <img
                          src={img}
                          alt={car.modelNameEn}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-white truncate font-persian">
                            {car.brandNameFa} {car.modelNameFa}
                          </span>
                          <span className="text-[10px] font-mono text-[#D4AF37] border border-[#D4AF37]/30 px-1.5 py-0.2 shrink-0">
                            {car.year}
                          </span>
                        </div>

                        <div className="text-[11px] text-white/50 truncate font-latin mt-0.5">
                          {car.brandNameEn} {car.modelNameEn} · {car.enginePower} HP
                        </div>
                      </div>
                    </div>

                    {/* Right: Plate Badge & Price */}
                    <div className="text-left shrink-0 space-y-1">
                      <div className="text-xs sm:text-sm font-bold text-white font-latin tabular-nums">
                        {formatPrice(car.priceToman, currency)}
                      </div>

                      <div>
                        {car.temporaryImport ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-medium">
                            <Clock className="w-3 h-3" />
                            <span>گذر موقت ({car.temporaryLicenseDaysRemaining || 90} روز)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                            <ShieldCheck className="w-3 h-3" />
                            <span>پلاک {car.freeZoneNameFa || 'منطقه آزاد'}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center space-y-2">
                <Car className="w-8 h-8 text-white/20 mx-auto" />
                <div className="text-xs text-white/60 font-persian">
                  خودرویی منطبق با «{value}» در فهرست جاری یافت نشد.
                </div>
                <div className="text-[11px] text-white/40">
                  می‌توانید کلمه جستجو را ویرایش کنید یا از بخش مشاوره VIP درخواست سفارش‌گذاری ثبت فرمایید.
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-2.5 bg-black/80 border-t border-white/[0.08] flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white flex items-center gap-1 text-[11px]"
            >
              <span>مشاهده نتایج در کاتالوگ جامع</span>
              <ArrowUpLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
            </button>

            <span className="text-[10px] text-[#D4AF37] font-mono">
              NOIR MOTORS VERIFIED FLEET
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

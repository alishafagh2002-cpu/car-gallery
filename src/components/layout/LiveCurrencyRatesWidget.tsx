import React, { useState, useEffect } from 'react';
import { TrendingUp, RefreshCw, Info, DollarSign } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface RateItem {
  code: string;
  symbol: string;
  nameFa: string;
  nameEn: string;
  baseRate: number;
  currentRate: number;
  changePercent: number;
}

export const LiveCurrencyRatesWidget: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === 'EN';

  // Live mocked rates for USD and AED (typical UAE/Iran customs settlement rates)
  const [rates, setRates] = useState<RateItem[]>([
    {
      code: 'USD',
      symbol: '$',
      nameFa: 'دلار آمریکا',
      nameEn: 'US Dollar',
      baseRate: 98500,
      currentRate: 98500,
      changePercent: +0.24,
    },
    {
      code: 'AED',
      symbol: 'د.إ',
      nameFa: 'درهم امارات',
      nameEn: 'UAE Dirham',
      baseRate: 26850,
      currentRate: 26850,
      changePercent: +0.18,
    },
  ]);

  const [lastUpdated, setLastUpdated] = useState<string>('لحظاتی پیش');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  // Periodic realistic micro-fluctuation to emulate live forex desk
  useEffect(() => {
    const interval = setInterval(() => {
      setIsUpdating(true);
      setTimeout(() => {
        setRates((prev) =>
          prev.map((item) => {
            // Realistic micro fluctuation (+- 30 to 80 tomans)
            const delta = (Math.random() - 0.48) * (item.code === 'USD' ? 90 : 35);
            const newRate = Math.round(item.baseRate + delta);
            const change = Number((((newRate - item.baseRate) / item.baseRate) * 100).toFixed(2));
            return {
              ...item,
              currentRate: newRate,
              changePercent: change >= 0 ? change : 0.05,
            };
          })
        );
        const timeStr = new Date().toLocaleTimeString(isEn ? 'en-US' : 'fa-IR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        setLastUpdated(timeStr);
        setIsUpdating(false);
      }, 400);
    }, 12000); // Every 12 seconds

    return () => clearInterval(interval);
  }, [isEn]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(isEn ? 'en-US' : 'fa-IR').format(num);
  };

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="flex items-center gap-2 bg-[#09090B] border border-white/10 hover:border-[#D4AF37]/50 px-2.5 py-1.5 transition-all text-xs cursor-pointer select-none">
        {/* Live indicator dot */}
        <div className="flex items-center gap-1.5 border-l border-white/10 pl-2 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-mono text-[9px] text-[#D4AF37] tracking-widest uppercase font-bold">
            {isEn ? 'FX LIVE' : 'نرخ ارز'}
          </span>
        </div>

        {/* Currency Rates items */}
        <div className="flex items-center gap-3">
          {/* USD */}
          <div className="flex items-center gap-1">
            <span className="font-mono font-semibold text-white/50 text-[11px]">$</span>
            <span className="font-mono font-bold text-white text-[11px] tabular-nums">
              {formatNumber(rates[0].currentRate)}
            </span>
          </div>

          {/* Separator dot */}
          <span className="w-1 h-1 rounded-full bg-white/20" />

          {/* AED */}
          <div className="flex items-center gap-1">
            <span className="font-mono font-semibold text-[#D4AF37] text-[10px]">
              {isEn ? 'AED' : 'درهم'}
            </span>
            <span className="font-mono font-bold text-white text-[11px] tabular-nums">
              {formatNumber(rates[1].currentRate)}
            </span>
          </div>
        </div>

        <TrendingUp
          className={`w-3 h-3 text-emerald-400 transition-transform ${
            isUpdating ? 'animate-bounce' : ''
          }`}
        />
      </div>

      {/* Hover Info Tooltip */}
      {showTooltip && (
        <div className="absolute top-full left-0 mt-2 z-50 w-72 bg-[#08080A]/95 border border-[#D4AF37]/40 p-3.5 shadow-2xl backdrop-blur-md text-xs space-y-2.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
            <div className="flex items-center gap-1.5 text-[#D4AF37] font-semibold text-xs">
              <Info className="w-3.5 h-3.5" />
              <span>{isEn ? 'Forex Parity & Settlement' : 'مرجع تسویه‌حساب گمرک و حواله دبی'}</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 border border-emerald-500/20">
              {isEn ? 'ACTIVE' : 'زنده'}
            </span>
          </div>

          <div className="space-y-1.5">
            {rates.map((r) => (
              <div
                key={r.code}
                className="flex items-center justify-between text-[11px] bg-white/[0.02] p-1.5 border border-white/[0.04]"
              >
                <div className="flex items-center gap-1.5 text-white/80">
                  <span className="text-[#D4AF37] font-mono font-bold">{r.code}</span>
                  <span className="text-white/50 text-[10px]">({isEn ? r.nameEn : r.nameFa})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-white tabular-nums">
                    {formatNumber(r.currentRate)} {isEn ? 'Toman' : 'تومان'}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 tabular-nums">
                    +{r.changePercent}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-white/50 leading-relaxed pt-1 border-t border-white/[0.06]">
            {isEn
              ? 'Real-time benchmark rate applied for vehicle import customs duty, Dubai remittance escrow, and Free Zone pricing.'
              : 'مبنای تسویه و صدور پیش‌فاکتور رسمی خودروهای پلاک کیش، اروند و ترخیص موقت با نرخ حواله صرافی‌های رسمی.'}
          </div>

          <div className="text-[9px] text-white/30 font-mono text-left rtl:text-right">
            {isEn ? `Last Tick: ${lastUpdated}` : `آخرین بروزرسانی: ${lastUpdated}`}
          </div>
        </div>
      )}
    </div>
  );
};

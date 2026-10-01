import { CurrencyMode } from '../types';

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(value: string | number): string {
  return value
    .toString()
    .replace(/\d/g, (d) => PERSIAN_DIGITS[parseInt(d, 10)]);
}

export function formatPrice(
  priceToman: number,
  mode: CurrencyMode = 'TOMAN',
  options: { compact?: boolean; showSymbol?: boolean } = {}
): string {
  const { compact = true, showSymbol = true } = options;

  if (mode === 'USD') {
    // Standard exchange rate: 1 USD ~ 92,000 Tomans
    const usd = Math.round(priceToman / 92000);
    const formatted = new Intl.NumberFormat('en-US').format(usd);
    return showSymbol ? `$${formatted}` : formatted;
  }

  if (mode === 'AED') {
    // 1 AED ~ 25,000 Tomans
    const aed = Math.round(priceToman / 25000);
    const formatted = new Intl.NumberFormat('en-US').format(aed);
    return showSymbol ? `${formatted} AED` : formatted;
  }

  // TOMAN
  if (compact) {
    if (priceToman >= 1000000000) {
      const billions = priceToman / 1000000000;
      const formattedNumber = billions % 1 === 0 ? billions.toFixed(0) : billions.toFixed(1);
      return `${toPersianDigits(formattedNumber)} میلیارد تومان`;
    }
    if (priceToman >= 1000000) {
      const millions = priceToman / 1000000;
      return `${toPersianDigits(millions.toFixed(0))} میلیون تومان`;
    }
  }

  const standard = new Intl.NumberFormat('fa-IR').format(priceToman);
  return showSymbol ? `${standard} تومان` : standard;
}

export function formatMileage(km: number): string {
  const formatted = new Intl.NumberFormat('fa-IR').format(km);
  return `${formatted} کیلومتر`;
}

export function formatNumberPersian(num: number): string {
  return new Intl.NumberFormat('fa-IR').format(num);
}

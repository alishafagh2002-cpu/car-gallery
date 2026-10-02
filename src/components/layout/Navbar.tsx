import React, { useState } from 'react';
import { Menu, X, Shield, Wallet } from 'lucide-react';
import { CurrencyMode } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { LiveCurrencyRatesWidget } from './LiveCurrencyRatesWidget';
import { useVirtualWallet } from '../../context/VirtualWalletContext';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  currency: CurrencyMode;
  onCurrencyChange: (c: CurrencyMode) => void;
  onOpenConsultation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  currency,
  onCurrencyChange,
  onOpenConsultation,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { balanceToman, setIsWalletDrawerOpen } = useVirtualWallet();

  const navLinks = [
    { label: t('navCars'), path: '/cars' },
    { label: t('navFreeZones'), path: '/locations/kish' },
    { label: t('navTemporaryImport'), path: '/cars?temporaryImport=true' },
    { label: t('navAbout'), path: '/about' },
    { label: t('navContact'), path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#050505]/90 backdrop-blur-md border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onNavigate('/')}
          className="font-luxury tracking-[0.2em] text-xl sm:text-2xl font-bold text-[#F2F0EA] hover:text-[#D4AF37] transition-colors focus:outline-none whitespace-nowrap shrink-0"
        >
          NOIR MOTORS
        </button>

        {/* Zone 2: Nav Links with active indicator */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#F2F0EA]/75">
          {navLinks.map((link) => {
            const isActive =
              currentPath === link.path ||
              (link.path.startsWith('/locations') && currentPath.startsWith('/locations'));
            return (
              <button
                key={link.path}
                onClick={() => onNavigate(link.path)}
                className={`relative py-1 whitespace-nowrap transition-colors hover:text-[#F2F0EA] ${
                  isActive ? 'text-[#F2F0EA] font-semibold' : ''
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 right-0 left-0 h-[1.5px] bg-[#D4AF37]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions (Live FX Rates, Virtual Wallet, Currency Toggle, Admin Link, VIP CTA) */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {/* Live Currency Rates Widget */}
          <LiveCurrencyRatesWidget />

          {/* Virtual Wallet Button */}
          <button
            onClick={() => setIsWalletDrawerOpen(true)}
            title="کیف پول و بودجه اختصاصی خرید خودرو"
            className="flex items-center gap-1.5 bg-white/[0.04] hover:bg-[#D4AF37]/15 border border-white/[0.1] hover:border-[#D4AF37]/60 px-3 py-1.5 text-xs text-white transition-all group backdrop-blur-sm"
          >
            <Wallet className="w-3.5 h-3.5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-white/90">کیف پول:</span>
            <span className="font-mono font-bold text-[#D4AF37] tabular-nums">
              {(balanceToman / 1000000000).toLocaleString('fa-IR', { maximumFractionDigits: 1 })}{' '}
              م.ت
            </span>
          </button>

          {/* Currency Switcher */}
          <div className="flex items-center bg-white/[0.04] border border-white/[0.08] p-1 text-xs">
            <button
              onClick={() => onCurrencyChange('TOMAN')}
              className={`px-2.5 py-1 transition-all whitespace-nowrap ${
                currency === 'TOMAN'
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {t('currencyToman')}
            </button>
            <button
              onClick={() => onCurrencyChange('USD')}
              className={`px-2.5 py-1 transition-all whitespace-nowrap ${
                currency === 'USD'
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {t('currencyUSD')}
            </button>
          </div>

          {/* Admin CMS Access */}
          <button
            onClick={() => onNavigate('/admin')}
            title={t('navAdmin')}
            className="p-2 text-white/50 hover:text-[#D4AF37] hover:bg-white/[0.04] transition-colors"
          >
            <Shield className="w-4 h-4" />
          </button>

          {/* Primary CTA */}
          <button
            onClick={onOpenConsultation}
            className="px-5 py-2.5 text-xs font-semibold tracking-wider text-[#050505] bg-[#F2F0EA] hover:bg-[#D4AF37] hover:text-[#050505] transition-all whitespace-nowrap"
          >
            {t('navConsultationCTA')}
          </button>
        </div>

        {/* Mobile Controls (Wallet + Currency + Hamburger) */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Mobile Wallet Button */}
          <button
            onClick={() => setIsWalletDrawerOpen(true)}
            className="p-2 bg-white/[0.04] border border-[#D4AF37]/30 text-[#D4AF37] flex items-center gap-1 text-xs"
            title="کیف پول مجازی"
          >
            <Wallet className="w-4 h-4" />
          </button>

          {/* Mobile Currency Button */}
          <button
            onClick={() => onCurrencyChange(currency === 'TOMAN' ? 'USD' : 'TOMAN')}
            className="px-2 py-1 bg-white/[0.04] border border-white/[0.08] text-xs text-white/80"
          >
            {currency === 'TOMAN' ? t('currencyToman') : t('currencyUSD')}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white hover:text-[#D4AF37] focus:outline-none"
            aria-label="منو"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A0A0A] border-b border-white/[0.08] px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  onNavigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className="text-start py-2 text-base font-medium text-white/80 hover:text-[#D4AF37] border-b border-white/[0.04]"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => {
                onNavigate('/admin');
                setMobileMenuOpen(false);
              }}
              className="text-start py-2 text-base font-medium text-[#D4AF37] border-b border-white/[0.04] flex items-center justify-between"
            >
              <span>{t('navAdmin')}</span>
              <Shield className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Wallet Item */}
          <button
            onClick={() => {
              setIsWalletDrawerOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full py-2.5 px-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-white flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-[#D4AF37]" />
              <span>موجودی کیف پول مجازی:</span>
            </div>
            <span className="font-mono font-bold text-[#D4AF37] tabular-nums">
              {(balanceToman / 1000000000).toLocaleString('fa-IR')} میلیارد ت
            </span>
          </button>

          {/* Mobile Live FX Rates */}
          <div className="py-2.5 px-3 bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
            <span className="text-xs text-white/50">نرخ لحظه‌ای تسویه:</span>
            <LiveCurrencyRatesWidget />
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                onOpenConsultation();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 text-center text-sm font-bold text-[#050505] bg-[#F2F0EA] hover:bg-[#D4AF37] transition-colors"
            >
              {t('navConsultationCTA')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

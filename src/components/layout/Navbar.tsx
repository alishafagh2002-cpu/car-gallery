import React, { useState } from 'react';
import { Menu, X, Shield, Globe } from 'lucide-react';
import { CurrencyMode } from '../../types';

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

  const navLinks = [
    { label: 'خودروها', path: '/cars' },
    { label: 'مناطق آزاد', path: '/locations/kish' },
    { label: 'گذر موقت', path: '/cars?temporaryImport=true' },
    { label: 'درباره ما', path: '/about' },
    { label: 'ارتباط با ما', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#050505]/90 backdrop-blur-md border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark (Single text element in luxury font) */}
        <button
          onClick={() => onNavigate('/')}
          className="font-luxury tracking-[0.2em] text-xl sm:text-2xl font-bold text-[#F2F0EA] hover:text-[#D4AF37] transition-colors focus:outline-none whitespace-nowrap shrink-0"
        >
          NOIR MOTORS
        </button>

        {/* Zone 2: 4-6 Nav Links, single line with subtle hover effect */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#F2F0EA]/75">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path || (link.path.startsWith('/locations') && currentPath.startsWith('/locations'));
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

        {/* Zone 3: Primary Actions (Currency toggle, Admin link, Consultation CTA) */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
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
              تومان
            </button>
            <button
              onClick={() => onCurrencyChange('USD')}
              className={`px-2.5 py-1 transition-all whitespace-nowrap ${
                currency === 'USD'
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              USD
            </button>
          </div>

          {/* Admin CMS Access */}
          <button
            onClick={() => onNavigate('/admin')}
            title="ورود به پنل مدیریت"
            className="p-2 text-white/50 hover:text-[#D4AF37] hover:bg-white/[0.04] transition-colors"
          >
            <Shield className="w-4 h-4" />
          </button>

          {/* Primary CTA */}
          <button
            onClick={onOpenConsultation}
            className="px-5 py-2.5 text-xs font-semibold tracking-wider text-[#050505] bg-[#F2F0EA] hover:bg-[#D4AF37] hover:text-[#050505] transition-all whitespace-nowrap"
          >
            مشاوره خرید
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-3 lg:hidden">
          <div className="flex items-center bg-white/[0.04] border border-white/[0.08] p-0.5 text-xs">
            <button
              onClick={() => onCurrencyChange(currency === 'TOMAN' ? 'USD' : 'TOMAN')}
              className="px-2 py-1 text-white/80"
            >
              {currency === 'TOMAN' ? 'تومان' : 'USD'}
            </button>
          </div>

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
                className="text-right py-2 text-base font-medium text-white/80 hover:text-[#D4AF37] border-b border-white/[0.04]"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => {
                onNavigate('/admin');
                setMobileMenuOpen(false);
              }}
              className="text-right py-2 text-base font-medium text-[#D4AF37] border-b border-white/[0.04] flex items-center justify-between"
            >
              <span>پنل مدیریت و کارشناسی</span>
              <Shield className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                onOpenConsultation();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 text-center text-sm font-bold text-[#050505] bg-[#F2F0EA] hover:bg-[#D4AF37] transition-colors"
            >
              درخواست مشاوره خرید VIP
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

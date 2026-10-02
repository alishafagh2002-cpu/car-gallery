import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { InventoryPage } from './pages/InventoryPage';
import { VehicleDetailPage } from './pages/VehicleDetailPage';
import { LocationDetailPage } from './pages/LocationDetailPage';
import { AdminPage } from './pages/AdminPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { CompareDrawer } from './components/vehicles/CompareDrawer';
import { Vehicle, CurrencyMode } from './types';
import { CarService } from './services/api';
import { updatePageSeo, updateCarDetailSeo } from './utils/seo';
import { FREE_ZONES } from './data/locations';
import { ProgressTracker, ProgressStep } from './components/common/ProgressTracker';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { VirtualWalletProvider, useVirtualWallet } from './context/VirtualWalletContext';
import { VirtualWalletDrawer } from './components/wallet/VirtualWalletDrawer';
import { MessageSquare, Phone, X, Check, ArrowRight, ArrowLeft, Clock, ShieldCheck, User } from 'lucide-react';

function AppContent() {
  const { dir, isRTL, language, t } = useLanguage();
  const { isWalletDrawerOpen, setIsWalletDrawerOpen } = useVirtualWallet();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [currency, setCurrency] = useState<CurrencyMode>('TOMAN');
  const [compareList, setCompareList] = useState<Vehicle[]>([]);
  const [showCompareDrawer, setShowCompareDrawer] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showConsultationModal, setShowConsultationModal] = useState(false);

  // VIP Quick Consultation modal state with Multi-Step Progress Tracker
  const [consStep, setConsStep] = useState<1 | 2 | 3>(1);
  const [consName, setConsName] = useState('');
  const [consPhone, setConsPhone] = useState('');
  const [consCity, setConsCity] = useState('تهران');
  const [consTopic, setConsTopic] = useState('مشاوره خرید پلاک منطقه آزاد');
  const [consCategory, setConsCategory] = useState('سوپراسپرت و کوپه عملکرد بالا');
  const [consTimeSlot, setConsTimeSlot] = useState('عصر (۱۲:۰۰ الی ۱۷:۰۰)');
  const [consContactMethod, setConsContactMethod] = useState<'CALL' | 'WHATSAPP'>('CALL');
  const [consTrackingCode, setConsTrackingCode] = useState('');
  const [consSubmitted, setConsSubmitted] = useState(false);
  const [consError, setConsError] = useState('');

  const consultationSteps: ProgressStep[] = [
    { number: 1, label: 'اطلاعات هویتی', description: 'نام و تماس' },
    { number: 2, label: 'موضوع و پلاک', description: 'کلاس و نوع پلاک' },
    { number: 3, label: 'زمان‌بندی و ثبت', description: 'بازه اولویت تماس' },
  ];

  // Load favorites on mount
  useEffect(() => {
    setFavorites(CarService.getFavorites());
  }, []);

  // Handle URL history popstate
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname || '/';
      setCurrentPath(path);
      resolveRoute(path);
    };

    window.addEventListener('popstate', handlePopState);
    resolveRoute(window.location.pathname || '/');

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    resolveRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resolveRoute = async (path: string) => {
    if (path.startsWith('/cars/')) {
      const slug = path.replace('/cars/', '');
      if (slug) {
        const car = await CarService.getCarBySlug(slug);
        if (car) setSelectedVehicle(car);
      }
    } else {
      setSelectedVehicle(null);
    }
  };

  // Dynamic SEO & Social Meta Tag Injection on Route and Vehicle Changes
  useEffect(() => {
    // 1. Vehicle Detail Page
    if (currentPath.startsWith('/cars/') && selectedVehicle) {
      updateCarDetailSeo(selectedVehicle);
      return;
    }

    // 2. Free Zone Locations Page
    if (currentPath.startsWith('/locations/')) {
      const zoneSlug = currentPath.replace('/locations/', '').toLowerCase();
      const zone = FREE_ZONES[zoneSlug];
      const zoneName = zone ? zone.nameFa : 'منطقه آزاد';
      updatePageSeo({
        title: `خودروهای ${zoneName} | نوآر موتورز`,
        description: zone
          ? `${zone.descriptionFa} مشاهده موجودی سوپراسپرت‌ها و مشاوره ترخیص و پلاک گذاری در نوآر موتورز.`
          : `مشاهده و خرید خودروهای خاص و سوپراسپرت‌های پلاک ${zoneName} همراه با استعلام ترخیص و کارشناسی رسمی.`,
        image: zone?.coverImage,
        url: currentPath,
      });
      return;
    }

    // 3. Inventory / Catalog Page
    if (currentPath === '/cars' || currentPath.startsWith('/cars?')) {
      const isTemporary = currentPath.includes('temporaryImport=true');
      updatePageSeo({
        title: isTemporary
          ? 'خودروهای پلاک گذر موقت | خرید و تردد مجاز در کشور | نوآر موتورز'
          : 'کاتالوگ جامع خودروهای مناطق آزاد و گذر موقت | نوآر موتورز',
        description: isTemporary
          ? 'فهرست خودروهای وارداتی پلاک گذر موقت در تهران و شهرهای ایران همراه با قوانین تمدید تردد و استعلام اصالت مدارک.'
          : 'بررسی، مقایسه و خرید انواع خودروهای سوپراسپرت و لوکس پلاک مناطق آزاد کیش، اروند، انزلی و قشم در نوآر موتورز.',
        url: currentPath,
      });
      return;
    }

    // 4. Admin CMS Portal
    if (currentPath === '/admin') {
      updatePageSeo({
        title: 'پنل مدیریت نوآر موتورز | سامانه نظارت و ثبت خودرو',
        description: 'پنل اختصاصی مدیریت خودروها، سفارش‌های خرید و استعلام‌های مشاوره نوآر موتورز.',
        url: '/admin',
      });
      return;
    }

    // 5. About Page
    if (currentPath === '/about') {
      updatePageSeo({
        title: 'درباره نوآر موتورز | مرجع خودروهای سوپراسپرت و مناطق آزاد',
        description: 'داستان نوآر موتورز، استانداردهای کارشناسی ۱۰۰ نقطه‌ای، تسهیل ترخیص و واردات اختصاصی سوپراسپرت‌ها در ایران.',
        url: '/about',
      });
      return;
    }

    // 6. Contact Page
    if (currentPath === '/contact') {
      updatePageSeo({
        title: 'تماس با نوآر موتورز | دفاتر تهران، کیش و دبی',
        description: 'راه‌های ارتباطی، مشاوره تلفنی فوری، نشانی دفاتر و پشتیبانی خرید خودروهای لوکس در نوآر موتورز.',
        url: '/contact',
      });
      return;
    }

    // 7. Homepage (Default)
    updatePageSeo({
      title: 'NOIR MOTORS | بازار خودروهای مناطق آزاد و گذر موقت',
      description: 'بازار اختصاصی خودروهای مناطق آزاد، گذر موقت و سوپراسپرت‌های لوکس در ایران همراه با بررسی تخصصی و درخواست خرید آنلاین.',
      url: '/',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'AutoDealer',
        name: 'NOIR MOTORS',
        alternateName: 'نوآر موتورز',
        description: 'بازار اختصاصی خودروهای مناطق آزاد، گذر موقت و سوپراسپرت‌های لوکس در ایران',
        url: window.location.origin,
        priceRange: '$$$$',
        currenciesAccepted: 'IRR, USD, AED',
        telephone: '+98-21-22000000',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'تهران / کیش',
          addressCountry: 'IR',
        },
      },
    });
  }, [currentPath, selectedVehicle]);

  const handleSelectCar = (car: Vehicle) => {
    setSelectedVehicle(car);
    navigateTo(`/cars/${car.slug}`);
  };

  const handleToggleFavorite = (vehicleId: string) => {
    CarService.toggleFavorite(vehicleId);
    setFavorites(CarService.getFavorites());
  };

  const handleAddToCompare = (car: Vehicle) => {
    if (compareList.some((v) => v.id === car.id)) return;
    if (compareList.length >= 3) {
      alert('حداکثر ۳ خودرو را می‌توانید همزمان مقایسه نمایید.');
      return;
    }
    const updated = [...compareList, car];
    setCompareList(updated);
    setShowCompareDrawer(true);
  };

  const handleRemoveCompare = (id: string) => {
    setCompareList((prev) => prev.filter((v) => v.id !== id));
  };

  const handleConsNext = () => {
    setConsError('');
    if (consStep === 1) {
      if (!consName.trim() || consName.trim().length < 3) {
        setConsError('لطفاً نام و نام خانوادگی خود را کامل وارد نمایید.');
        return;
      }
      const cleanPhone = consPhone.replace(/\s+/g, '');
      if (!cleanPhone || !/^(\+98|0)?9\d{9}$/.test(cleanPhone)) {
        setConsError('شماره تلفن همراه معتبر (مثال: 09121234567) وارد نمایید.');
        return;
      }
      setConsStep(2);
    } else if (consStep === 2) {
      setConsStep(3);
    }
  };

  const handleConsPrev = () => {
    setConsError('');
    if (consStep > 1) {
      setConsStep((prev) => (prev - 1) as any);
    }
  };

  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consName || !consPhone) return;
    const tracking = `NOIR-VIP-${Math.floor(10000 + Math.random() * 90000)}`;
    setConsTrackingCode(tracking);
    setConsSubmitted(true);
  };

  const resetConsultation = () => {
    setShowConsultationModal(false);
    setConsSubmitted(false);
    setConsStep(1);
    setConsName('');
    setConsPhone('');
    setConsError('');
  };

  // Determine current active page
  const renderCurrentView = () => {
    // 1. Vehicle Detail Page
    if (currentPath.startsWith('/cars/') && selectedVehicle) {
      return (
        <VehicleDetailPage
          vehicle={selectedVehicle}
          currency={currency}
          onBack={() => navigateTo('/cars')}
          onSelectCar={handleSelectCar}
          onAddToCompare={handleAddToCompare}
          isFavorite={favorites.includes(selectedVehicle.id)}
          onToggleFavorite={handleToggleFavorite}
        />
      );
    }

    // 2. Location Detail Page (/locations/:slug)
    if (currentPath.startsWith('/locations/')) {
      const zoneSlug = currentPath.replace('/locations/', '').toLowerCase();
      return (
        <LocationDetailPage
          zoneSlug={zoneSlug}
          currency={currency}
          onSelectCar={handleSelectCar}
          onNavigate={navigateTo}
          onOpenConsultation={() => setShowConsultationModal(true)}
        />
      );
    }

    // 3. Cars Inventory Page
    if (currentPath === '/cars' || currentPath.startsWith('/cars?')) {
      const isTemporary = currentPath.includes('temporaryImport=true');
      return (
        <InventoryPage
          currency={currency}
          onSelectCar={handleSelectCar}
          initialTemporaryImport={isTemporary}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />
      );
    }

    // 4. Admin CMS Portal
    if (currentPath === '/admin') {
      return <AdminPage onBack={() => navigateTo('/')} />;
    }

    // 5. About Page
    if (currentPath === '/about') {
      return (
        <AboutPage
          onNavigate={navigateTo}
          onOpenConsultation={() => setShowConsultationModal(true)}
        />
      );
    }

    // 6. Contact Page
    if (currentPath === '/contact') {
      return <ContactPage />;
    }

    // Default: Homepage
    return (
      <HomePage
        currency={currency}
        onSelectCar={handleSelectCar}
        onNavigate={navigateTo}
        onOpenConsultation={() => setShowConsultationModal(true)}
      />
    );
  };

  return (
    <div
      dir={dir}
      className={`flex flex-col min-h-screen bg-[#050505] text-[#F2F0EA] selection:bg-[#D4AF37]/30 selection:text-white ${
        isRTL ? 'font-persian' : 'font-sans'
      }`}
    >
      {/* Top Navbar */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigateTo}
        currency={currency}
        onCurrencyChange={setCurrency}
        onOpenConsultation={() => setShowConsultationModal(true)}
      />

      {/* Main View Area */}
      <main className="flex-grow">{renderCurrentView()}</main>

      {/* Comparison Drawer */}
      {showCompareDrawer && (
        <CompareDrawer
          vehicles={compareList}
          currency={currency}
          onRemove={handleRemoveCompare}
          onClear={() => setCompareList([])}
          onSelectCar={handleSelectCar}
          onClose={() => setShowCompareDrawer(false)}
        />
      )}

      {/* Floating Compare Badge (when drawer is minimized) */}
      {!showCompareDrawer && compareList.length > 0 && (
        <button
          onClick={() => setShowCompareDrawer(true)}
          className="fixed bottom-6 left-6 z-40 px-4 py-2.5 bg-[#0A0A0A] border border-[#D4AF37] text-white text-xs font-semibold shadow-2xl flex items-center gap-2 hover:bg-[#D4AF37] hover:text-black transition-colors"
        >
          <span>مقایسه خودروها ({compareList.length})</span>
        </button>
      )}

      {/* VIP Quick Consultation Modal with Progress Tracker */}
      {showConsultationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#0A0A0A] border border-[#D4AF37]/40 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest">
                  VIP DIRECT CONCIERGE · STAGE {consStep} OF 3
                </span>
                <h3 className="text-base font-bold text-white font-persian mt-0.5">
                  درخواست مشاوره تخصصی و ترخیص خودرو
                </h3>
              </div>
              <button
                onClick={resetConsultation}
                className="p-1.5 text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Tracker Stepper */}
            {!consSubmitted && (
              <div className="px-6 py-3.5 bg-black/50 border-b border-white/[0.06]">
                <ProgressTracker
                  steps={consultationSteps}
                  currentStep={consStep}
                  onStepClick={(step) => {
                    if (step < consStep) setConsStep(step as any);
                  }}
                />
              </div>
            )}

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-grow">
              {consSubmitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center mx-auto text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                    <Check className="w-7 h-7 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white font-persian">
                      درخواست مشاوره با موفقیت ثبت گردید
                    </h4>
                    <p className="text-xs text-white/60 mt-1 max-w-sm mx-auto font-persian">
                      کارشناس ارشد ترخیص و پلاک نوآر موتورز در بازه زمانی {consTimeSlot} با شما تماس حاصل خواهند نمود.
                    </p>
                  </div>

                  <div className="bg-black/60 border border-white/10 p-4 max-w-xs mx-auto text-center space-y-1">
                    <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                      VIP TRACKING CODE
                    </div>
                    <div className="text-base font-bold text-[#D4AF37] font-mono tracking-wider">
                      {consTrackingCode}
                    </div>
                  </div>

                  <button
                    onClick={resetConsultation}
                    className="mt-4 px-6 py-2.5 text-xs font-bold text-[#050505] bg-[#F2F0EA] hover:bg-[#D4AF37] transition-colors"
                  >
                    بستن پنجره
                  </button>
                </div>
              ) : (
                <form onSubmit={handleConsultationSubmit} className="space-y-4 text-xs">
                  {consError && (
                    <div className="p-2.5 bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs text-right">
                      {consError}
                    </div>
                  )}

                  {/* STEP 1: Applicant Identity & Direct Contact */}
                  {consStep === 1 && (
                    <div className="space-y-4">
                      <p className="text-white/60 text-xs leading-relaxed">
                        لطفاً مشخصات فردی و خط تماس مستقیم خود را جهت هماهنگی با کارشناس ارشد نوآر موتورز وارد نمایید.
                      </p>

                      <div>
                        <label className="block text-white/80 mb-1.5 font-medium">
                          نام و نام‌خانوادگی خریدار *
                        </label>
                        <div className="relative">
                          <input
                            required
                            type="text"
                            value={consName}
                            onChange={(e) => setConsName(e.target.value)}
                            placeholder="مثال: مهندس رادمان سلطانی"
                            className="w-full bg-black/60 border border-white/10 px-3.5 py-2.5 text-white focus:border-[#D4AF37] focus:outline-none"
                          />
                          <User className="absolute left-3 top-3 w-4 h-4 text-white/30" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-white/80 mb-1.5 font-medium">
                          شماره تماس مستقیم (همراه) *
                        </label>
                        <div className="relative">
                          <input
                            required
                            dir="ltr"
                            type="tel"
                            value={consPhone}
                            onChange={(e) => setConsPhone(e.target.value)}
                            placeholder="0912xxxxxxx"
                            className="w-full bg-black/60 border border-white/10 px-3.5 py-2.5 text-white focus:border-[#D4AF37] focus:outline-none font-mono"
                          />
                          <Phone className="absolute left-3 top-3 w-4 h-4 text-white/30" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-white/80 mb-1.5 font-medium">
                          شهر محل سکونت / تحویل خودرو
                        </label>
                        <input
                          type="text"
                          value={consCity}
                          onChange={(e) => setConsCity(e.target.value)}
                          placeholder="مثال: تهران / کیش"
                          className="w-full bg-black/60 border border-white/10 px-3.5 py-2.5 text-white focus:border-[#D4AF37] focus:outline-none"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleConsNext}
                        className="w-full mt-4 py-3 text-xs font-bold text-[#050505] bg-[#F2F0EA] hover:bg-[#D4AF37] transition-colors flex items-center justify-center gap-2"
                      >
                        <span>ادامه به مرحله بعد: مشخصات درخواست</span>
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* STEP 2: Consultation Topic & Vehicle Class */}
                  {consStep === 2 && (
                    <div className="space-y-4">
                      <p className="text-white/60 text-xs leading-relaxed">
                        موضوع استعلام و سگمنت خودروی مورد علاقه خود را انتخاب کنید تا پرونده به مشاور تخصصی مرتبط ارجاع گردد.
                      </p>

                      <div>
                        <label className="block text-white/80 mb-1.5 font-medium">
                          موضوع استعلام و حوزه پلاک *
                        </label>
                        <select
                          value={consTopic}
                          onChange={(e) => setConsTopic(e.target.value)}
                          className="w-full bg-black/60 border border-white/10 px-3.5 py-2.5 text-white focus:border-[#D4AF37] focus:outline-none"
                        >
                          <option value="مشاوره خرید پلاک منطقه آزاد">خرید و ترخیص پلاک مناطق آزاد (کیش، اروند، انزلی، قشم)</option>
                          <option value="قوانین تمدید گذر موقت">قوانین تمدید تردد و کارنه گذر موقت در سراسر کشور</option>
                          <option value="استعلام قیمت و سفارش خاص">سفارش‌گذاری اختصاصی مدل‌های خاص از امارات و آلمان</option>
                          <option value="کارشناسی فنی و تطبیق اسناد">کارشناسی اصالت اسناد و بازرسی فنی ۱۰۰ نقطه‌ای</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-white/80 mb-1.5 font-medium">
                          کلاس خودروی مورد علاقه
                        </label>
                        <select
                          value={consCategory}
                          onChange={(e) => setConsCategory(e.target.value)}
                          className="w-full bg-black/60 border border-white/10 px-3.5 py-2.5 text-white focus:border-[#D4AF37] focus:outline-none"
                        >
                          <option value="سوپراسپرت و کوپه عملکرد بالا">سوپراسپرت و کوپه عملکرد بالا (Porsche, Ferrari, McLaren)</option>
                          <option value="شاسی‌بلند لوکس و آفرود">شاسی‌بلند لوکس و تشریفاتی (G-Class, Range Rover, LX600)</option>
                          <option value="سدان پرچمدار و تشریفاتی">سدان پرچمدار و لیموزین (S-Class, Flying Spur, 7-Series)</option>
                          <option value="گرند تورر ۲+۲">گرند تورر ۲+۲ لوکس (Continental GT, DB12)</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={handleConsPrev}
                          className="w-1/3 py-2.5 text-xs font-semibold text-white/80 border border-white/20 hover:border-white/50 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <ArrowRight className="w-4 h-4" />
                          <span>بازگشت</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleConsNext}
                          className="w-2/3 py-2.5 text-xs font-bold text-[#050505] bg-[#F2F0EA] hover:bg-[#D4AF37] transition-colors flex items-center justify-center gap-1.5"
                        >
                          <span>مرحله بعد: زمان‌بندی تماس</span>
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Priority Schedule & Final Submission */}
                  {consStep === 3 && (
                    <div className="space-y-4">
                      <p className="text-white/60 text-xs leading-relaxed">
                        بازه زمانی و شیوه مطلوب ارتباط را تعیین نمایید تا کارشناس در آرامش با شما گفتگو نمایند.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-white/80 mb-1.5 font-medium">
                            بازه ساعت تماس ترجیحی
                          </label>
                          <select
                            value={consTimeSlot}
                            onChange={(e) => setConsTimeSlot(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 px-3 py-2.5 text-white focus:border-[#D4AF37] focus:outline-none"
                          >
                            <option value="صبح (۰۹:۰۰ الی ۱۲:۰۰)">صبح (۰۹:۰۰ الی ۱۲:۰۰)</option>
                            <option value="عصر (۱۲:۰۰ الی ۱۷:۰۰)">عصر (۱۲:۰۰ الی ۱۷:۰۰)</option>
                            <option value="غروب (۱۷:۰۰ الی ۲۱:۰۰)">غروب (۱۷:۰۰ الی ۲۱:۰۰)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-white/80 mb-1.5 font-medium">
                            روش ارتباطی اولویت‌دار
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setConsContactMethod('CALL')}
                              className={`py-2 px-2 text-center border transition-all ${
                                consContactMethod === 'CALL'
                                  ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white font-semibold'
                                  : 'border-white/10 text-white/60 hover:text-white'
                              }`}
                            >
                              تماس تلفنی
                            </button>
                            <button
                              type="button"
                              onClick={() => setConsContactMethod('WHATSAPP')}
                              className={`py-2 px-2 text-center border transition-all ${
                                consContactMethod === 'WHATSAPP'
                                  ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white font-semibold'
                                  : 'border-white/10 text-white/60 hover:text-white'
                              }`}
                            >
                              واتس‌اپ VIP
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Dossier Summary Box */}
                      <div className="bg-[#050505] border border-white/[0.08] p-3.5 space-y-2 text-[11px]">
                        <div className="text-[#D4AF37] font-semibold text-[10px] uppercase font-mono tracking-widest">
                          خلاصه پرونده مشاوره
                        </div>
                        <div className="flex justify-between text-white/70">
                          <span>متقاضی محترم:</span>
                          <span className="text-white font-medium">{consName}</span>
                        </div>
                        <div className="flex justify-between text-white/70">
                          <span>موضوع:</span>
                          <span className="text-white font-medium">{consTopic}</span>
                        </div>
                        <div className="flex justify-between text-white/70">
                          <span>سگمنت خودرو:</span>
                          <span className="text-white font-medium">{consCategory}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={handleConsPrev}
                          className="w-1/3 py-3 text-xs font-semibold text-white/80 border border-white/20 hover:border-white/50 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <ArrowRight className="w-4 h-4" />
                          <span>بازگشت</span>
                        </button>
                        <button
                          type="submit"
                          className="w-2/3 py-3 text-xs font-bold text-[#050505] bg-[#D4AF37] hover:bg-[#F2F0EA] transition-colors flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                        >
                          <span>ثبت نهایی و اتصال به کارشناس</span>
                          <Check className="w-4 h-4 stroke-[3]" />
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Virtual Wallet Drawer & Profile */}
      <VirtualWalletDrawer
        isOpen={isWalletDrawerOpen}
        onClose={() => setIsWalletDrawerOpen(false)}
        onExploreCars={() => navigateTo('/cars')}
      />

      {/* Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <VirtualWalletProvider>
        <AppContent />
      </VirtualWalletProvider>
    </LanguageProvider>
  );
}

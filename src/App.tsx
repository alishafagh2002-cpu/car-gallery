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
import { MessageSquare, Phone, X, Check } from 'lucide-react';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [currency, setCurrency] = useState<CurrencyMode>('TOMAN');
  const [compareList, setCompareList] = useState<Vehicle[]>([]);
  const [showCompareDrawer, setShowCompareDrawer] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showConsultationModal, setShowConsultationModal] = useState(false);

  // VIP Quick Consultation modal state
  const [consName, setConsName] = useState('');
  const [consPhone, setConsPhone] = useState('');
  const [consCity, setConsCity] = useState('تهران');
  const [consTopic, setConsTopic] = useState('مشاوره خرید پلاک منطقه آزاد');
  const [consSubmitted, setConsSubmitted] = useState(false);

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

  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consName || !consPhone) return;
    setConsSubmitted(true);
    setTimeout(() => {
      setConsSubmitted(false);
      setShowConsultationModal(false);
      setConsName('');
      setConsPhone('');
    }, 2500);
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
    <div className="flex flex-col min-h-screen bg-[#050505] text-[#F2F0EA] selection:bg-[#D4AF37]/30 selection:text-white">
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

      {/* VIP Quick Consultation Modal */}
      {showConsultationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#0A0A0A] border border-[#D4AF37]/40 shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
              <div>
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest">
                  VIP DIRECT CONCIERGE
                </span>
                <h3 className="text-base font-bold text-white font-persian mt-0.5">
                  درخواست مشاوره تخصصی خرید
                </h3>
              </div>
              <button
                onClick={() => setShowConsultationModal(false)}
                className="p-1.5 text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {consSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center mx-auto text-[#D4AF37]">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">درخواست مشاوره با موفقیت ثبت شد</h4>
                <p className="text-xs text-white/60">
                  کارشناس ارشد ترخیص و پلاک نوآر موتورز به زودی با شما تماس خواهند گرفت.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConsultationSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-white/80 mb-1">نام و نام‌خانوادگی *</label>
                  <input
                    required
                    type="text"
                    value={consName}
                    onChange={(e) => setConsName(e.target.value)}
                    placeholder="مثال: مهندس رادمان"
                    className="w-full bg-black/60 border border-white/10 px-3.5 py-2.5 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/80 mb-1">شماره تماس مستقیم *</label>
                  <input
                    required
                    dir="ltr"
                    type="tel"
                    value={consPhone}
                    onChange={(e) => setConsPhone(e.target.value)}
                    placeholder="0912xxxxxxx"
                    className="w-full bg-black/60 border border-white/10 px-3.5 py-2.5 text-white focus:border-[#D4AF37] focus:outline-none font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/80 mb-1">شهر خریدار</label>
                    <input
                      type="text"
                      value={consCity}
                      onChange={(e) => setConsCity(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 mb-1">موضوع استعلام</label>
                    <select
                      value={consTopic}
                      onChange={(e) => setConsTopic(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
                    >
                      <option value="مشاوره خرید پلاک منطقه آزاد">پلاک مناطق آزاد</option>
                      <option value="قوانین تمدید گذر موقت">تمدید گذر موقت</option>
                      <option value="استعلام قیمت و سفارش خاص">سفارش‌گذاری خودرو</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 text-xs font-bold text-[#050505] bg-[#F2F0EA] hover:bg-[#D4AF37] transition-colors"
                >
                  ارسال درخواست به کارشناس VIP
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}

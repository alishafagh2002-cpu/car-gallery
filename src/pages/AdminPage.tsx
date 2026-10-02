import React, { useState, useEffect } from 'react';
import {
  Shield,
  Plus,
  Trash2,
  Edit,
  DollarSign,
  TrendingUp,
  FileCheck,
  Calendar,
  Layers,
  Search,
  Check,
  X,
  RefreshCw,
  Building,
  Lock,
  KeyRound,
  LogOut,
  Eye,
  EyeOff,
  ShieldAlert,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import {
  Vehicle,
  PurchaseRequestRecord,
  ViewingRequestRecord,
  AdminDashboardMetrics,
  AvailabilityStatus,
  RequestStatus,
} from '../types';
import { CarService } from '../services/api';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { formatPrice } from '../utils/formatters';

interface AdminPageProps {
  onBack: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onBack }) => {
  // Security Authentication Hook
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    login,
    logout,
    lastLoginTime,
    masterPasswordHint,
  } = useAdminAuth();

  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  const [activeTab, setActiveTab] = useState<'METRICS' | 'VEHICLES' | 'PURCHASE_REQUESTS' | 'APPOINTMENTS'>('METRICS');
  const [metrics, setMetrics] = useState<AdminDashboardMetrics | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequestRecord[]>([]);
  const [viewingRequests, setViewingRequests] = useState<ViewingRequestRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Vehicle Modal (Create or Edit)
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Form states for vehicle creation/editing
  const [brandNameEn, setBrandNameEn] = useState('Porsche');
  const [brandNameFa, setBrandNameFa] = useState('پورشه');
  const [modelNameEn, setModelNameEn] = useState('911 GT3 RS');
  const [modelNameFa, setModelNameFa] = useState('۹۱۱ جی‌تی۳ آر‌اس');
  const [year, setYear] = useState(2024);
  const [priceToman, setPriceToman] = useState(24000000000);
  const [mileage, setMileage] = useState(1500);
  const [enginePower, setEnginePower] = useState(525);
  const [engine, setEngine] = useState('4.0L Naturally Aspirated Boxer-6');
  const [bodyType, setBodyType] = useState<Vehicle['bodyType']>('SUPERCAR');
  const [locationCityFa, setLocationCityFa] = useState('کیش');
  const [freeZoneSlug, setFreeZoneSlug] = useState<any>('kish');
  const [temporaryImport, setTemporaryImport] = useState(false);
  const [headlineFa, setHeadlineFa] = useState('پورشه ۹۱۱ جی‌تی۳ آر‌اس مدل ۲۰۲۴ در منطقه آزاد کیش');

  const refreshAllData = async () => {
    setLoading(true);
    const [m, v, pr, vr] = await Promise.all([
      CarService.getAdminDashboardMetrics(),
      CarService.getCars({ limit: 100 }).then((r) => r.vehicles),
      CarService.getPurchaseRequests(),
      CarService.getViewingRequests(),
    ]);
    setMetrics(m);
    setVehicles(v);
    setPurchaseRequests(pr);
    setViewingRequests(vr);
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshAllData();
    }
  }, [isAuthenticated]);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmittingAuth(true);
    const res = login(passwordInput);
    if (!res.success) {
      setAuthError(res.error || 'رمز عبور نامعتبر است.');
    } else {
      setPasswordInput('');
    }
    setIsSubmittingAuth(false);
  };

  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVehicle) {
      await CarService.updateCar(editingVehicle.id, {
        brandNameEn,
        brandNameFa,
        modelNameEn,
        modelNameFa,
        year,
        priceToman,
        mileage,
        enginePower,
        engine,
        bodyType,
        locationCityFa,
        freeZoneSlug,
        temporaryImport,
        headlineFa,
      });
    } else {
      await CarService.createCar({
        brandNameEn,
        brandNameFa,
        modelNameEn,
        modelNameFa,
        year,
        priceToman,
        mileage,
        enginePower,
        engine,
        bodyType,
        locationCityFa,
        freeZoneSlug: temporaryImport ? undefined : freeZoneSlug,
        temporaryImport,
        headlineFa,
      });
    }
    setShowVehicleModal(false);
    setEditingVehicle(null);
    refreshAllData();
  };

  const handleOpenEdit = (v: Vehicle) => {
    setEditingVehicle(v);
    setBrandNameEn(v.brandNameEn);
    setBrandNameFa(v.brandNameFa);
    setModelNameEn(v.modelNameEn);
    setModelNameFa(v.modelNameFa);
    setYear(v.year);
    setPriceToman(v.priceToman);
    setMileage(v.mileage);
    setEnginePower(v.enginePower);
    setEngine(v.engine);
    setBodyType(v.bodyType);
    setLocationCityFa(v.locationCityFa);
    setFreeZoneSlug(v.freeZoneSlug || 'kish');
    setTemporaryImport(v.temporaryImport);
    setHeadlineFa(v.headlineFa);
    setShowVehicleModal(true);
  };

  const handleDeleteVehicle = async (id: string) => {
    if (confirm('آیا از حذف این پرونده خودرو از سامانه اطمینان دارید؟')) {
      await CarService.deleteCar(id);
      refreshAllData();
    }
  };

  const handleUpdatePurchaseStatus = async (id: string, newStatus: RequestStatus) => {
    await CarService.updatePurchaseRequestStatus(id, newStatus);
    refreshAllData();
  };

  // If not authenticated, render login form at top of page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#F2F0EA] py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Top navigation row */}
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37]">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase">
                  RESTRICTED PORTAL · CLEARANCE REQUIRED
                </span>
                <div className="text-base font-bold text-white font-persian">
                  سامانه مدیریت و کارشناسی نوآر موتورز
                </div>
              </div>
            </div>

            <button
              onClick={onBack}
              className="px-3.5 py-1.5 text-xs text-white/70 hover:text-white border border-white/10 hover:border-white/30 transition-colors flex items-center gap-1.5"
            >
              <span>بازگشت به سایت</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Primary Authentication Form AT THE TOP */}
          <div className="bg-[#0A0A0C] border border-[#D4AF37]/50 shadow-[0_0_30px_rgba(212,175,55,0.08)] p-6 sm:p-10 relative overflow-hidden mb-10">
            <div className="max-w-md mx-auto space-y-6">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 border-2 border-[#D4AF37] flex items-center justify-center mx-auto text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.25)]">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="text-[11px] font-mono tracking-widest text-[#D4AF37] uppercase">
                  SECURITY CLEARANCE LEVEL 3
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-persian">
                  ورود امن به پنل مدیریت
                </h2>
                <p className="text-xs text-white/60 leading-relaxed max-w-sm mx-auto">
                  دسترسی به بخش مدیریت خودروها، تغییر قیمت‌ها، بررسی بیعانه‌ها و زمان‌بندی تست درایو مستلزم ورود رمز عبور اختصاصی مدیر ارشد می‌باشد.
                </p>
              </div>

              {authError && (
                <div className="p-3 bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs text-right flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1.5 text-right">
                    رمز عبور مدیر ارشد (Admin Password) *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="رمز عبور مدیریت را وارد فرمایید..."
                      autoFocus
                      required
                      className="w-full bg-black/60 border border-white/15 px-4 py-3 pl-12 pr-10 text-sm text-white placeholder-white/30 focus:border-[#D4AF37] focus:outline-none font-mono"
                    />
                    <KeyRound className="absolute right-3.5 top-3.5 w-4 h-4 text-white/40" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-3 text-white/40 hover:text-white transition-colors"
                      title={showPassword ? 'مخفی کردن' : 'نمایش رمز'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingAuth}
                  className="w-full py-3.5 text-xs font-bold text-[#050505] bg-[#D4AF37] hover:bg-[#F2F0EA] transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.3)] disabled:opacity-50"
                >
                  <Shield className="w-4 h-4" />
                  <span>احراز هویت و ورود به پنل</span>
                </button>
              </form>

              {/* Demo Hint & Quick Autofill */}
              <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/50 gap-2 bg-white/[0.02] p-3 border border-white/[0.04]">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#D4AF37] font-semibold">کلید پیش‌فرض دمو:</span>
                  <code className="text-[#D4AF37] font-mono bg-black/60 px-2 py-0.5 border border-white/10">
                    {masterPasswordHint}
                  </code>
                </div>
                <button
                  type="button"
                  onClick={() => setPasswordInput(masterPasswordHint)}
                  className="text-white/70 hover:text-[#D4AF37] underline decoration-[#D4AF37]/50"
                >
                  درج خودکار رمز دمو
                </button>
              </div>
            </div>
          </div>

          {/* Locked Dashboard Overview & Compliance Guarantee */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-white/40 uppercase tracking-widest">
              <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>PROTECTED MODULES · READ-ONLY PREVIEW</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#08080A] border border-white/[0.06] p-5 opacity-60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white font-semibold">داشبورد ارزش‌گذاری مالی</span>
                  <span className="text-[10px] text-[#D4AF37] font-mono bg-[#D4AF37]/10 px-2 py-0.5">LOCKED</span>
                </div>
                <p className="text-xs text-white/40 leading-relaxed">
                  گزارش‌های تحلیلی، ارزیابی کل سبد موجودی و نرخ رشد ماهانه.
                </p>
              </div>

              <div className="bg-[#08080A] border border-white/[0.06] p-5 opacity-60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white font-semibold">مدیریت ناوگان و کاتالوگ خودروها</span>
                  <span className="text-[10px] text-[#D4AF37] font-mono bg-[#D4AF37]/10 px-2 py-0.5">LOCKED</span>
                </div>
                <p className="text-xs text-white/40 leading-relaxed">
                  ثبت سوپراسپرت‌های جدید، تغییر قیمت‌ها و به‌روزرسانی اسناد گمرکی.
                </p>
              </div>

              <div className="bg-[#08080A] border border-white/[0.06] p-5 opacity-60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white font-semibold">پرونده‌های ودیعه و خرید رسمی</span>
                  <span className="text-[10px] text-[#D4AF37] font-mono bg-[#D4AF37]/10 px-2 py-0.5">LOCKED</span>
                </div>
                <p className="text-xs text-white/40 leading-relaxed">
                  بررسی پیش‌فاکتورها، استعلام هویت خریداران و تایید انتقال سند.
                </p>
              </div>

              <div className="bg-[#08080A] border border-white/[0.06] p-5 opacity-60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white font-semibold">هماهنگی نوبت‌های بازدید و تست درایو</span>
                  <span className="text-[10px] text-[#D4AF37] font-mono bg-[#D4AF37]/10 px-2 py-0.5">LOCKED</span>
                </div>
                <p className="text-xs text-white/40 leading-relaxed">
                  زمان‌بندی تست درایو در شو‌روم‌های فرشته، کیش و اهواز.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#F2F0EA] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Header with Active Session & Logout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/[0.08] gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37]">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase">
                  NOIR MOTORS · EXECUTIVE CMS & AUDIT DESK
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  AUTHENTICATED
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white font-persian mt-0.5">
                پنل مدیریت متمرکز و کارشناسی
              </h1>
              {lastLoginTime && (
                <div className="text-[11px] text-white/40 mt-0.5">
                  ورود در ساعت: {lastLoginTime} (نشست فعال مدیریت)
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refreshAllData}
              className="p-2.5 bg-[#0A0A0A] border border-white/10 text-white/60 hover:text-white"
              title="بارگذاری مجدد داده‌ها"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={logout}
              className="px-3.5 py-2 text-xs border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/60 transition-colors flex items-center gap-1.5"
              title="خروج از حساب مدیریت"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج از مدیریت</span>
            </button>

            <button
              onClick={onBack}
              className="px-4 py-2 text-xs border border-white/20 text-white hover:bg-white/[0.05]"
            >
              بازگشت به سایت
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/[0.08] my-6 text-xs overflow-x-auto pb-1">
          {[
            { id: 'METRICS', label: 'داشبورد آماری و تحلیل مالی' },
            { id: 'VEHICLES', label: `مدیریت موجودی خودروها (${vehicles.length})` },
            { id: 'PURCHASE_REQUESTS', label: `پرونده‌های درخواست خرید (${purchaseRequests.length})` },
            { id: 'APPOINTMENTS', label: `نوبت‌های بازدید و تست درایو (${viewingRequests.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 font-semibold whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-[#D4AF37] text-white bg-white/[0.03]'
                  : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 1. DASHBOARD METRICS TAB */}
        {activeTab === 'METRICS' && metrics && (
          <div className="space-y-8">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#0A0A0A] border border-white/[0.08] p-5 space-y-2">
                <div className="text-[11px] text-white/50 uppercase tracking-widest font-mono">
                  TOTAL ASSET VALUATION
                </div>
                <div className="text-2xl font-bold text-white font-latin tabular-nums">
                  {formatPrice(metrics.totalInventoryValueToman, 'TOMAN', { compact: true })}
                </div>
                <div className="text-xs text-[#D4AF37]">ارزش کل موجودی فعال</div>
              </div>

              <div className="bg-[#0A0A0A] border border-white/[0.08] p-5 space-y-2">
                <div className="text-[11px] text-white/50 uppercase tracking-widest font-mono">
                  ACTIVE INVENTORY
                </div>
                <div className="text-2xl font-bold text-white font-latin tabular-nums">
                  {metrics.availableVehicles} / {metrics.totalVehicles}
                </div>
                <div className="text-xs text-emerald-400">خودروی آماده تحویل</div>
              </div>

              <div className="bg-[#0A0A0A] border border-white/[0.08] p-5 space-y-2">
                <div className="text-[11px] text-white/50 uppercase tracking-widest font-mono">
                  TEMPORARY IMPORTS
                </div>
                <div className="text-2xl font-bold text-white font-latin tabular-nums">
                  {metrics.temporaryImportCount}
                </div>
                <div className="text-xs text-amber-300">خودروی پلاک گذر موقت سراسری</div>
              </div>

              <div className="bg-[#0A0A0A] border border-white/[0.08] p-5 space-y-2">
                <div className="text-[11px] text-white/50 uppercase tracking-widest font-mono">
                  PENDING PURCHASE CASES
                </div>
                <div className="text-2xl font-bold text-[#D4AF37] font-latin tabular-nums">
                  {metrics.pendingPurchaseRequests}
                </div>
                <div className="text-xs text-white/60">درخواست خرید نیازمند بررسی</div>
              </div>
            </div>

            {/* Regional Distribution Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-[#0A0A0A] border border-white/[0.08] p-6 space-y-4">
                <h3 className="text-sm font-bold text-white font-persian">
                  توزیع ناوگان بر اساس مناطق آزاد تجاری و گذر موقت
                </h3>
                <div className="space-y-3">
                  {metrics.inventoryByZone.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs text-white/80">
                        <span>{item.zone}</span>
                        <span className="font-latin font-bold">{item.count} دستگاه</span>
                      </div>
                      <div className="w-full bg-white/[0.05] h-1.5">
                        <div
                          className="bg-[#D4AF37] h-full"
                          style={{
                            width: `${metrics.totalVehicles > 0 ? (item.count / metrics.totalVehicles) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Inquiries List */}
              <div className="bg-[#0A0A0A] border border-white/[0.08] p-6 space-y-4">
                <h3 className="text-sm font-bold text-white font-persian">
                  آخرین پرونده‌های ثبت شده در سیستم
                </h3>
                <div className="divide-y divide-white/[0.04]">
                  {metrics.recentRequests.map((req) => (
                    <div key={req.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-white">{req.fullName}</div>
                        <div className="text-[11px] text-white/50">{req.vehicleHeadline}</div>
                      </div>
                      <div className="text-left font-mono">
                        <span className="text-[#D4AF37] font-bold block">{req.trackingCode}</span>
                        <span className="text-[10px] text-white/40">{req.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. VEHICLES MANAGEMENT TAB */}
        {activeTab === 'VEHICLES' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">
                فهرست تمامی ۲۰+ خودروی موجود در دیتابیس نوآر موتورز
              </span>
              <button
                onClick={() => {
                  setEditingVehicle(null);
                  setShowVehicleModal(true);
                }}
                className="px-4 py-2.5 text-xs font-semibold text-[#050505] bg-[#F2F0EA] hover:bg-[#D4AF37] transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن خودروی جدید</span>
              </button>
            </div>

            <div className="bg-[#0A0A0A] border border-white/[0.08] overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-white/[0.02] border-b border-white/[0.06] text-white/50">
                  <tr>
                    <th className="p-3.5">خودرو</th>
                    <th className="p-3.5">سال / کارکرد</th>
                    <th className="p-3.5">قیمت کارشناسی</th>
                    <th className="p-3.5">پلاک و موقعیت</th>
                    <th className="p-3.5">وضعیت</th>
                    <th className="p-3.5 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {vehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-white/[0.01]">
                      <td className="p-3.5">
                        <div className="font-bold text-white">
                          {v.brandNameEn} {v.modelNameEn}
                        </div>
                        <div className="text-[11px] text-white/40">{v.headlineFa}</div>
                      </td>
                      <td className="p-3.5 font-latin tabular-nums text-white/70">
                        {v.year} · {v.mileage.toLocaleString()} km
                      </td>
                      <td className="p-3.5 font-latin font-bold tabular-nums text-white">
                        {formatPrice(v.priceToman, 'TOMAN')}
                      </td>
                      <td className="p-3.5">
                        {v.temporaryImport ? (
                          <span className="text-amber-300">گذر موقت ({v.locationCityFa})</span>
                        ) : (
                          <span className="text-emerald-400">{v.freeZoneNameFa || 'منطقه آزاد'}</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span className="text-white/60">{v.availabilityStatus}</span>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(v)}
                            className="p-1.5 text-white/60 hover:text-[#D4AF37]"
                            title="ویرایش"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteVehicle(v.id)}
                            className="p-1.5 text-white/40 hover:text-rose-400"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. PURCHASE REQUESTS TAB */}
        {activeTab === 'PURCHASE_REQUESTS' && (
          <div className="space-y-4">
            <h3 className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase">
              VIP PURCHASE REQUESTS DOSSIER
            </h3>

            <div className="bg-[#0A0A0A] border border-white/[0.08] overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-white/[0.02] border-b border-white/[0.06] text-white/50">
                  <tr>
                    <th className="p-3.5">کد رهگیری</th>
                    <th className="p-3.5">متقاضی خرید</th>
                    <th className="p-3.5">شماره تماس / شهر</th>
                    <th className="p-3.5">خودروی درخواستی</th>
                    <th className="p-3.5">روش هماهنگی</th>
                    <th className="p-3.5">وضعیت پرونده</th>
                    <th className="p-3.5 text-center">تغییر وضعیت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {purchaseRequests.map((r) => (
                    <tr key={r.id} className="hover:bg-white/[0.01]">
                      <td className="p-3.5 font-mono font-bold text-[#D4AF37]">{r.trackingCode}</td>
                      <td className="p-3.5 font-bold text-white">{r.fullName}</td>
                      <td className="p-3.5">
                        <span dir="ltr" className="font-mono text-white/80 block">{r.phone}</span>
                        <span className="text-white/40 text-[11px]">{r.city}</span>
                      </td>
                      <td className="p-3.5 max-w-xs truncate text-white/80">{r.vehicleHeadline}</td>
                      <td className="p-3.5 text-white/60">
                        {r.contactMethod === 'IN_PERSON' ? 'جلسه در شو‌روم VIP' : 'تماس تلفنی'}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 text-[11px] font-medium ${
                            r.status === 'PENDING'
                              ? 'text-amber-400'
                              : r.status === 'UNDER_REVIEW'
                              ? 'text-blue-400'
                              : r.status === 'COMPLETED'
                              ? 'text-emerald-400'
                              : 'text-white/50'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <select
                          value={r.status}
                          onChange={(e) => handleUpdatePurchaseStatus(r.id, e.target.value as any)}
                          className="bg-black border border-white/10 px-2 py-1 text-xs text-white"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                          <option value="APPOINTMENT_SCHEDULED">APPOINTMENT_SCHEDULED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. APPOINTMENTS TAB */}
        {activeTab === 'APPOINTMENTS' && (
          <div className="space-y-4">
            <h3 className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase">
              SHOWROOM VIEWING & TEST-DRIVE SCHEDULE
            </h3>

            <div className="bg-[#0A0A0A] border border-white/[0.08] overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-white/[0.02] border-b border-white/[0.06] text-white/50">
                  <tr>
                    <th className="p-3.5">کد نوبت</th>
                    <th className="p-3.5">نوع درخواست</th>
                    <th className="p-3.5">متقاضی</th>
                    <th className="p-3.5">خودرو</th>
                    <th className="p-3.5">تاریخ / بازه</th>
                    <th className="p-3.5">شعبه شو‌روم</th>
                    <th className="p-3.5">وضعیت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {viewingRequests.map((vr) => (
                    <tr key={vr.id} className="hover:bg-white/[0.01]">
                      <td className="p-3.5 font-mono font-bold text-white">{vr.trackingCode}</td>
                      <td className="p-3.5">
                        <span className="text-[#D4AF37]">
                          {vr.requestType === 'TEST_DRIVE' ? 'تست درایو VIP' : 'بازدید حضوری'}
                        </span>
                      </td>
                      <td className="p-3.5 font-medium text-white">{vr.fullName} ({vr.phone})</td>
                      <td className="p-3.5 text-white/70">{vr.vehicleHeadline}</td>
                      <td className="p-3.5 font-latin text-white/80">{vr.preferredDate} ({vr.preferredTimeSlot})</td>
                      <td className="p-3.5 text-white/60">{vr.showroomLocation}</td>
                      <td className="p-3.5 text-emerald-400 font-medium">{vr.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal for Creating or Editing Vehicle */}
        {showVehicleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-xl bg-[#0A0A0A] border border-white/10 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
                <h3 className="text-base font-bold text-white font-persian">
                  {editingVehicle ? 'ویرایش پرونده خودرو' : 'ثبت خودروی جدید در انبار'}
                </h3>
                <button
                  onClick={() => setShowVehicleModal(false)}
                  className="p-1 text-white/50 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveVehicle} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 mb-1">برند انگلیسی *</label>
                    <input
                      required
                      type="text"
                      value={brandNameEn}
                      onChange={(e) => setBrandNameEn(e.target.value)}
                      className="w-full bg-black border border-white/10 p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-1">برند فارسی *</label>
                    <input
                      required
                      type="text"
                      value={brandNameFa}
                      onChange={(e) => setBrandNameFa(e.target.value)}
                      className="w-full bg-black border border-white/10 p-2.5 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 mb-1">مدل انگلیسی *</label>
                    <input
                      required
                      type="text"
                      value={modelNameEn}
                      onChange={(e) => setModelNameEn(e.target.value)}
                      className="w-full bg-black border border-white/10 p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-1">مدل فارسی *</label>
                    <input
                      required
                      type="text"
                      value={modelNameFa}
                      onChange={(e) => setModelNameFa(e.target.value)}
                      className="w-full bg-black border border-white/10 p-2.5 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white/70 mb-1">سال ساخت *</label>
                    <input
                      required
                      type="number"
                      value={year}
                      onChange={(e) => setYear(parseInt(e.target.value, 10))}
                      className="w-full bg-black border border-white/10 p-2.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-1">قیمت (تومان) *</label>
                    <input
                      required
                      type="number"
                      value={priceToman}
                      onChange={(e) => setPriceToman(parseInt(e.target.value, 10))}
                      className="w-full bg-black border border-white/10 p-2.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-1">کارکرد (km)</label>
                    <input
                      type="number"
                      value={mileage}
                      onChange={(e) => setMileage(parseInt(e.target.value, 10))}
                      className="w-full bg-black border border-white/10 p-2.5 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 mb-1">کلاس بدنه</label>
                    <select
                      value={bodyType}
                      onChange={(e) => setBodyType(e.target.value as any)}
                      className="w-full bg-black border border-white/10 p-2.5 text-white"
                    >
                      <option value="COUPE">COUPE</option>
                      <option value="SUV">SUV</option>
                      <option value="SEDAN">SEDAN</option>
                      <option value="SUPERCAR">SUPERCAR</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/70 mb-1">منطقه آزاد</label>
                    <select
                      value={freeZoneSlug}
                      onChange={(e) => setFreeZoneSlug(e.target.value as any)}
                      className="w-full bg-black border border-white/10 p-2.5 text-white"
                    >
                      <option value="kish">منطقه آزاد کیش</option>
                      <option value="arvand">منطقه آزاد اروند</option>
                      <option value="qeshm">منطقه آزاد قشم</option>
                      <option value="anzali">منطقه آزاد انزلی</option>
                      <option value="chabahar">منطقه آزاد چابهار</option>
                      <option value="maku">منطقه آزاد ماکو</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer text-white/80">
                    <input
                      type="checkbox"
                      checked={temporaryImport}
                      onChange={(e) => setTemporaryImport(e.target.checked)}
                      className="text-[#D4AF37]"
                    />
                    <span>خودروی گذر موقت رسمی (تردد سرزمین اصلی)</span>
                  </label>
                </div>

                <div>
                  <label className="block text-white/70 mb-1">تیتر معرفی خودرو (فارسی)</label>
                  <input
                    type="text"
                    value={headlineFa}
                    onChange={(e) => setHeadlineFa(e.target.value)}
                    className="w-full bg-black border border-white/10 p-2.5 text-white"
                  />
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowVehicleModal(false)}
                    className="px-4 py-2 border border-white/10 text-white/60"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#D4AF37] text-[#050505] font-bold"
                  >
                    ذخیره در سامانه
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

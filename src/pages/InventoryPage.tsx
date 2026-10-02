import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, RotateCcw, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Vehicle, CurrencyMode, CarFilterParams, BrandInfo } from '../types';
import { CarService } from '../services/api';
import { VehicleCard } from '../components/vehicles/VehicleCard';
import { VehicleListSkeleton } from '../components/vehicles/VehicleListSkeleton';
import { AutocompleteSearchBar } from '../components/common/AutocompleteSearchBar';
import { FREE_ZONES } from '../data/locations';

interface InventoryPageProps {
  currency: CurrencyMode;
  onSelectCar: (car: Vehicle) => void;
  initialTemporaryImport?: boolean;
  onToggleFavorite?: (id: string) => void;
  favorites?: string[];
}

export const InventoryPage: React.FC<InventoryPageProps> = ({
  currency,
  onSelectCar,
  initialTemporaryImport = false,
  onToggleFavorite,
  favorites = [],
}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<BrandInfo[]>([]);

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [selectedBodyType, setSelectedBodyType] = useState<string>('ALL');
  const [temporaryImportOnly, setTemporaryImportOnly] = useState<boolean>(initialTemporaryImport);
  const [selectedTransmission, setSelectedTransmission] = useState<string>('ALL');
  const [selectedSort, setSelectedSort] = useState<CarFilterParams['sort']>('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Load brands list on mount
  useEffect(() => {
    CarService.getBrands().then(setBrands);
  }, []);

  // Sync initial prop
  useEffect(() => {
    if (initialTemporaryImport) {
      setTemporaryImportOnly(true);
    }
  }, [initialTemporaryImport]);

  // Fetch cars when filter params change
  useEffect(() => {
    setLoading(true);
    const params: CarFilterParams = {
      search: search || undefined,
      brand: selectedBrand !== 'ALL' ? selectedBrand : undefined,
      freeZone: selectedZone !== 'ALL' ? selectedZone : undefined,
      bodyType: selectedBodyType !== 'ALL' ? selectedBodyType : undefined,
      temporaryImport: temporaryImportOnly ? true : undefined,
      transmission: selectedTransmission !== 'ALL' ? selectedTransmission : undefined,
      sort: selectedSort,
      page,
      limit: 9,
    };

    CarService.getCars(params).then((res) => {
      setVehicles(res.vehicles);
      setTotal(res.total);
      setTotalPages(res.totalPages);
      setLoading(false);
    });
  }, [search, selectedBrand, selectedZone, selectedBodyType, temporaryImportOnly, selectedTransmission, selectedSort, page]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedBrand('ALL');
    setSelectedZone('ALL');
    setSelectedBodyType('ALL');
    setTemporaryImportOnly(false);
    setSelectedTransmission('ALL');
    setSelectedSort('newest');
    setPage(1);
  };

  const hasActiveFilters =
    search ||
    selectedBrand !== 'ALL' ||
    selectedZone !== 'ALL' ||
    selectedBodyType !== 'ALL' ||
    temporaryImportOnly ||
    selectedTransmission !== 'ALL';

  return (
    <div className="min-h-screen bg-[#050505] text-[#F2F0EA] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title & Breadcrumbs */}
        <div className="mb-10 pb-6 border-b border-white/[0.08] flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold mb-1 font-latin">
              NOIR MOTORS INVENTORY CATALOGUE
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white font-persian">
              نمایشگاه جامع خودروهای موجود
            </h1>
            <p className="text-xs text-white/50 mt-1">
              مجموعه کامل خودروهای ترخیص شده مناطق آزاد تجاری و گذر موقت معتبر سراسر کشور
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-white/60">
            <span>تعداد کل موجودی:</span>
            <span className="font-bold text-white font-latin tabular-nums text-sm">
              {total} خودرو
            </span>
          </div>
        </div>

        {/* Search Bar & Sorting Controls */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Autocomplete Search Input */}
          <div className="md:col-span-8">
            <AutocompleteSearchBar
              value={search}
              onChange={(val) => {
                setSearch(val);
                setPage(1);
              }}
              onSelectCar={onSelectCar}
              currency={currency}
            />
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-4 flex items-center justify-end gap-3">
            <span className="text-xs text-white/50 shrink-0">مرتب‌سازی:</span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value as any)}
              className="w-full bg-[#0A0A0A] border border-white/10 px-3 py-3 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
            >
              <option value="newest">جدیدترین پرونده‌ها</option>
              <option value="price_desc">قیمت: از بیشترین به کمترین</option>
              <option value="price_asc">قیمت: از کمترین به بیشترین</option>
              <option value="year_desc">سال ساخت: جدیدترین</option>
              <option value="mileage_asc">کمترین کارکرد (کیلومتر)</option>
            </select>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden px-3.5 py-3 bg-[#0A0A0A] border border-white/10 text-white flex items-center gap-1.5 shrink-0 text-xs"
            >
              <Filter className="w-4 h-4 text-[#D4AF37]" />
              <span>فیلترها</span>
            </button>
          </div>
        </div>

        {/* Quick Filter Horizontal Scrollbar for Desktop/Tablet */}
        <div className="hidden md:flex items-center flex-wrap gap-2 mb-8 pb-4 border-b border-white/[0.04]">
          <span className="text-xs text-white/40 ml-2">دسترسی سریع:</span>

          <button
            onClick={() => {
              setTemporaryImportOnly(!temporaryImportOnly);
              setPage(1);
            }}
            className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
              temporaryImportOnly
                ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37]'
                : 'border-white/10 text-white/70 hover:border-white/30'
            }`}
          >
            گذر موقت (سراسری)
          </button>

          {Object.values(FREE_ZONES).map((z) => (
            <button
              key={z.slug}
              onClick={() => {
                setSelectedZone(selectedZone === z.slug ? 'ALL' : z.slug);
                setPage(1);
              }}
              className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                selectedZone === z.slug
                  ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37]'
                  : 'border-white/10 text-white/70 hover:border-white/30'
              }`}
            >
              {z.nameFa.replace('منطقه آزاد ', '')}
            </button>
          ))}

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 mr-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>حذف فیلترها</span>
            </button>
          )}
        </div>

        {/* Main Content Layout (Sidebar Filters + Vehicle Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden md:block md:col-span-1 space-y-6 bg-[#0A0A0A] border border-white/[0.08] p-5 self-start">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                فیلترهای پیشرفته
              </span>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-rose-400 hover:underline"
                >
                  بازنشانی
                </button>
              )}
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-xs font-medium text-white/70 mb-2">برند خودروساز</label>
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-black/60 border border-white/10 px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="ALL">همه برندها</option>
                {brands.map((b) => (
                  <option key={b.slug} value={b.nameEn}>
                    {b.nameEn} ({b.nameFa})
                  </option>
                ))}
              </select>
            </div>

            {/* Free Zone Filter */}
            <div>
              <label className="block text-xs font-medium text-white/70 mb-2">منطقه آزاد / حوزه تردد</label>
              <select
                value={selectedZone}
                onChange={(e) => {
                  setSelectedZone(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-black/60 border border-white/10 px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="ALL">همه مناطق آزاد و سرزمین اصلی</option>
                {Object.values(FREE_ZONES).map((z) => (
                  <option key={z.slug} value={z.slug}>
                    {z.nameFa}
                  </option>
                ))}
              </select>
            </div>

            {/* Body Type */}
            <div>
              <label className="block text-xs font-medium text-white/70 mb-2">کلاس بدنه</label>
              <select
                value={selectedBodyType}
                onChange={(e) => {
                  setSelectedBodyType(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-black/60 border border-white/10 px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="ALL">تمامی کلاس‌ها</option>
                <option value="COUPE">کوپه و اسپرت (Coupe)</option>
                <option value="SUV">شاسی‌بلند (SUV / Crossover)</option>
                <option value="SEDAN">سدان لوکس (Sedan)</option>
                <option value="SUPERCAR">سوپراسپرت پرفورمنس (Supercar)</option>
              </select>
            </div>

            {/* Transmission */}
            <div>
              <label className="block text-xs font-medium text-white/70 mb-2">نوع گیربکس</label>
              <select
                value={selectedTransmission}
                onChange={(e) => {
                  setSelectedTransmission(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-black/60 border border-white/10 px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="ALL">تمامی گیربکس‌ها</option>
                <option value="DUAL_CLUTCH">دوکلاچه سریع (PDK / DCT)</option>
                <option value="AUTOMATIC">اتوماتیک تیپ‌ترونیک</option>
                <option value="MANUAL">دنده دستی خالص (Manual)</option>
              </select>
            </div>

            {/* Temporary Import Toggle Checkbox */}
            <div className="pt-2 border-t border-white/[0.06]">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80">
                <input
                  type="checkbox"
                  checked={temporaryImportOnly}
                  onChange={(e) => {
                    setTemporaryImportOnly(e.target.checked);
                    setPage(1);
                  }}
                  className="rounded-none bg-black border-white/20 text-[#D4AF37] focus:ring-0"
                />
                <span>فقط خودروهای گذر موقت</span>
              </label>
            </div>
          </aside>

          {/* Vehicle Grid Container */}
          <main className="md:col-span-3">
            {loading ? (
              <VehicleListSkeleton count={6} gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" />
            ) : vehicles.length === 0 ? (
              <div className="text-center py-24 bg-[#0A0A0A] border border-white/[0.08] p-8">
                <SlidersHorizontal className="w-10 h-10 text-white/20 mx-auto mb-4" />
                <h3 className="text-base font-bold text-white font-persian">
                  خودرویی با این مشخصات یافت نشد
                </h3>
                <p className="text-xs text-white/50 mt-1 max-w-sm mx-auto">
                  لطفاً فیلترهای انتخابی یا عبارت جستجو را تغییر دهید تا نتایج نمایش داده شوند.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-5 px-5 py-2 text-xs font-semibold text-[#050505] bg-[#F2F0EA] hover:bg-[#D4AF37] transition-colors"
                >
                  بازنشانی همه فیلترها
                </button>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vehicles.map((v) => (
                    <VehicleCard
                      key={v.id}
                      vehicle={v}
                      currency={currency}
                      onSelect={onSelectCar}
                      isFavorite={favorites.includes(v.id)}
                      onToggleFavorite={onToggleFavorite}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-12 pt-6 border-t border-white/[0.06] flex items-center justify-between">
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="px-4 py-2 text-xs border border-white/10 hover:border-white/40 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-2"
                    >
                      <ChevronRight className="w-4 h-4" />
                      <span>صفحه قبل</span>
                    </button>

                    <div className="text-xs text-white/50 font-latin">
                      صفحه <span className="font-bold text-white tabular-nums">{page}</span> از{' '}
                      <span className="font-bold text-white tabular-nums">{totalPages}</span>
                    </div>

                    <button
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="px-4 py-2 text-xs border border-white/10 hover:border-white/40 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-2"
                    >
                      <span>صفحه بعد</span>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

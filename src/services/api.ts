import {
  Vehicle,
  CarFilterParams,
  PurchaseRequestInput,
  PurchaseRequestRecord,
  ViewingRequestInput,
  ViewingRequestRecord,
  AdminDashboardMetrics,
  BrandInfo,
} from '../types';
import { SEED_VEHICLES } from '../data/seedVehicles';
import { FREE_ZONES } from '../data/locations';

const STORAGE_KEYS = {
  VEHICLES: 'noir_vehicles_v1',
  PURCHASE_REQUESTS: 'noir_purchase_requests_v1',
  VIEWING_REQUESTS: 'noir_viewing_requests_v1',
  FAVORITES: 'noir_favorites_v1',
};

// Initialize in-memory / local storage persistence
function getStoredVehicles(): Vehicle[] {
  if (typeof window === 'undefined') return SEED_VEHICLES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(SEED_VEHICLES));
      return SEED_VEHICLES;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_VEHICLES;
  }
}

function saveVehicles(vehicles: Vehicle[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
  } catch (err) {
    console.error('Failed to save vehicles to storage:', err);
  }
}

function getStoredPurchaseRequests(): PurchaseRequestRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PURCHASE_REQUESTS);
    if (!raw) {
      // Seed initial realistic VIP requests
      const initial: PurchaseRequestRecord[] = [
        {
          id: 'pr-101',
          trackingCode: 'NOIR-74912',
          vehicleId: 'veh-001',
          vehicleHeadline: 'پورشه ۹۱۱ کاررا اس مدل ۲۰۲۴ فول پکیج اسپرت کرونو',
          priceToman: 19800000000,
          fullName: 'مهندس بردیا شایگان',
          phone: '09121112233',
          nationalId: '0012345678',
          city: 'تهران / کیش',
          contactMethod: 'IN_PERSON',
          preferredAppointmentDate: '2026-10-04T10:00',
          preferredCurrency: 'TOMAN',
          status: 'UNDER_REVIEW',
          notes: 'جهت ترخیص و انتقال فوری در کیش. هماهنگی جلسه در شو‌روم برج بهکیش.',
          createdAt: '2026-09-30T14:30:00Z',
        },
        {
          id: 'pr-102',
          trackingCode: 'NOIR-83940',
          vehicleId: 'veh-002',
          vehicleHeadline: 'مرسدس آ‌ام‌گ جی۶۳ گذر موقت ۶ ماهه',
          priceToman: 32000000000,
          fullName: 'دکتر ارشیا خسروی',
          phone: '09128889900',
          city: 'تهران',
          contactMethod: 'PHONE_CALL',
          preferredCurrency: 'USD',
          status: 'PENDING',
          notes: 'بررسی مدارک تمدید گذر موقت و استعلام گمرک غرب تهران.',
          createdAt: '2026-10-01T08:15:00Z',
        },
      ];
      localStorage.setItem(STORAGE_KEYS.PURCHASE_REQUESTS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function savePurchaseRequests(requests: PurchaseRequestRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PURCHASE_REQUESTS, JSON.stringify(requests));
  } catch (err) {
    console.error('Failed to save purchase requests:', err);
  }
}

function getStoredViewingRequests(): ViewingRequestRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VIEWING_REQUESTS);
    if (!raw) {
      const initial: ViewingRequestRecord[] = [
        {
          id: 'vr-201',
          trackingCode: 'VIEW-91204',
          vehicleId: 'veh-003',
          vehicleHeadline: 'رنج روور اتوبیوگرافی لانگ مدل ۲۰۲۴',
          fullName: 'حاج مصطفی رضوی',
          phone: '09161114455',
          preferredDate: '2026-10-05',
          preferredTimeSlot: 'AFTERNOON',
          showroomLocation: 'شوروم مرکزی اهواز (اروند)',
          requestType: 'VIEWING',
          status: 'APPOINTMENT_SCHEDULED',
          createdAt: '2026-09-29T11:00:00Z',
        },
      ];
      localStorage.setItem(STORAGE_KEYS.VIEWING_REQUESTS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveViewingRequests(requests: ViewingRequestRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.VIEWING_REQUESTS, JSON.stringify(requests));
  } catch (err) {
    console.error('Failed to save viewing requests:', err);
  }
}

// API Service Implementation
export const CarService = {
  async getCars(params: CarFilterParams = {}): Promise<{ vehicles: Vehicle[]; total: number; page: number; totalPages: number }> {
    const all = getStoredVehicles();
    let filtered = [...all];

    // Search query (matches title, brand, model, engine, city)
    if (params.search?.trim()) {
      const q = params.search.trim().toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.brandNameEn.toLowerCase().includes(q) ||
          v.brandNameFa.toLowerCase().includes(q) ||
          v.modelNameEn.toLowerCase().includes(q) ||
          v.modelNameFa.toLowerCase().includes(q) ||
          v.headlineFa.toLowerCase().includes(q) ||
          v.engine.toLowerCase().includes(q) ||
          v.locationCityFa.toLowerCase().includes(q)
      );
    }

    // Brand filter
    if (params.brand && params.brand !== 'ALL') {
      filtered = filtered.filter(
        (v) => v.brandNameEn.toLowerCase() === params.brand?.toLowerCase() || v.brandNameFa === params.brand
      );
    }

    // Model filter
    if (params.model && params.model !== 'ALL') {
      filtered = filtered.filter((v) => v.modelNameEn.toLowerCase().includes(params.model!.toLowerCase()));
    }

    // Year range
    if (params.yearMin) {
      filtered = filtered.filter((v) => v.year >= params.yearMin!);
    }
    if (params.yearMax) {
      filtered = filtered.filter((v) => v.year <= params.yearMax!);
    }

    // Price range (in Tomans)
    if (params.priceMin) {
      filtered = filtered.filter((v) => v.priceToman >= params.priceMin!);
    }
    if (params.priceMax) {
      filtered = filtered.filter((v) => v.priceToman <= params.priceMax!);
    }

    // Free Zone
    if (params.freeZone && params.freeZone !== 'ALL') {
      filtered = filtered.filter((v) => v.freeZoneSlug === params.freeZone);
    }

    // Temporary Import toggle
    if (params.temporaryImport !== undefined) {
      filtered = filtered.filter((v) => v.temporaryImport === params.temporaryImport);
    }

    // License Status
    if (params.licenseStatus) {
      filtered = filtered.filter((v) => v.licenseStatus === params.licenseStatus);
    }

    // Availability
    if (params.availability && params.availability !== ('ALL' as any)) {
      filtered = filtered.filter((v) => v.availabilityStatus === params.availability);
    }

    // Body type
    if (params.bodyType && params.bodyType !== 'ALL') {
      filtered = filtered.filter((v) => v.bodyType === params.bodyType);
    }

    // Fuel type
    if (params.fuelType && params.fuelType !== 'ALL') {
      filtered = filtered.filter((v) => v.fuelType === params.fuelType);
    }

    // Transmission
    if (params.transmission && params.transmission !== 'ALL') {
      filtered = filtered.filter((v) => v.transmission === params.transmission);
    }

    // Drive type
    if (params.driveType && params.driveType !== 'ALL') {
      filtered = filtered.filter((v) => v.driveType === params.driveType);
    }

    // Sorting
    switch (params.sort) {
      case 'price_asc':
        filtered.sort((a, b) => a.priceToman - b.priceToman);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.priceToman - a.priceToman);
        break;
      case 'year_desc':
        filtered.sort((a, b) => b.year - a.year);
        break;
      case 'mileage_asc':
        filtered.sort((a, b) => a.mileage - b.mileage);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    const total = filtered.length;
    const limit = params.limit || 9;
    const page = params.page || 1;
    const totalPages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return {
      vehicles: paginated,
      total,
      page,
      totalPages,
    };
  },

  async getCarBySlug(slug: string): Promise<Vehicle | null> {
    const all = getStoredVehicles();
    return all.find((v) => v.slug === slug || v.id === slug) || null;
  },

  async getFeaturedCars(): Promise<Vehicle[]> {
    const all = getStoredVehicles();
    return all.filter((v) => v.featured);
  },

  async getSimilarCars(currentCar: Vehicle): Promise<Vehicle[]> {
    const all = getStoredVehicles();
    return all
      .filter(
        (v) =>
          v.id !== currentCar.id &&
          (v.bodyType === currentCar.bodyType ||
            v.brandNameEn === currentCar.brandNameEn ||
            v.freeZoneSlug === currentCar.freeZoneSlug)
      )
      .slice(0, 3);
  },

  async getBrands(): Promise<BrandInfo[]> {
    const all = getStoredVehicles();
    const brandMap = new Map<string, BrandInfo>();

    all.forEach((v) => {
      const key = v.brandNameEn;
      if (!brandMap.has(key)) {
        brandMap.set(key, {
          nameEn: v.brandNameEn,
          nameFa: v.brandNameFa,
          slug: v.brandNameEn.toLowerCase().replace(/\s+/g, '-'),
          country: v.brandNameEn.includes('Porsche') || v.brandNameEn.includes('Mercedes') || v.brandNameEn.includes('BMW') || v.brandNameEn.includes('Audi') ? 'آلمان' : v.brandNameEn.includes('Toyota') || v.brandNameEn.includes('Lexus') || v.brandNameEn.includes('Nissan') ? 'ژاپن' : v.brandNameEn.includes('Land Rover') ? 'بریتانیا' : 'آمریکا',
          vehicleCount: 0,
        });
      }
      brandMap.get(key)!.vehicleCount += 1;
    });

    return Array.from(brandMap.values());
  },

  async createCar(car: Partial<Vehicle>): Promise<Vehicle> {
    const all = getStoredVehicles();
    const newId = `veh-${Date.now().toString().slice(-4)}`;
    const brandNameEn = car.brandNameEn || 'Porsche';
    const modelNameEn = car.modelNameEn || 'Sport';
    const slug = car.slug || `${brandNameEn.toLowerCase().replace(/\s+/g, '-')}-${modelNameEn.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-4)}`;

    const newVehicle: Vehicle = {
      id: newId,
      slug,
      brandNameEn,
      brandNameFa: car.brandNameFa || brandNameEn,
      modelNameEn,
      modelNameFa: car.modelNameFa || modelNameEn,
      trim: car.trim || '',
      year: car.year || 2024,
      priceToman: car.priceToman || 20000000000,
      priceUsd: car.priceUsd || Math.round((car.priceToman || 20000000000) / 92000),
      mileage: car.mileage || 0,
      fuelType: car.fuelType || 'BENZINE',
      transmission: car.transmission || 'AUTOMATIC',
      engine: car.engine || 'V8 Bi-Turbo',
      enginePower: car.enginePower || 500,
      bodyType: car.bodyType || 'COUPE',
      driveType: car.driveType || 'AWD',
      exteriorColorFa: car.exteriorColorFa || 'مشکی متالیک',
      exteriorColorEn: car.exteriorColorEn || 'Black Metallic',
      interiorColorFa: car.interiorColorFa || 'چرم مشکی',
      interiorColorEn: car.interiorColorEn || 'Black Leather',
      temporaryImport: !!car.temporaryImport,
      temporaryLicenseDaysRemaining: car.temporaryLicenseDaysRemaining || (car.temporaryImport ? 90 : undefined),
      licenseStatus: car.licenseStatus || (car.temporaryImport ? 'TEMPORARY_IMPORT' : 'FREE_ZONE'),
      documentStatus: car.documentStatus || 'READY_FOR_TRANSFER',
      availabilityStatus: car.availabilityStatus || 'AVAILABLE',
      featured: !!car.featured,
      headlineFa: car.headlineFa || `${car.brandNameFa || brandNameEn} ${car.modelNameFa || modelNameEn} مدل ${car.year || 2024}`,
      descriptionFa: car.descriptionFa || 'خودروی لوکس وارداتی ویژه متقاضیان خاص.',
      locationCityFa: car.locationCityFa || 'تهران',
      locationCityEn: car.locationCityEn || 'Tehran',
      freeZoneSlug: car.freeZoneSlug,
      freeZoneNameFa: car.freeZoneSlug ? FREE_ZONES[car.freeZoneSlug]?.nameFa : undefined,
      images: car.images && car.images.length > 0 ? car.images : [
        { id: `img-${newId}-1`, url: '/src/assets/images/hero_luxury_hypercar_1790889964433.jpg', category: 'EXTERIOR', isPrimary: true },
      ],
      specifications: car.specifications || {
        acceleration0to100: 4.0,
        topSpeedKmh: 280,
        torqueNm: 600,
        featuresFa: ['سیستم تعلیق پیشرفته تطبیقی', 'سیستم صوتی استودیویی لوکس'],
      },
      documents: car.documents || [
        { id: `doc-${newId}-1`, titleFa: 'پروانه ترخیص گمرکی نوآر موتورز', docType: 'CUSTOMS_DECLARATION', isVerified: true },
      ],
      priceHistories: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    all.unshift(newVehicle);
    saveVehicles(all);
    return newVehicle;
  },

  async updateCar(id: string, updates: Partial<Vehicle>): Promise<Vehicle | null> {
    const all = getStoredVehicles();
    const index = all.findIndex((v) => v.id === id);
    if (index === -1) return null;

    const current = all[index];
    const priceHistories = [...(current.priceHistories || [])];

    // Record price modification history
    if (updates.priceToman && updates.priceToman !== current.priceToman) {
      priceHistories.unshift({
        id: `ph-${Date.now().toString().slice(-4)}`,
        oldPriceToman: current.priceToman,
        newPriceToman: updates.priceToman,
        changeReason: 'به‌روزرسانی قیمت در سامانه مدیریت نوآر موتورز',
        changedAt: new Date().toISOString().split('T')[0],
      });
    }

    const updated: Vehicle = {
      ...current,
      ...updates,
      priceHistories,
      updatedAt: new Date().toISOString(),
    };

    all[index] = updated;
    saveVehicles(all);
    return updated;
  },

  async deleteCar(id: string): Promise<boolean> {
    const all = getStoredVehicles();
    const filtered = all.filter((v) => v.id !== id);
    if (filtered.length === all.length) return false;
    saveVehicles(filtered);
    return true;
  },

  // Purchase Requests
  async submitPurchaseRequest(input: PurchaseRequestInput): Promise<PurchaseRequestRecord> {
    const car = await this.getCarBySlug(input.vehicleId);
    if (!car) throw new Error('خودروی مورد نظر یافت نشد.');

    const trackingCode = `NOIR-${Math.floor(10000 + Math.random() * 90000)}`;
    const record: PurchaseRequestRecord = {
      ...input,
      id: `pr-${Date.now()}`,
      trackingCode,
      status: 'PENDING',
      vehicleHeadline: car.headlineFa,
      priceToman: car.priceToman,
      createdAt: new Date().toISOString(),
    };

    const requests = getStoredPurchaseRequests();
    requests.unshift(record);
    savePurchaseRequests(requests);
    return record;
  },

  async getPurchaseRequests(): Promise<PurchaseRequestRecord[]> {
    return getStoredPurchaseRequests();
  },

  async updatePurchaseRequestStatus(id: string, status: PurchaseRequestRecord['status']): Promise<PurchaseRequestRecord | null> {
    const requests = getStoredPurchaseRequests();
    const index = requests.findIndex((r) => r.id === id);
    if (index === -1) return null;
    requests[index].status = status;
    savePurchaseRequests(requests);
    return requests[index];
  },

  // Viewing & Test Drive Requests
  async submitViewingRequest(input: ViewingRequestInput): Promise<ViewingRequestRecord> {
    const car = await this.getCarBySlug(input.vehicleId);
    if (!car) throw new Error('خودرو یافت نشد.');

    const trackingCode = `${input.requestType === 'TEST_DRIVE' ? 'DRIVE' : 'VIEW'}-${Math.floor(10000 + Math.random() * 90000)}`;
    const record: ViewingRequestRecord = {
      ...input,
      id: `vr-${Date.now()}`,
      trackingCode,
      status: 'PENDING',
      vehicleHeadline: car.headlineFa,
      createdAt: new Date().toISOString(),
    };

    const requests = getStoredViewingRequests();
    requests.unshift(record);
    saveViewingRequests(requests);
    return record;
  },

  async getViewingRequests(): Promise<ViewingRequestRecord[]> {
    return getStoredViewingRequests();
  },

  // Admin Dashboard Analytics
  async getAdminDashboardMetrics(): Promise<AdminDashboardMetrics> {
    const vehicles = getStoredVehicles();
    const purchaseRequests = getStoredPurchaseRequests();
    const viewingRequests = getStoredViewingRequests();

    const available = vehicles.filter((v) => v.availabilityStatus === 'AVAILABLE').length;
    const sold = vehicles.filter((v) => v.availabilityStatus === 'SOLD').length;
    const temporaryImportCount = vehicles.filter((v) => v.temporaryImport).length;
    const freeZoneCount = vehicles.filter((v) => !!v.freeZoneSlug).length;

    const totalInventoryValueToman = vehicles
      .filter((v) => v.availabilityStatus === 'AVAILABLE')
      .reduce((sum, v) => sum + v.priceToman, 0);

    const pendingPurchase = purchaseRequests.filter((r) => r.status === 'PENDING' || r.status === 'UNDER_REVIEW').length;
    const pendingViewing = viewingRequests.filter((r) => r.status === 'PENDING').length;

    // Inventory grouped by zone
    const zoneCounts: Record<string, number> = {
      'منطقه آزاد کیش': 0,
      'منطقه آزاد اروند': 0,
      'منطقه آزاد قشم': 0,
      'منطقه آزاد انزلی': 0,
      'منطقه آزاد چابهار': 0,
      'منطقه آزاد ماکو': 0,
      'گذر موقت (سراسری)': 0,
    };

    vehicles.forEach((v) => {
      if (v.temporaryImport) {
        zoneCounts['گذر موقت (سراسری)'] += 1;
      } else if (v.freeZoneNameFa && zoneCounts[v.freeZoneNameFa] !== undefined) {
        zoneCounts[v.freeZoneNameFa] += 1;
      }
    });

    const inventoryByZone = Object.entries(zoneCounts).map(([zone, count]) => ({ zone, count }));

    return {
      totalVehicles: vehicles.length,
      availableVehicles: available,
      soldVehicles: sold,
      temporaryImportCount,
      freeZoneCount,
      totalInventoryValueToman,
      pendingPurchaseRequests: pendingPurchase,
      pendingViewingRequests: pendingViewing,
      recentRequests: purchaseRequests.slice(0, 5),
      inventoryByZone,
    };
  },

  // Guest Favorites
  getFavorites(): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  toggleFavorite(vehicleId: string): boolean {
    if (typeof window === 'undefined') return false;
    const favs = this.getFavorites();
    const index = favs.indexOf(vehicleId);
    let isFav = false;
    if (index > -1) {
      favs.splice(index, 1);
      isFav = false;
    } else {
      favs.push(vehicleId);
      isFav = true;
    }
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
    return isFav;
  },
};

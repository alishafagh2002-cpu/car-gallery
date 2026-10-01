export type CurrencyMode = 'TOMAN' | 'USD' | 'AED';

export type AvailabilityStatus =
  | 'AVAILABLE'
  | 'RESERVED'
  | 'IN_CUSTOMS'
  | 'PENDING_INSPECTION'
  | 'SOLD';

export type LicenseStatus =
  | 'NATIONAL_PLATE'     // پلاک ملی
  | 'FREE_ZONE'          // پلاک منطقه آزاد
  | 'TEMPORARY_IMPORT'   // گذر موقت
  | 'EMBASSY';           // پلاک دیپلماتیک

export type DocumentStatus =
  | 'FULL_DOCS_CLEARED'  // سند دست اول - ترخیص قطعی
  | 'CUSTOMS_BONDED'     // دارای برگه تردد گمرکی
  | 'TAX_PAID'           // مفاصاحساب مالیاتی پرداخت شده
  | 'READY_FOR_TRANSFER';// آماده انتقال سند

export type RequestStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'APPOINTMENT_SCHEDULED'
  | 'DEPOSIT_RECEIVED'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED';

export interface VehicleImage {
  id: string;
  url: string;
  captionFa?: string;
  category: 'EXTERIOR' | 'INTERIOR' | 'ENGINE' | 'WHEEL' | 'COCKPIT';
  isPrimary?: boolean;
}

export interface VehicleSpecification {
  acceleration0to100: number; // in seconds
  topSpeedKmh: number;        // km/h
  torqueNm: number;           // Nm
  displacementCc?: number;
  cylinders?: number;
  weightKg?: number;
  fuelTankLiters?: number;
  dimensionsMm?: string;
  featuresFa: string[];
}

export interface VehicleDocument {
  id: string;
  titleFa: string;
  docType: 'CUSTOMS_DECLARATION' | 'TECHNICAL_CERT' | 'REGISTRATION' | 'TAX_CLEARANCE';
  isVerified: boolean;
  issuedDate?: string;
}

export interface PriceHistory {
  id: string;
  oldPriceToman: number; // stored safely as number/bigint
  newPriceToman: number;
  changeReason?: string;
  changedAt: string;
}

export interface Vehicle {
  id: string;
  slug: string;
  brandNameEn: string;
  brandNameFa: string;
  modelNameEn: string;
  modelNameFa: string;
  trim?: string;
  year: number;
  priceToman: number;      // Exact amount in Tomans (e.g. 18500000000 = 18.5 Billion Tomans)
  priceUsd: number;        // Equivalent USD (e.g. 185000)
  priceAed?: number;       // Equivalent AED
  mileage: number;         // in kilometers
  fuelType: 'BENZINE' | 'HYBRID' | 'ELECTRIC' | 'DIESEL';
  transmission: 'DUAL_CLUTCH' | 'AUTOMATIC' | 'MANUAL';
  engine: string;          // e.g. "4.0L Twin-Turbo V8"
  enginePower: number;     // HP
  bodyType: 'COUPE' | 'SUV' | 'SEDAN' | 'CONVERTIBLE' | 'SUPERCAR';
  driveType: 'AWD' | 'RWD' | '4WD' | 'FWD';
  exteriorColorFa: string;
  exteriorColorEn: string;
  interiorColorFa: string;
  interiorColorEn: string;

  temporaryImport: boolean;
  temporaryLicenseDaysRemaining?: number; // e.g. 75 days remaining
  licenseStatus: LicenseStatus;
  documentStatus: DocumentStatus;
  availabilityStatus: AvailabilityStatus;
  featured: boolean;

  headlineFa: string;
  descriptionFa: string;
  descriptionEn?: string;

  locationCityFa: string;
  locationCityEn: string;
  freeZoneSlug?: 'kish' | 'qeshm' | 'arvand' | 'anzali' | 'chabahar' | 'maku';
  freeZoneNameFa?: string;

  images: VehicleImage[];
  specifications: VehicleSpecification;
  documents: VehicleDocument[];
  priceHistories?: PriceHistory[];

  createdAt: string;
  updatedAt: string;
}

export interface FreeZoneInfo {
  slug: string;
  nameFa: string;
  nameEn: string;
  provinceFa: string;
  customsCode: string;
  taxIncentive: string;
  descriptionFa: string;
  rulesFa: string[];
  vehicleCount: number;
  coverImage: string;
}

export interface BrandInfo {
  nameEn: string;
  nameFa: string;
  slug: string;
  country: string;
  vehicleCount: number;
}

export interface PurchaseRequestInput {
  vehicleId: string;
  fullName: string;
  phone: string;
  nationalId?: string;
  city: string;
  contactMethod: 'PHONE_CALL' | 'WHATSAPP' | 'IN_PERSON';
  preferredAppointmentDate?: string;
  preferredCurrency: CurrencyMode;
  notes?: string;
}

export interface PurchaseRequestRecord extends PurchaseRequestInput {
  id: string;
  trackingCode: string;
  status: RequestStatus;
  vehicleHeadline: string;
  priceToman: number;
  createdAt: string;
}

export interface ViewingRequestInput {
  vehicleId: string;
  fullName: string;
  phone: string;
  preferredDate: string;
  preferredTimeSlot: 'MORNING' | 'AFTERNOON' | 'EVENING';
  showroomLocation: string;
  requestType: 'VIEWING' | 'TEST_DRIVE';
}

export interface ViewingRequestRecord extends ViewingRequestInput {
  id: string;
  trackingCode: string;
  status: RequestStatus;
  vehicleHeadline: string;
  createdAt: string;
}

export interface CarFilterParams {
  search?: string;
  brand?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number; // in Tomans
  priceMax?: number;
  location?: string;
  freeZone?: string;
  temporaryImport?: boolean;
  licenseStatus?: LicenseStatus;
  availability?: AvailabilityStatus;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  driveType?: string;
  sort?: 'price_asc' | 'price_desc' | 'year_desc' | 'mileage_asc' | 'newest';
  page?: number;
  limit?: number;
}

export interface AdminDashboardMetrics {
  totalVehicles: number;
  availableVehicles: number;
  soldVehicles: number;
  temporaryImportCount: number;
  freeZoneCount: number;
  totalInventoryValueToman: number;
  pendingPurchaseRequests: number;
  pendingViewingRequests: number;
  recentRequests: PurchaseRequestRecord[];
  inventoryByZone: { zone: string; count: number }[];
}

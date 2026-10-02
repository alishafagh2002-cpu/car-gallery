import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'FA' | 'EN';

export interface Translations {
  [key: string]: {
    fa: string;
    en: string;
  };
}

export const TRANSLATIONS: Translations = {
  // Brand & Slogans
  brandName: {
    fa: 'نوآر موتورز',
    en: 'NOIR MOTORS',
  },
  brandTagline: {
    fa: 'مرجع تخصصی خرید سوپراسپرت‌های مناطق آزاد و گذر موقت',
    en: 'Executive Concierge for Free Trade Zone Supercars & Temporary Imports',
  },

  // Navbar Links
  navCars: {
    fa: 'خودروها',
    en: 'Inventory',
  },
  navFreeZones: {
    fa: 'مناطق آزاد',
    en: 'Free Zones',
  },
  navTemporaryImport: {
    fa: 'گذر موقت',
    en: 'Temporary Import',
  },
  navAbout: {
    fa: 'درباره ما',
    en: 'About Us',
  },
  navContact: {
    fa: 'ارتباط با ما',
    en: 'Contact',
  },
  navAdmin: {
    fa: 'پنل مدیریت',
    en: 'Executive Admin',
  },
  navConsultationCTA: {
    fa: 'درخواست مشاوره VIP',
    en: 'VIP Consultation',
  },
  navLanguageLabel: {
    fa: 'زبان',
    en: 'Language',
  },

  // Currency
  currencyToman: {
    fa: 'تومان',
    en: 'TOMAN',
  },
  currencyUSD: {
    fa: 'دلار',
    en: 'USD',
  },

  // Search & Catalog
  searchPlaceholder: {
    fa: 'جستجوی هوشمند بر اساس برند، مدل یا سال ساخت (پورشه، G63، ۲۰۲۴)...',
    en: 'Search by brand, model or year (Porsche, G63, 2024)...',
  },
  catalogTitle: {
    fa: 'نمایشگاه جامع خودروهای موجود',
    en: 'Complete Inventory Showcase',
  },
  catalogSubtitle: {
    fa: 'مجموعه کامل خودروهای ترخیص شده مناطق آزاد تجاری و گذر موقت معتبر سراسر کشور',
    en: 'Curated collection of certified Free Zone & Temporary Import vehicles across Iran',
  },
  totalInventoryCount: {
    fa: 'تعداد کل موجودی:',
    en: 'Total Fleet:',
  },
  vehiclesUnit: {
    fa: 'خودرو',
    en: 'Vehicles',
  },
  sortBy: {
    fa: 'مرتب‌سازی:',
    en: 'Sort By:',
  },
  sortNewest: {
    fa: 'جدیدترین پرونده‌ها',
    en: 'Newest Arrivals',
  },
  sortPriceDesc: {
    fa: 'قیمت: از بیشترین به کمترین',
    en: 'Price: High to Low',
  },
  sortPriceAsc: {
    fa: 'قیمت: از کمترین به بیشترین',
    en: 'Price: Low to High',
  },
  sortYearDesc: {
    fa: 'سال ساخت: جدیدترین',
    en: 'Year: Newest',
  },
  sortMileageAsc: {
    fa: 'کمترین کارکرد',
    en: 'Lowest Mileage',
  },
  filters: {
    fa: 'فیلترها',
    en: 'Filters',
  },
  resetFilters: {
    fa: 'پاک کردن فیلترها',
    en: 'Reset Filters',
  },
  allBrands: {
    fa: 'همه برندها',
    en: 'All Brands',
  },
  allZones: {
    fa: 'همه مناطق',
    en: 'All Zones',
  },

  // Action Buttons & Badges
  viewDossier: {
    fa: 'مشاهده پرونده تخصصی',
    en: 'View Dossier',
  },
  downloadPdf: {
    fa: 'کاتالوگ و شناسنامه PDF',
    en: 'Download PDF Dossier',
  },
  compare: {
    fa: 'مقایسه',
    en: 'Compare',
  },
  favorites: {
    fa: 'علاقه‌مندی‌ها',
    en: 'Favorites',
  },
  share: {
    fa: 'اشتراک‌گذاری',
    en: 'Share',
  },
  requestPurchase: {
    fa: 'درخواست خرید و بیعانه',
    en: 'Acquisition & Escrow',
  },
  bookViewing: {
    fa: 'رزرو بازدید حضوری',
    en: 'Schedule Viewing',
  },
  bookTestDrive: {
    fa: 'درخواست تست درایو',
    en: 'Request Test Drive',
  },

  // Customs & Status
  temporaryImportBadge: {
    fa: 'پلاک گذر موقت فراجا',
    en: 'Temporary Import Plate',
  },
  freeZoneBadge: {
    fa: 'پلاک منطقه آزاد',
    en: 'Free Zone Plate',
  },
  customsCleared: {
    fa: 'ترخیص قطعی گمرک',
    en: 'Customs Cleared',
  },
  daysRemaining: {
    fa: 'روز مهلت تردد',
    en: 'Days Remaining',
  },

  // Footer & Disclaimer
  footerTehran: {
    fa: 'تهران: خیابان فرشته، برج نماد الهیه، طبقه اختصاصی نوآر',
    en: 'Tehran: Fereshteh St, Namad Elahieh Tower, Private Noir Suite',
  },
  footerKish: {
    fa: 'کیش: بلوار ساحلی سنایی، شو‌روم مرکزی نوآر موتورز',
    en: 'Kish Island: Sanaei Coastal Blvd, Central Noir Showroom',
  },
  footerRights: {
    fa: 'کلیه حقوق این پایگاه متعلق به شرکت نوآر موتورز می‌باشد.',
    en: 'All rights reserved by NOIR MOTORS Iran.',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'noir_app_language_v1';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored === 'FA' || stored === 'EN') return stored;
    } catch {
      // Ignore storage errors
    }
    return 'FA';
  });

  const dir: 'rtl' | 'ltr' = language === 'FA' ? 'rtl' : 'ltr';
  const isRTL = language === 'FA';

  useEffect(() => {
    // Synchronize HTML attributes with current language
    document.documentElement.lang = language === 'FA' ? 'fa' : 'en';
    document.documentElement.dir = dir;
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Ignore storage errors
    }
  }, [language, dir]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'FA' ? 'EN' : 'FA'));
  };

  const t = (key: string): string => {
    const item = TRANSLATIONS[key];
    if (!item) return key;
    return language === 'FA' ? item.fa : item.en;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        dir,
        isRTL,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

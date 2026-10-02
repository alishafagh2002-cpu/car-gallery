import { Vehicle } from '../types';
import { formatPrice } from './formatters';

interface SeoMetadataOptions {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  structuredData?: Record<string, unknown>;
}

function updateMetaTag(propertyOrName: string, content: string, isProperty = false) {
  const selector = isProperty ? `meta[property="${propertyOrName}"]` : `meta[name="${propertyOrName}"]`;
  let element = document.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(isProperty ? 'property' : 'name', propertyOrName);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function updateCanonicalLink(url: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

function updateStructuredData(schemaData?: Record<string, unknown>) {
  let script = document.getElementById('seo-json-ld') as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = 'seo-json-ld';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  if (schemaData) {
    script.textContent = JSON.stringify(schemaData, null, 2);
  }
}

function resolveFullUrl(pathOrUrl?: string): string {
  if (!pathOrUrl) {
    return `${window.location.origin}${window.location.pathname}`;
  }
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }
  return `${window.location.origin}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

export function updatePageSeo(options: SeoMetadataOptions) {
  const {
    title,
    description,
    image = '/images/hero_supercar_studio_1790889986619.jpg',
    url,
    type = 'website',
    structuredData,
  } = options;

  const fullUrl = resolveFullUrl(url);
  const fullImageUrl = resolveFullUrl(image);

  // 1. Page Title
  document.title = title;

  // 2. Standard Meta Tags
  updateMetaTag('description', description);
  updateMetaTag('robots', 'index, follow');

  // 3. OpenGraph Tags
  updateMetaTag('og:site_name', 'NOIR MOTORS', true);
  updateMetaTag('og:title', title, true);
  updateMetaTag('og:description', description, true);
  updateMetaTag('og:type', type, true);
  updateMetaTag('og:url', fullUrl, true);
  updateMetaTag('og:image', fullImageUrl, true);
  updateMetaTag('og:locale', 'fa_IR', true);

  // 4. Twitter / X Tags
  updateMetaTag('twitter:card', 'summary_large_image');
  updateMetaTag('twitter:title', title);
  updateMetaTag('twitter:description', description);
  updateMetaTag('twitter:image', fullImageUrl);

  // 5. Canonical Link
  updateCanonicalLink(fullUrl);

  // 6. Schema.org JSON-LD
  if (structuredData) {
    updateStructuredData(structuredData);
  }
}

/**
 * Builds rich Schema.org Car structured data and updates meta tags for a specific vehicle
 */
export function updateCarDetailSeo(vehicle: Vehicle) {
  const brandAndModel = `${vehicle.brandNameFa} ${vehicle.modelNameFa} ${vehicle.year}`;
  const englishName = `${vehicle.brandNameEn} ${vehicle.modelNameEn} ${vehicle.year}`;
  const priceFormatted = formatPrice(vehicle.priceToman, 'TOMAN', { compact: true, showSymbol: true });
  
  const zoneOrStatus = vehicle.temporaryImport
    ? 'پلاک گذر موقت'
    : vehicle.freeZoneNameFa || 'منطقه آزاد';

  const title = `${brandAndModel} (${zoneOrStatus}) | نوآر موتورز`;
  const description = `${vehicle.headlineFa || `${brandAndModel} در نوآر موتورز.`} قیمت: ${priceFormatted} | کارکرد: ${vehicle.mileage} کیلومتر | ترخیص رسمی و بررسی فنی تخصصی.`;

  const primaryImage = vehicle.images.find((img) => img.isPrimary)?.url || vehicle.images[0]?.url || '/images/hero_supercar_studio_1790889986619.jpg';
  const fullCarUrl = `${window.location.origin}/cars/${vehicle.slug}`;
  const fullImageUrl = resolveFullUrl(primaryImage);

  const carStructuredData: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: englishName,
    alternateName: brandAndModel,
    brand: {
      '@type': 'Brand',
      name: vehicle.brandNameEn,
      alternateName: vehicle.brandNameFa,
    },
    model: vehicle.modelNameEn,
    vehicleModelDate: vehicle.year.toString(),
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: vehicle.mileage,
      unitCode: 'KMT',
    },
    vehicleTransmission: vehicle.transmission,
    fuelType: vehicle.fuelType,
    bodyType: vehicle.bodyType,
    driveWheelConfiguration: vehicle.driveType,
    description: vehicle.descriptionFa,
    image: fullImageUrl,
    url: fullCarUrl,
    offers: {
      '@type': 'Offer',
      price: vehicle.priceToman.toString(),
      priceCurrency: 'IRT',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: vehicle.priceToman.toString(),
        priceCurrency: 'IRT',
        description: `قیمت تومان (${zoneOrStatus})`,
      },
      itemCondition: vehicle.mileage > 500 ? 'https://schema.org/UsedCondition' : 'https://schema.org/NewCondition',
      availability: vehicle.availabilityStatus === 'AVAILABLE' ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
      url: fullCarUrl,
      seller: {
        '@type': 'AutoDealer',
        name: 'NOIR MOTORS',
        url: window.location.origin,
      },
    },
  };

  updatePageSeo({
    title,
    description,
    image: primaryImage,
    url: `/cars/${vehicle.slug}`,
    type: 'product',
    structuredData: carStructuredData,
  });
}

/**
 * Luxury automotive placeholder and URL resolver for bulletproof image loading
 * in both development and production shared environments.
 */

export const FALLBACK_CAR_IMAGE = '/images/hero_supercar_studio_1790889986619.jpg';

export function getSafeImageUrl(url?: string): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return FALLBACK_CAR_IMAGE;
  }

  let cleanUrl = url.trim();

  // Normalize /src/assets/images/... to /images/... for production build compatibility
  if (cleanUrl.startsWith('/src/assets/images/')) {
    cleanUrl = cleanUrl.replace('/src/assets/images/', '/images/');
  } else if (cleanUrl.startsWith('/src/images/')) {
    cleanUrl = cleanUrl.replace('/src/images/', '/images/');
  }

  return cleanUrl;
}

export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  const target = e.currentTarget;
  // If failed image is /src/assets/images/..., try replacing with /images/... first
  if (target.src.includes('/src/assets/images/')) {
    target.src = target.src.replace('/src/assets/images/', '/images/');
    return;
  }
  // Prevent infinite error loop if fallback fails
  if (!target.src.includes('hero_supercar_studio_1790889986619.jpg')) {
    target.src = FALLBACK_CAR_IMAGE;
  }
}

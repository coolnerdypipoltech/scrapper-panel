export const APIFY_BASE       = 'https://api.apify.com/v2';
export const DEFAULT_YT_ACTOR = 'bernardo/youtube-scraper';
export const DEFAULT_TT_ACTOR = 'clockworks/tiktok-scraper';
export const DEFAULT_FB_ACTOR = 'apify/facebook-search-scraper';
export const DEFAULT_IG_ACTOR = 'apify/instagram-scraper';
export const DEFAULT_GN_ACTOR = '';

/** Handles both flat dot-notation keys ("authorMeta.name") and nested objects */
export const getValue = (obj, key) => {
  if (!obj) return undefined;
  if (key in obj) return obj[key];
  return key.split('.').reduce((acc, part) => (acc != null ? acc[part] : undefined), obj);
};

export const formatNumber = (n) => {
  if (n == null || n === '') return '-';
  const num = Number(n);
  if (isNaN(num)) return '-';
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000)     return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString('es');
};

export const tagItems = (items) =>
  items.map((item, i) => ({ ...item, _id: `${Date.now()}_${i}` }));

export const getOldestPostDate = (range) => {
  if (!range) return null;
  const days = { '2d': 2, '3d': 3, '7d': 7 }[range];
  if (!days) return null;
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
};

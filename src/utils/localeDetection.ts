import { MeasurementSystem } from '../types';

/**
 * Standard country/region codes that officially or predominantly
 * use US Customary / Imperial measurement units:
 * - US: United States
 * - LR: Liberia
 * - MM: Myanmar (Burma)
 */
const IMPERIAL_REGIONS = new Set(['US', 'LR', 'MM']);

/**
 * Common US time zones to provide secondary confirmation
 * when language string lacks an explicit region subtag (e.g. "en")
 */
const US_TIMEZONES = new Set([
  'America/New_York',
  'America/Detroit',
  'America/Kentucky/Louisville',
  'America/Kentucky/Monticello',
  'America/Indiana/Indianapolis',
  'America/Indiana/Vincennes',
  'America/Indiana/Winamac',
  'America/Indiana/Marengo',
  'America/Indiana/Petersburg',
  'America/Indiana/Vevay',
  'America/Chicago',
  'America/Indiana/Tell_City',
  'America/Indiana/Knox',
  'America/Menominee',
  'America/North_Dakota/Center',
  'America/North_Dakota/New_Salem',
  'America/North_Dakota/Beulah',
  'America/Denver',
  'America/Boise',
  'America/Phoenix',
  'America/Los_Angeles',
  'America/Anchorage',
  'America/Juneau',
  'America/Sitka',
  'America/Metlakatla',
  'America/Yakutat',
  'America/Nome',
  'America/Adak',
  'Pacific/Honolulu',
]);

/**
 * Detects whether the user's browser environment corresponds to an
 * Imperial or Metric country upon their first visit.
 */
export function detectBrowserMeasurementSystem(): MeasurementSystem {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return 'imperial';
  }

  // 1. Gather all candidate language tags (e.g. ['en-GB', 'en', 'fr'])
  const candidateLanguages: string[] = [];
  if (Array.isArray(navigator.languages) && navigator.languages.length > 0) {
    candidateLanguages.push(...navigator.languages);
  }
  if (navigator.language) {
    candidateLanguages.push(navigator.language);
  }

  // 2. Inspect candidate languages for explicit country codes
  for (const lang of candidateLanguages) {
    if (!lang) continue;

    // Check with Intl.Locale if supported
    try {
      if (typeof Intl !== 'undefined' && Intl.Locale) {
        const localeObj = new Intl.Locale(lang);
        if (localeObj.region) {
          const region = localeObj.region.toUpperCase();
          return IMPERIAL_REGIONS.has(region) ? 'imperial' : 'metric';
        }
      }
    } catch {
      // Fallback to regex parsing below
    }

    // Standard regex parse for language-COUNTRY (e.g. "en-US", "es-US", "en-GB")
    const match = lang.match(/[-_]([A-Za-z]{2})\b/);
    if (match && match[1]) {
      const region = match[1].toUpperCase();
      return IMPERIAL_REGIONS.has(region) ? 'imperial' : 'metric';
    }
  }

  // 3. If language has no country code (e.g. just "en" or "es"), check user timezone
  try {
    if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timeZone) {
        if (US_TIMEZONES.has(timeZone)) {
          return 'imperial';
        }
        // Non-US time zones outside the Americas almost universally use Metric
        if (!timeZone.startsWith('America/')) {
          return 'metric';
        }
      }
    }
  } catch {
    // Continue
  }

  // 4. If primary language is explicitly 'en-US', return imperial; otherwise default to metric
  const primaryLang = candidateLanguages[0]?.toLowerCase() || '';
  if (primaryLang === 'en-us' || primaryLang.startsWith('en-us')) {
    return 'imperial';
  }

  // 95%+ of global population and countries use the Metric system
  return 'metric';
}

/**
 * Initializes the measurement system for the user:
 * 1. Honors explicit user override in localStorage if present ('materialyardage_unitsystem').
 * 2. Checks URL query parameters (?unit=metric / ?unit=imperial / ?system=metric).
 * 3. Automatically detects browser locale on first visit.
 */
export function getInitialMeasurementSystem(): MeasurementSystem {
  if (typeof window === 'undefined') {
    return 'imperial';
  }

  // 1. User manual override in localStorage takes absolute priority
  try {
    const saved = localStorage.getItem('materialyardage_unitsystem');
    if (saved === 'metric' || saved === 'imperial') {
      return saved;
    }
  } catch {
    // LocalStorage blocked or disabled
  }

  // 2. Check URL query parameters for deep-linked unit preference
  try {
    const params = new URLSearchParams(window.location.search);
    const unitParam = params.get('unit') || params.get('system');
    if (unitParam) {
      const lower = unitParam.toLowerCase();
      if (lower === 'metric' || lower === 'imperial') {
        return lower;
      }
    }
  } catch {
    // Ignore
  }

  // 3. First visit automatic locale detection
  return detectBrowserMeasurementSystem();
}

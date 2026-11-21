import React, { useState, useEffect } from 'react';
import { Cookie, X, SlidersHorizontal, Check } from 'lucide-react';

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  advertising: boolean;
  updatedAt: number;
}

const CONSENT_STORAGE_KEY = 'materialyardage_cookie_consent';

interface CookieConsentBannerProps {
  forceOpen?: boolean;
  onCloseForceOpen?: () => void;
  onNavigatePrivacy: () => void;
}

function updateGtagConsent(prefs: CookiePreferences) {
  try {
    const win = window as unknown as {
      gtag?: (...args: unknown[]) => void;
    };
    if (typeof win.gtag === 'function') {
      win.gtag('consent', 'update', {
        analytics_storage: prefs.analytics ? 'granted' : 'denied',
        ad_storage: prefs.advertising ? 'granted' : 'denied',
        ad_user_data: prefs.advertising ? 'granted' : 'denied',
        ad_personalization: prefs.advertising ? 'granted' : 'denied',
      });
    }
  } catch {
    // Ignore consent update errors when gtag is blocked
  }
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  forceOpen = false,
  onCloseForceOpen,
  onNavigatePrivacy,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [adsEnabled, setAdsEnabled] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CookiePreferences;
        setAnalyticsEnabled(Boolean(parsed.analytics));
        setAdsEnabled(Boolean(parsed.advertising));
        updateGtagConsent(parsed);
      } else {
        setIsVisible(true);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    if (forceOpen) {
      setIsVisible(true);
      setShowCustomize(true);
    }
  }, [forceOpen]);

  const savePreferences = (analytics: boolean, advertising: boolean) => {
    const prefs: CookiePreferences = {
      essential: true,
      analytics,
      advertising,
      updatedAt: Date.now(),
    };
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // Ignore storage errors in private browsing modes
    }
    setAnalyticsEnabled(analytics);
    setAdsEnabled(advertising);
    updateGtagConsent(prefs);
    setIsVisible(false);
    setShowCustomize(false);
    onCloseForceOpen?.();
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-50 bg-white border border-slate-300 rounded-2xl shadow-xl p-4 text-xs text-slate-700"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
          <Cookie className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Cookie &amp; Privacy Preferences</span>
        </div>
        {forceOpen && (
          <button
            type="button"
            onClick={() => {
              setIsVisible(false);
              setShowCustomize(false);
              onCloseForceOpen?.();
            }}
            aria-label="Close cookie settings"
            className="text-slate-400 hover:text-slate-700 p-1 rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="mt-2 text-xs text-slate-600 leading-relaxed">
        We use essential browser storage for unit preferences and saved BOM projects, plus optional cookies for analytics and Google AdSense advertising. Read our{' '}
        <a
          href="/privacy-policy"
          onClick={(e) => {
            e.preventDefault();
            onNavigatePrivacy();
          }}
          className="text-emerald-800 underline font-semibold hover:text-emerald-950"
        >
          Privacy Policy
        </a>
        .
      </p>

      {showCustomize && (
        <div className="mt-3 pt-3 border-t border-slate-200 space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-slate-900">Essential Storage</div>
              <div className="text-[11px] text-slate-500">Unit system &amp; saved BOM items</div>
            </div>
            <span className="text-[11px] font-semibold text-emerald-800 inline-flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Always Active
            </span>
          </div>

          <label className="flex items-center justify-between gap-3 cursor-pointer">
            <div>
              <div className="font-semibold text-slate-900">Analytics Cookies</div>
              <div className="text-[11px] text-slate-500">Anonymous calculator usage metrics</div>
            </div>
            <input
              type="checkbox"
              checked={analyticsEnabled}
              onChange={(e) => setAnalyticsEnabled(e.target.checked)}
              className="w-4 h-4 accent-emerald-700 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between gap-3 cursor-pointer">
            <div>
              <div className="font-semibold text-slate-900">Advertising Cookies (AdSense)</div>
              <div className="text-[11px] text-slate-500">Personalized vs. non-personalized ads</div>
            </div>
            <input
              type="checkbox"
              checked={adsEnabled}
              onChange={(e) => setAdsEnabled(e.target.checked)}
              className="w-4 h-4 accent-emerald-700 rounded cursor-pointer"
            />
          </label>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setShowCustomize(!showCustomize)}
          className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{showCustomize ? 'Hide Options' : 'Customize'}</span>
        </button>

        <button
          type="button"
          onClick={() => savePreferences(false, false)}
          className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
        >
          Essential Only
        </button>

        {showCustomize ? (
          <button
            type="button"
            onClick={() => savePreferences(analyticsEnabled, adsEnabled)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            Save Preferences
          </button>
        ) : (
          <button
            type="button"
            onClick={() => savePreferences(true, true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            Accept All
          </button>
        )}
      </div>
    </aside>
  );
};

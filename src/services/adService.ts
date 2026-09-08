import { Ad, SearchResultResponse, UserLocation } from '../types';
import { INITIAL_ADS } from '../data/initialAds';
import { localAnalyzeQuery } from '../../server/searchHandler';

const LOCAL_STORAGE_KEY = 'smart_ads_db_v1';

export function getStoredAds(): Ad[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading stored ads', e);
  }
  return INITIAL_ADS;
}

export function saveStoredAds(ads: Ad[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ads));
  } catch (e) {
    console.warn('Error saving ads to localStorage', e);
  }
}

export async function fetchAllAds(): Promise<Ad[]> {
  try {
    const res = await fetch('/api/ads');
    if (res.ok) {
      const data = await res.json();
      if (data.ads && Array.isArray(data.ads)) {
        saveStoredAds(data.ads);
        return data.ads;
      }
    }
  } catch (err) {
    console.log('Using local ads cache', err);
  }
  return getStoredAds();
}

export async function createAd(
  adData: Omit<Ad, 'id' | 'createdAt'>
): Promise<Ad> {
  const newAd: Ad = {
    ...adData,
    id: 'ad-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    createdAt: new Date().toISOString(),
    rating: 5.0,
    reviewCount: 1,
  };

  // 1. Try server POST
  try {
    const res = await fetch('/api/ads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAd),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.ad) {
        const current = getStoredAds();
        saveStoredAds([data.ad, ...current.filter((a) => a.id !== data.ad.id)]);
        return data.ad;
      }
    }
  } catch (err) {
    console.warn('Could not post to /api/ads, using local storage', err);
  }

  // 2. Save locally
  const current = getStoredAds();
  const updated = [newAd, ...current];
  saveStoredAds(updated);
  return newAd;
}

export async function performSmartSearch(
  query: string,
  userLocation: UserLocation
): Promise<SearchResultResponse> {
  try {
    const res = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, userLocation }),
    });

    if (res.ok) {
      const result: SearchResultResponse = await res.json();
      return result;
    }
  } catch (err) {
    console.warn('Server search failed, using local AI analyzer', err);
  }

  // Fallback to local intelligent analyzer
  const currentAds = getStoredAds();
  return localAnalyzeQuery(query, userLocation, currentAds);
}

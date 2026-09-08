// Firebase Service for Blink - Jordan Data Persistence
import { db } from './firebase';
import { BuyerSearchRequest, VerifiedJordanUser, MarketItem, BlinkEntityProfile } from '../types';
import { INITIAL_BUYER_REQUESTS, INITIAL_VERIFIED_USERS } from '../data/jordanBlinkData';
import { INITIAL_BLINK_PROFILES } from '../data/blinkProfilesData';

const BUYERS_LOCAL_STORAGE_KEY = 'blink_jordan_buyers_v1';
const VERIFIED_LOCAL_STORAGE_KEY = 'blink_jordan_verified_v1';
const MARKET_LOCAL_STORAGE_KEY = 'blink_jordan_market_v1';
const PROFILES_LOCAL_STORAGE_KEY = 'blink_jordan_profiles_v1';

// Load initial buyers from LocalStorage / Firebase
export const loadSavedBuyerRequests = (): BuyerSearchRequest[] => {
  try {
    const saved = localStorage.getItem(BUYERS_LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('LocalStorage error reading buyers:', e);
  }
  return INITIAL_BUYER_REQUESTS;
};

// Save a new buyer request
export const saveBuyerRequest = async (buyerReq: BuyerSearchRequest): Promise<void> => {
  try {
    const current = loadSavedBuyerRequests();
    const updated = [buyerReq, ...current.filter((b) => b.id !== buyerReq.id)];
    localStorage.setItem(BUYERS_LOCAL_STORAGE_KEY, JSON.stringify(updated));

    // Optional Firestore sync if initialized
    if (db) {
      try {
        const { doc, setDoc } = await import('firebase/firestore');
        await setDoc(doc(db, 'buyer_requests', buyerReq.id), buyerReq);
      } catch (fbErr) {
        // Safe fallback
      }
    }
  } catch (e) {
    console.warn('Error saving buyer request:', e);
  }
};

// Load verified users
export const loadSavedVerifiedUsers = (): VerifiedJordanUser[] => {
  try {
    const saved = localStorage.getItem(VERIFIED_LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('LocalStorage error reading verified users:', e);
  }
  return INITIAL_VERIFIED_USERS;
};

// Save new verified user
export const saveVerifiedUser = async (user: VerifiedJordanUser): Promise<void> => {
  try {
    const current = loadSavedVerifiedUsers();
    const updated = [user, ...current.filter((u) => u.id !== user.id)];
    localStorage.setItem(VERIFIED_LOCAL_STORAGE_KEY, JSON.stringify(updated));

    if (db) {
      try {
        const { doc, setDoc } = await import('firebase/firestore');
        await setDoc(doc(db, 'verified_users', user.id), user);
      } catch (fbErr) {
        // Safe fallback
      }
    }
  } catch (e) {
    console.warn('Error saving verified user:', e);
  }
};

// Load and save market items for Blink
export const loadSavedMarketItems = (): MarketItem[] => {
  try {
    const saved = localStorage.getItem(MARKET_LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('LocalStorage error reading market items:', e);
  }
  return [];
};

export const saveMarketItem = async (item: MarketItem): Promise<void> => {
  try {
    const current = loadSavedMarketItems();
    const updated = [item, ...current.filter((i) => i.id !== item.id)];
    localStorage.setItem(MARKET_LOCAL_STORAGE_KEY, JSON.stringify(updated));

    if (db) {
      try {
        const { doc, setDoc } = await import('firebase/firestore');
        await setDoc(doc(db, 'market_items', item.id), item);
      } catch (fbErr) {
        // Safe fallback
      }
    }
  } catch (e) {
    console.warn('Error saving market item:', e);
  }
};

// Load saved profiles (Creators, Craftsmen, Stores, Restaurants, Companies)
export const loadSavedProfiles = (): BlinkEntityProfile[] => {
  try {
    const saved = localStorage.getItem(PROFILES_LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('LocalStorage error reading profiles:', e);
  }
  return INITIAL_BLINK_PROFILES;
};

// Save newly registered profile to Firebase Firestore and LocalStorage
export const saveProfile = async (profile: BlinkEntityProfile): Promise<void> => {
  try {
    const current = loadSavedProfiles();
    const updated = [profile, ...current.filter((p) => p.id !== profile.id)];
    localStorage.setItem(PROFILES_LOCAL_STORAGE_KEY, JSON.stringify(updated));

    if (db) {
      try {
        const { doc, setDoc } = await import('firebase/firestore');
        await setDoc(doc(db, 'profiles', profile.id), profile);
      } catch (fbErr) {
        // Firestore fallback
      }
    }
  } catch (e) {
    console.warn('Error saving profile to Firebase/storage:', e);
  }
};

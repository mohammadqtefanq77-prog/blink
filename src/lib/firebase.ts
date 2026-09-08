// Firebase Configuration & Initialization for Blink - Jordan
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Safe environment fallback for Firebase config
const env = (import.meta as any).env || {};
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'blink-jordan.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'blink-jordan',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'blink-jordan.appspot.com',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef',
};

let app: any = null;
let db: any = null;
let auth: any = null;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
} catch (err) {
  console.warn('Firebase initialized in fallback local mode:', err);
}

export { app, db, auth };

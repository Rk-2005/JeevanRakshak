import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBHDuQrcI13JnRuA-zSVR58gyyI2rILrVo',
  authDomain: 'healthrakshak-bd7e3.firebaseapp.com',
  projectId: 'healthrakshak-bd7e3',
  storageBucket: 'healthrakshak-bd7e3.firebasestorage.app',
  messagingSenderId: '933842205047',
  appId: '1:933842205047:web:f7d5c8ef7a51425ce10972',
  measurementId: 'G-GCRXMK4CER',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Safe getter for Analytics only in supported/browser environments
const initAnalytics = async () => {
  if (typeof window === 'undefined') return null;
  try {
    const supported = await isAnalyticsSupported();
    return supported ? getAnalytics(app) : null;
  } catch (_) {
    return null;
  }
};

// Initialize Realtime Database and Storage
const database = getDatabase(app);
const storage = getStorage(app);

export { firebaseConfig, app, initAnalytics, database, storage };
export default firebaseConfig;

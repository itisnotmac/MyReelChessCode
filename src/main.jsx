import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import NativeOAuthCallback from '@/components/auth/NativeOAuthCallback.jsx'
import '@/index.css'
import { Capacitor } from '@capacitor/core'
import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor'
import { AdMob } from '@capacitor-community/admob'
import { preloadInterstitial } from '@/lib/adMob'

async function initRevenueCat() {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
    await Purchases.configure({
      apiKey: 'goog_hNklfqirvvgeuWbzDxzPjpqJlUx',
    });
  } catch (e) {
    console.error('RevenueCat init failed:', e);
  }
}

async function initAdMob() {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await AdMob.initialize({
      requestTrackingAuthorization: false,
      testingDevices: [],
      initializeForTesting: false,
    });
    // Preload first interstitial so it's ready after game 1
    preloadInterstitial();
  } catch (e) {
    console.error('AdMob init failed:', e);
  }
}

initRevenueCat();
initAdMob();

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <App />
    <NativeOAuthCallback />
  </>
)
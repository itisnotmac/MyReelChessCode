import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import NativeOAuthCallback from '@/components/auth/NativeOAuthCallback.jsx'
import '@/index.css'
import { Capacitor } from '@capacitor/core'
import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor'

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

initRevenueCat();

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <App />
    <NativeOAuthCallback />
  </>
)
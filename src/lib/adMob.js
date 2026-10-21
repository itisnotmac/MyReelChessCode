import { AdMob, InterstitialAdPluginEvents } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

const INTERSTITIAL_ID = 'ca-app-pub-5959392584142562/6679664736';
const REWARDED_ID = 'ca-app-pub-5959392584142562/5175011377';

let interstitialReady = false;

export async function preloadInterstitial() {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await AdMob.prepareInterstitial({
      adId: INTERSTITIAL_ID,
      isTesting: false,
    });
    interstitialReady = true;
  } catch (e) {
    console.error('Interstitial preload failed:', e);
  }
}

export async function showInterstitialAd() {
  if (!Capacitor.isNativePlatform()) return;
  try {
    if (!interstitialReady) {
      await preloadInterstitial();
    }
    await AdMob.showInterstitial();
    interstitialReady = false;
    // Preload next one in background
    preloadInterstitial();
  } catch (e) {
    console.error('Interstitial show failed:', e);
  }
}

export async function showRewardedAd() {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    await AdMob.prepareRewardVideoAd({
      adId: REWARDED_ID,
      isTesting: false,
    });
    const result = await AdMob.showRewardVideoAd();
    return !!result?.value;
  } catch (e) {
    console.error('Rewarded ad failed:', e);
    return false;
  }
}
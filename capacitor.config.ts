import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.base69ab30c24c8c7db2b8432adf.app',
  appName: 'Reel Chess',
  webDir: 'dist',
server: {
    allowNavigation: [
      'reelchess.org',
      '*.reelchess.org',
      'base44.app',
      '*.base44.app',
      '*.base44.com'
    ]
  }
};

export default config;

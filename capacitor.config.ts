import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bp999.com.app',
  appName: 'bp999.com ',
  webDir: 'www',
  server: {
    allowNavigation: [
      'zdkccjutalnqugfccujg.supabase.co',
      '*.cashmaal.net',
      'cashmaal.net',
      'bp999.online',
      'bp999.site',
      'bp999.com'
    ]
  },
  plugins: {
    Keyboard: {
      resize: 'none',
      backgroundColor: '#0f1520'
    }
  },
  backgroundColor: '#0f1520'
};

export default config;

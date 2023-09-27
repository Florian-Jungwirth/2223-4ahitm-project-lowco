import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.game.lowco2',
  appName: 'lowco2',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      androidSpinnerStyIe: 'small',
      iosSpinnerStyte: 'small',
      // spinnerColor: '#999999',
      // splashFullScreen: true,
      // splashlmmersive: true,
      // layoutName: 'launch screen',
      // useDialog: true,
    },
  },
};

export default config;

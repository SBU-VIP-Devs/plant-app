import 'dotenv/config';
import { ExpoConfig, ConfigContext } from '@expo/config';

// export default ({ config }: ConfigContext): ExpoConfig => ({
//   ...config,

export default {
  name: 'sprout',
  slug: 'sprout',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.jamiedani.sprout',
    infoPlist: {
      NSPhotoLibraryUsageDescription:
        'This app requires access to your photo library to allow you to select and upload photos.',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.jamiedani.sprout',
  },
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    eas: {
      projectId: '6c679569-88ba-4e85-bc02-458b4474bcf5',
    },
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING: process.env.FIREBASE_MESSAGING,
    FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    IOS_CLIENT_ID: process.env.IOS_CLIENT_ID,
    ANDROID_CLIENT_ID: process.env.ANDROID_CLIENT_ID,
  },
  scheme: 'sprout',
  plugins: ['expo-router'],
};

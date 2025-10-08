const BUILD_NUMB = 200;
const APP_VERSION = '2.0.0';

export default {
  expo: {
    name: 'Livo Facilities',
    displayName: 'Livo Facilities',
    slug: 'livo-facility',
    version: APP_VERSION,
    orientation: 'portrait',
    icon: './assets/store/app-icon-1024.png',
    scheme: 'livoapp',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    androidNavigationBar: {
      background: 'transparent',
      barStyle: 'dark-content',
    },
    updates: {
      enabled: false,
      url: 'https://u.expo.dev/363c4b2b-3707-46e0-8a72-21eaaecc735e',
      requestHeaders: {
        'expo-channel-name': 'production',
      },
      checkAutomatically: 'NEVER',
    },
    runtimeVersion: APP_VERSION,
    ios: {
      appleTeamId: 'Y4AVXK545F',
      icon: './assets/store/app-icon-1024.png',
      buildNumber: BUILD_NUMB.toString(),
      googleServicesFile: './firebase/GoogleService-Info.plist',
      supportsTablet: false,
      bundleIdentifier: 'com.getlivo.facilityapp',
      entitlements: { 'aps-environment': 'production' },
      infoPlist: {
        UIBackgroundModes: ['remote-notification'],
        UIViewControllerBasedStatusBarAppearance: true,
      },
      UIBackgroundModes: ['remote-notification'],
      usesBroadcastPushNotifications: true,
      config: {
        usesNonExemptEncryption: false,
      },
    },
    android: {
      versionCode: BUILD_NUMB,
      googleServicesFile: './firebase/google-services.json',
      adaptiveIcon: {
        foregroundImage: './assets/store/android.png',
        backgroundColor: '#114454',
      },
      icon: './assets/store/app-icon-1024.png',
      resources: {
        colors: {
          iconBackground: '#114454',
        },
      },
      edgeToEdgeEnabled: true,
      package: 'com.getlivo.facilityapp',
      blockedPermissions: ['android.permission.RECORD_AUDIO'],
    },
    plugins: [
      [
        'expo-splash-screen',
        {
          image: './assets/store/splash-icon-1024.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#114454',
        },
      ],
      [
        'expo-build-properties',
        {
          ios: {
            useFrameworks: 'static',
            buildReactNativeFromSource: true,
          },
        },
      ],
      '@react-native-firebase/app',
      '@react-native-firebase/crashlytics',
      '@react-native-firebase/messaging',
      /**
       * custom plugins
       */
      './plugins/with-custom-android-manifest.js',
      './plugins/add-images-xcassets.js',
      './plugins/expo-update-custom-plist-version.js',
      './plugins/add-notifee-maven.js',
      './plugins/add-dev-ic-launcher.js',
      './plugins/add-dev-strings.js',
      './plugins/add-flavors.js',
      './plugins/expo-update-custom-plist-version.js',
      './plugins/fix-blob-provider-authority.js',
      [
        './plugins/add-gradle-properties.js',
        {
          properties: {
            'org.gradle.jvmargs':
              '-Xmx8g -XX:MaxMetaspaceSize=2g -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8 -XX:+UseParallelGC',
            'org.gradle.workers.max': 8,
            'org.gradle.caching': true,
            'org.gradle.daemon': true,
            'android.enableProguardInReleaseBuilds': true,
            'android.enableShrinkResourcesInReleaseBuilds': true,
            artifactory_user: process.env.ARTIFACTORY_USER,
            artifactory_key: process.env.ARTIFACTORY_KEY,
            LIVO_UPLOAD_STORE_FILE: process.env.LIVO_UPLOAD_STORE_FILE,
            LIVO_UPLOAD_KEY_ALIAS: process.env.LIVO_UPLOAD_KEY_ALIAS,
            LIVO_UPLOAD_STORE_PASSWORD: process.env.LIVO_UPLOAD_STORE_PASSWORD,
            LIVO_UPLOAD_KEY_PASSWORD: process.env.LIVO_UPLOAD_KEY_PASSWORD,
          },
        },
      ],
      [
        './plugins/add-signing-configs.js',
        {
          release: {
            propertyCheck: 'LIVO_UPLOAD_STORE_FILE',
            storeFile: 'file(LIVO_UPLOAD_STORE_FILE)',
            storePassword: 'LIVO_UPLOAD_STORE_PASSWORD',
            keyAlias: 'LIVO_UPLOAD_KEY_ALIAS',
            keyPassword: 'LIVO_UPLOAD_KEY_PASSWORD',
          },
        },
      ],
      /**
       * package plugins
       */
      'expo-secure-store',
      'expo-document-picker',
      'expo-image-picker',
      [
        'react-native-share',
        {
          ios: ['fb', 'instagram', 'twitter', 'tiktoksharesdk'],
          android: [
            'com.facebook.katana',
            'com.instagram.android',
            'com.twitter.android',
            'com.zhiliaoapp.musically',
          ],
          enableBase64ShareAndroid: false,
        },
      ],
      [
        'react-native-edge-to-edge',
        {
          android: {
            parentTheme: 'Material2',
            enforceNavigationBarContrast: false,
          },
        },
      ],
    ],
    extra: {
      PUBLISH_LEVEL: process.env.PUBLISH_LEVEL,
      API_BASE_URL: process.env.API_BASE_URL,
      LOG_VERBOSE: process.env.LOG_VERBOSE,
      LOKALISE_OTA_URL: process.env.LOKALISE_OTA_URL,
      LOKALISE_SDK_TOKEN: process.env.LOKALISE_SDK_TOKEN,
      LOKALISE_PROJECT_ID: process.env.LOKALISE_PROJECT_ID,
      AUTO_RELOAD_TRANSLATIONS_INTERVAL_MS:
        process.env.AUTO_RELOAD_TRANSLATIONS_INTERVAL_MS,
      UPDATES_CHANNEL: process.env.UPDATES_CHANNEL,
    },
  },
};

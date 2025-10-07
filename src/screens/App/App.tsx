import React, { useEffect, useState } from 'react';
import { AuthProvider } from '@/router/AuthenticationProvider';
import { initialiseNotifications } from '@/services/notifications';

import crashlytics from '@react-native-firebase/crashlytics';
import { initI18next, reloadTranslations } from '@/locale/i18n';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { StyleSheet, View } from 'react-native';
import { WHITE } from '@/styles/colors';
import remoteConfig from '@react-native-firebase/remote-config';
import QueryProvider from '@/providers/QueryProvider';
import ENV from '@/constants/env';
import { Provider } from 'react-redux';
import store from '@/store/configureStore';
import {SafeAreaProvider} from "react-native-safe-area-context";


const App = () => {
  const [isI18nextReady, setIsI18nextReady] = useState(false);

  useEffect(() => {
    initialiseNotifications();
    crashlytics().log('App mounted.');
  }, []);

  useEffect(() => {
    initI18next()
      .then(() => {
        console.log('i18next is ready');
        setIsI18nextReady(true);
      })
      .catch((err) => {
        console.error('i18next init error:', err);
      });
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    let intervalMs =
      remoteConfig().getNumber('auto_reload_translations_interval_ms') ??
      Number(ENV.AUTO_RELOAD_TRANSLATIONS_INTERVAL_MS);

    if (isI18nextReady && typeof intervalMs === 'number' && intervalMs > 0) {
      intervalId = setInterval(() => reloadTranslations(), intervalMs);

      console.log(
        '[i18n][Auto reload] Start with interval: ' +
          intervalMs +
          '(ms), intervalId: ' +
          intervalId
      );
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        console.log('[i18n][Auto reload] Stop intervalId: ' + intervalId);
      }
    };
  }, [isI18nextReady]);

  if (!isI18nextReady) {
    return (
      <View style={styles.loadingScreen}>
        <LoadingScreen />
      </View>
    );
  }

  console.log(`App launched in ${ENV.PUBLISH_LEVEL} mode`);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <QueryProvider>
          <AuthProvider />
        </QueryProvider>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: WHITE,
  },
});

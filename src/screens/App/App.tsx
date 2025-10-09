import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import QueryProvider from '@/providers/QueryProvider';
import CrashlyticsService from '@/services/firebase/crashlytics-service';
import RemoteConfigService from '@/services/firebase/remote-config-service';
import { initialiseNotifications } from '@/services/notifications';
import store from '@/store/configureStore';

import { LoadingScreen } from '@/components/common/LoadingScreen';

import ENV from '@/constants/env';
import { WHITE } from '@/styles/colors';

import { initI18next, reloadTranslations } from '@/locale/i18n';
import { AuthProvider } from '@/router/AuthenticationProvider';

const App = () => {
  const [isI18nextReady, setIsI18nextReady] = useState(false);

  useEffect(() => {
    initialiseNotifications();
    CrashlyticsService.log('App mounted.');
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
    let intervalId: any | undefined;
    let intervalMs =
      RemoteConfigService.getNumber('auto_reload_translations_interval_ms') ??
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
        <GestureHandlerRootView style={styles.container}>
          <QueryProvider>
            <AuthProvider />
          </QueryProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: WHITE,
  },
});

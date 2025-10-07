import i18n from 'i18next';
import ICU from 'i18next-icu';
import 'intl-messageformat';
import 'intl-pluralrules';
import {initReactI18next} from 'react-i18next';
import enTranslation from './translations/en.json';
import esTranslation from './translations/es.json';
import itTranslation from './translations/it.json';
import plTranslation from './translations/pl.json';
import {lokalise} from './lokalise';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localize from 'react-native-localize';

import remoteConfig from '@react-native-firebase/remote-config';
import ENV from '@/constants/env';
import {StorageKeys} from "@/services/storage/storage.keys";


const IS_DEV_ENV = ENV.IS_A_DEV_DISTRIBUTION ?? false;
const DEFAULT_NS = 'translation';
const DEFAULT_LOCALE = 'es-ES';
const DEFAULT_SUPPORTED_LANGUAGES = ['es', 'it', 'pl'];

export const reloadTranslations = async () => {
  try {
    const bundleInfo = await lokalise.checkForUpdates();
    if (bundleInfo.updateAvailable) {
      console.log(`[i18n][Lokalise] New bundle available ${bundleInfo.version}, reload translations`);
      const translations = await lokalise.loadTranslationsFromUrl(bundleInfo.url);
      for (const lang in translations) {
        i18n.addResourceBundle(lang, DEFAULT_NS, translations[lang][DEFAULT_NS], true, true);
      }
      i18n.changeLanguage(i18n.language); // refresh React components
    } else {
      console.log(`[i18n][Lokalise] Current bundle ${bundleInfo.version} is up-to-date`);
    }
  } catch (error: any) {
    console.log("[i18n][Lokalise] Reload translations failed");
    console.error(error);
  }
}

export const getSupportedLanguages = () => {
  let supportedLanguages = DEFAULT_SUPPORTED_LANGUAGES;

  const supportedLanguagesStr = remoteConfig().getString('supported_languages');
  if (!!supportedLanguagesStr && supportedLanguagesStr.length > 0) {
    supportedLanguages = supportedLanguagesStr.split(',');
  }

  if (IS_DEV_ENV) {
    supportedLanguages.push('en');
  }

  return supportedLanguages;
}

export const isSupportedLanguage = (lang: string) => {
  return getSupportedLanguages().find(lng => lang!.startsWith(lng));
}

export async function initI18next() {
  if (i18n.isInitialized) {
    return;
  }

  let locale = await AsyncStorage.getItem(StorageKeys.LAST_PROFILE_LOCALE);
  console.log('[i18n] Last profile locale: '+ locale);

  if (!locale) {
    const locales = Localize.getLocales();
    locale = locales && locales.length > 0 ? locales[0].languageTag : DEFAULT_LOCALE;
    console.log('[i18n] Use device locale: ' + locale);
  }

  if (!locale || !isSupportedLanguage(locale)) {
    locale = DEFAULT_LOCALE;
  }

  const resources: any = {
    es: { translation: esTranslation },
    it: { translation: itTranslation },
    pl: { translation: plTranslation },
  }

  if (IS_DEV_ENV) {
    resources.en = { translation: enTranslation };
  }

  await i18n
    .use(ICU)
    .use(initReactI18next)
    .init({
      fallbackLng: DEFAULT_LOCALE,
      lng: locale ?? DEFAULT_LOCALE,
      defaultNS: DEFAULT_NS,
      debug: __DEV__,
      load: 'languageOnly',
      interpolation: {
        escapeValue: false,
      },
      i18nFormat: {
        memoize: false
      },
      resources
    });

  await reloadTranslations();
}

export default i18n;
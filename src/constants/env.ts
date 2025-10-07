import Constants from 'expo-constants';

const PUBLISH_LEVEL: string = Constants.expoConfig?.extra?.PUBLISH_LEVEL || '';
const API_BASE_URL: string = Constants.expoConfig?.extra?.API_BASE_URL || '';
const LOG_VERBOSE: string =
    Constants.expoConfig?.extra?.LOG_VERBOSE || '';
const GOOGLE_PLACES_API_KEY: string =
    Constants.expoConfig?.extra?.GOOGLE_PLACES_API_KEY || '';
const POSTHOG_API_KEY: string =
    Constants.expoConfig?.extra?.POSTHOG_API_KEY || '';
const LOKALISE_OTA_URL: string =
    Constants.expoConfig?.extra?.LOKALISE_OTA_URL || '';
const LOKALISE_SDK_TOKEN: string =
    Constants.expoConfig?.extra?.LOKALISE_SDK_TOKEN || '';
const LOKALISE_PROJECT_ID: string =
    Constants.expoConfig?.extra?.LOKALISE_PROJECT_ID || '';
const AUTO_RELOAD_TRANSLATIONS_INTERVAL_MS: number | undefined = Number(
    Constants.expoConfig?.extra?.AUTO_RELOAD_TRANSLATIONS_INTERVAL_MS
);

const UPDATES_CHANNEL: 'production' | 'staging' | 'preview' | undefined =
    Constants.expoConfig?.extra?.UPDATES_CHANNEL || 'production';

const ENV = {
    PUBLISH_LEVEL,
    API_BASE_URL,
    LOG_VERBOSE,
    GOOGLE_PLACES_API_KEY,
    POSTHOG_API_KEY,
    LOKALISE_SDK_TOKEN,
    LOKALISE_OTA_URL,
    LOKALISE_PROJECT_ID,
    AUTO_RELOAD_TRANSLATIONS_INTERVAL_MS,
    UPDATES_CHANNEL,
    IS_A_DEV_DISTRIBUTION: PUBLISH_LEVEL.includes('DEVELOPMENT'),
    IS_A_BETA_DISTRIBUTION: PUBLISH_LEVEL.includes('BETA'),
    IS_A_PRODUCTION_DISTRIBUTION: PUBLISH_LEVEL.includes('PRODUCTION'),
};

export default ENV;

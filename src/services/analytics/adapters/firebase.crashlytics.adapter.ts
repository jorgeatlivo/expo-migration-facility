import {
  FirebaseCrashlyticsTypes,
  getCrashlytics,
  log,
  recordError,
  setAttributes,
  setUserId,
} from '@react-native-firebase/crashlytics';

import { ICrashlyticsAdapter } from '@/services/analytics/adapters/analytics.adapter';
import { Logger } from '@/services/logger.service';

class FirebaseCrashlyticsAdapter implements ICrashlyticsAdapter {
  module: FirebaseCrashlyticsTypes.Module;
  constructor() {
    this.module = getCrashlytics();
  }

  trackError(error: Error, params?: Record<string, unknown>): void {
    try {
      const name =
        (params?.name as string | undefined) || error.name || undefined;
      recordError(this.module, error, name);
    } catch (err) {
      Logger.error('FirebaseCrashlyticsAdapter.trackError', err);
    }
  }

  log(message: string) {
    try {
      log(this.module, message);
    } catch (err) {
      Logger.error('FirebaseCrashlyticsAdapter.log', err);
    }
  }

  identifyUser(userId: string, traits?: Record<string, unknown>): void {
    try {
      setUserId(this.module, userId);
      if (traits) {
        const castedTraits = this.castParamsToCrashlytics(traits);
        setAttributes(this.module, castedTraits);
      }
    } catch (err) {
      Logger.error('FirebaseCrashlyticsAdapter.identifyUser', err);
    }
  }

  reset() {
    try {
      setUserId(this.module, '');
      setAttributes(this.module, {});
    } catch (err) {
      Logger.error('FirebaseCrashlyticsAdapter.reset', err);
    }
  }

  private castParamsToCrashlytics(params?: Record<string, unknown>) {
    try {
      if (!params) {
        return {};
      }

      return Object.fromEntries(
        Object.entries(params).map(([key, value]) => {
          // Convert objects to JSON strings
          if (typeof value === 'object' && value !== null) {
            return [key, JSON.stringify(value)];
          }

          return [key, String(value)];
        })
      );
    } catch (err) {
      Logger.error('FirebaseCrashlyticsAdapter.castParamsToCrashlytics', err);
      return {};
    }
  }
}

export default FirebaseCrashlyticsAdapter;

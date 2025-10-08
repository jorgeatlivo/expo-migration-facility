import {
  FirebaseAnalyticsTypes,
  getAnalytics,
  logEvent,
  logScreenView,
  setUserId,
  setUserProperty,
} from '@react-native-firebase/analytics';

import { Logger } from '@/services/logger.service';

import type { IAnalyticsAdapter } from './analytics.adapter';

class FirebaseAnalyticsAdapter implements IAnalyticsAdapter {
  module: FirebaseAnalyticsTypes.Module;
  constructor() {
    this.module = getAnalytics();
  }

  trackPageView(page: string) {
    try {
      logScreenView(this.module, {
        screen_name: page,
        screen_class: page,
      });
    } catch (error) {
      Logger.error('FirebaseAnalyticsAdapter.trackPageView', error);
    }
  }

  trackEvent(event: string, params?: Record<string, unknown>) {
    try {
      const firebaseParams = this.castParamsToFirebase(params);
      logEvent(this.module, event, firebaseParams);
    } catch (error) {
      Logger.error('FirebaseAnalyticsAdapter.trackEvent', error);
    }
  }

  identifyUser(userId: string, traits?: Record<string, unknown>) {
    try {
      setUserId(this.module, userId);

      if (traits) {
        const firebaseTraits = this.castParamsToFirebase(traits);
        // Set user properties in Firebase Analytics
        Object.entries(firebaseTraits).forEach(([key, value]) => {
          setUserProperty(this.module, key, String(value));
        });
      }
    } catch (error) {
      Logger.error('FirebaseAnalyticsAdapter.identifyUser', error);
    }
  }

  reset() {
    try {
      setUserId(this.module, null);
    } catch (error) {
      Logger.error('FirebaseAnalyticsAdapter.reset', error);
    }
  }

  /**
   * cast from Record<string, unknown> to Firebase Analytics compatible parameters
   */
  private castParamsToFirebase(params?: Record<string, unknown>) {
    if (!params) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(params).map(([key, value]) => {
        // Firebase Analytics has specific requirements for parameter values
        if (typeof value === 'object' && value !== null) {
          // Convert objects to JSON strings
          return [key, JSON.stringify(value)];
        }

        // Firebase Analytics supports string, number, boolean
        if (
          typeof value === 'string' ||
          typeof value === 'number' ||
          typeof value === 'boolean'
        ) {
          return [key, value];
        }

        // For undefined, null, or other types, convert to string
        return [key, String(value)];
      })
    );
  }
}

export default FirebaseAnalyticsAdapter;

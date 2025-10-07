import PostHog from 'posthog-react-native';

import { Logger } from '@/services/logger.service';
import { IAnalyticsAdapter } from './analytics.adapter';
import { AnalyticEvents } from '../events';

class PostHogAnalyticsAdapter implements IAnalyticsAdapter {
  private posthog: PostHog;

  constructor(apiKey: string, host: string = 'https://eu.i.posthog.com') {
    this.posthog = new PostHog(apiKey, {
      host,
    });
  }

  trackPageView(page: string) {
    try {
      this.posthog.screen(page);
    } catch (error) {
      console.error('PostHogAnalyticsAdapter.trackPageView', error);
    }
  }

  trackEvent(event: AnalyticEvents | string, params?: Record<string, unknown>) {
    try {
      const properties = this.castParamsToPosthog(params);
      this.posthog.capture(event as string, properties);
    } catch (error) {
      console.error('PostHogAnalyticsAdapter.trackEvent', error);
    }
  }

  identifyUser(userId: string, traits?: Record<string, unknown>) {
    try {
      const posthogTraits = this.castTraitsToPosthog(traits);
      this.posthog.identify(userId, posthogTraits);
    } catch (error) {
      console.error('PostHogAnalyticsAdapter.identifyUser', error);
    }
  }

  reset() {
    try {
      this.posthog.reset();
    } catch (error) {
      Logger.error('PostHogAnalyticsAdapter.reset', error);
    }
  }

  /**
   * cast from Record<string, unknown> to Record<string, primitive>
   */
  private castTraitsToPosthog(traits?: Record<string, unknown>) {
    if (!traits) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(traits).map(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          // Convert objects to JSON strings
          return [key, JSON.stringify(value)];
        }

        // Ensure all other values are primitives (string, number, boolean)
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

  private castParamsToPosthog(params?: Record<string, unknown>) {
    if (!params) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(params).map(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          // Convert objects to JSON strings
          return [key, JSON.stringify(value)];
        }

        // Ensure all other values are primitives (string, number, boolean)
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

export default PostHogAnalyticsAdapter;

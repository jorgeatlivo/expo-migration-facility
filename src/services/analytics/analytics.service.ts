import { IAnalyticsAdapter } from '@/services/analytics/adapters/analytics.adapter';
import PostHogAnalyticsAdapter from '@/services/analytics/adapters/posthog.adapter';
import { AnalyticEvents } from '@/services/analytics/events';
import RemoteConfigService from '@/services/firebase/remote-config-service';

import ENV from '@/constants/env';

type Config = {
  shouldAvailable: boolean;
};

class AnalyticsService {
  private adapters: IAnalyticsAdapter[] = [];
  private static instance: AnalyticsService | null = null;
  private env: Config;
  constructor() {
    if (!!ENV.POSTHOG_API_KEY) {
      this.adapters.push(new PostHogAnalyticsAdapter(ENV.POSTHOG_API_KEY));
    }
    this.env = {
      shouldAvailable: ENV.IS_A_PRODUCTION_DISTRIBUTION,
    };
  }

  private static getInstance() {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private static clearInstance() {
    if (AnalyticsService.instance) {
      AnalyticsService.instance = null;
    }
  }

  private _trackPageView(url: string) {
    if (!this.env.shouldAvailable) {
      return;
    }

    this.adapters.forEach((adapter) => {
      adapter.trackPageView(url);
    });
  }

  private _trackEvent(
    eventName: AnalyticEvents,
    eventData?: Record<string, unknown>
  ) {
    if (!this.env.shouldAvailable) {
      return;
    }

    this.adapters.forEach((adapter) => {
      adapter.trackEvent(eventName, eventData);
    });
  }

  private _identifyUser(userId: string, traits?: Record<string, unknown>) {
    if (!this.env.shouldAvailable) {
      return;
    }

    this.adapters.forEach((adapter) => {
      adapter.identifyUser(userId, traits);
    });
  }

  private _reset() {
    if (!this.env.shouldAvailable) {
      return;
    }

    this.adapters.forEach((adapter) => {
      adapter.reset();
    });
  }

  private _setLocale(locale: string) {
    if (!this.env.shouldAvailable) {
      return;
    }

    this.adapters.forEach((adapter) => {
      adapter?.setLocale?.(locale);
    });
  }

  /* ----------------------------- PUBLIC METHODS ----------------------------- */

  static initPostHogFromRemoteConfig() {
    const posthogApiKey = RemoteConfigService.getString(
      'facility_app_posthog_api_key'
    );
    if (!!posthogApiKey && posthogApiKey.length > 0) {
      console.log('Initalizing PostHog from remote config');
      AnalyticsService.initPostHog(posthogApiKey);
    }
  }

  static initPostHog(apiKey: string) {
    const instance = AnalyticsService.getInstance();
    const isPosthogInited = instance.adapters.some(
      (adapter) => adapter instanceof PostHogAnalyticsAdapter
    );
    if (!isPosthogInited) {
      instance.adapters.push(new PostHogAnalyticsAdapter(apiKey));
      console.log('Inited Posthog successfully');
    } else {
      console.log('Posthog already intited, skip initing');
    }
  }

  static trackEvent(name: AnalyticEvents, params?: Record<string, unknown>) {
    const instance = AnalyticsService.getInstance();
    instance._trackEvent(name, params);
  }

  static trackPageView(url: string) {
    const instance = AnalyticsService.getInstance();
    instance._trackPageView(url);
  }

  static identifyUser(userId: string, traits?: Record<string, unknown>) {
    const instance = AnalyticsService.getInstance();
    instance._identifyUser(userId, traits);
  }

  static reset() {
    const instance = AnalyticsService.getInstance();
    instance._reset();
  }

  static setLocale(locale: string) {
    const instance = AnalyticsService.getInstance();
    instance._setLocale(locale);
  }
}

export default AnalyticsService;

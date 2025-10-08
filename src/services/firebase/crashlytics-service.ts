import { ICrashlyticsAdapter } from '@/services/analytics/adapters/analytics.adapter';
import FirebaseCrashlyticsAdapter from '@/services/analytics/adapters/firebase.crashlytics.adapter';

import ENV from '@/constants/env';

type Config = {
  shouldAvailable: boolean;
};

class CrashlyticsService {
  private adapters: ICrashlyticsAdapter[] = [];
  private static instance: CrashlyticsService | null = null;
  private env: Config;
  constructor() {
    this.adapters.push(new FirebaseCrashlyticsAdapter());
    this.env = {
      shouldAvailable: ENV.IS_A_PRODUCTION_DISTRIBUTION,
    };
  }

  public static getInstance(): CrashlyticsService {
    if (!CrashlyticsService.instance) {
      CrashlyticsService.instance = new CrashlyticsService();
    }
    return CrashlyticsService.instance;
  }

  private _trackError(
    error: Error | unknown,
    params?: Record<string, unknown>
  ) {
    if (!this.env.shouldAvailable) {
      return;
    }
    if (error instanceof Error) {
      this.adapters.forEach((adapter) => {
        adapter.trackError(error, params);
      });
    }
  }

  private _log(message: string) {
    if (!this.env.shouldAvailable) {
      return;
    }
    this.adapters.forEach((adapter) => {
      adapter.log(message);
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

  public static trackError(
    error: Error | unknown,
    params?: Record<string, unknown>
  ) {
    const instance = CrashlyticsService.getInstance();
    instance._trackError(error, params);
  }

  public static log(message: string) {
    const instance = CrashlyticsService.getInstance();
    instance._log(message);
  }

  public static identifyUser(userId: string, traits?: Record<string, unknown>) {
    const instance = CrashlyticsService.getInstance();
    instance._identifyUser(userId, traits);
  }

  public static reset() {
    const instance = CrashlyticsService.getInstance();
    instance._reset();
  }
}

export default CrashlyticsService;

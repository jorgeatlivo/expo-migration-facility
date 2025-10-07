import { AnalyticEvents } from '@/services/analytics/events';

export interface ICrashlyticsAdapter {
  trackError(error: Error, params?: Record<string, unknown>): void;
  log(message: string): void;
  identifyUser(userId: string, traits?: Record<string, unknown>): void;
  reset(): void;
}

export interface IAnalyticsAdapter {
  trackPageView(url: string): void;
  trackEvent(event: AnalyticEvents, params?: Record<string, unknown>): void;
  identifyUser(userId: string, traits?: Record<string, unknown>): void;
  reset(): void;
  setLocale?: (locale: string) => void;
}

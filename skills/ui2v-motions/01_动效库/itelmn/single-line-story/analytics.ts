type AnalyticsValue = string | number | boolean;
type AnalyticsParameters = Record<string, AnalyticsValue | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (command: "event", eventName: string, parameters?: Record<string, AnalyticsValue>) => void;
  }
}

const productionHostname = /^(www\.)?plotbeat\.app$/i;

export function trackAnalyticsEvent(eventName: string, parameters: AnalyticsParameters = {}) {
  if (typeof window === "undefined" || !productionHostname.test(window.location.hostname) || !window.gtag) return;

  const safeParameters = Object.fromEntries(
    Object.entries(parameters)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, typeof value === "string" ? value.slice(0, 100) : value]),
  ) as Record<string, AnalyticsValue>;

  window.gtag("event", eventName.slice(0, 40), safeParameters);
}

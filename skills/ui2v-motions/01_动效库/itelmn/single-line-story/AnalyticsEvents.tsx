"use client";

import { useEffect } from "react";
import { trackAnalyticsEvent } from "../analytics";

export function AnalyticsEvents() {
  useEffect(() => {
    function trackClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest<HTMLElement>("[data-analytics-event]");
      if (!target) return;

      const { analyticsDestination, analyticsEvent, analyticsId, analyticsLocation } = target.dataset;
      if (!analyticsEvent || !analyticsId) return;

      trackAnalyticsEvent(analyticsEvent, {
        element_id: analyticsId,
        ui_location: analyticsLocation,
        destination: analyticsDestination,
      });
    }

    document.addEventListener("click", trackClick, { capture: true });
    return () => document.removeEventListener("click", trackClick, { capture: true });
  }, []);

  return null;
}


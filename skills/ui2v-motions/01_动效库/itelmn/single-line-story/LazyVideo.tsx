"use client";

import { useEffect, useRef, useState } from "react";

export function LazyVideo({ src, poster, label, eager = false }: { src: string; poster: string; label: string; eager?: boolean }) {
  const container = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(eager);

  useEffect(() => {
    if (active || !container.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setActive(true),
      { rootMargin: "240px 0px" },
    );
    observer.observe(container.current);
    return () => observer.disconnect();
  }, [active]);

  useEffect(() => {
    if (!active || !video.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    video.current.play().catch(() => undefined);
  }, [active]);

  return (
    <div className="lazy-video" ref={container}>
      {active ? (
        <video ref={video} loop muted playsInline preload="none" poster={poster} aria-label={label}>
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        // Native lazy loading keeps below-the-fold video posters off the initial request path.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt={label} loading="lazy" decoding="async" />
      )}
    </div>
  );
}

export function PlotbeatMark({ className = "", inverse = false, label }: { className?: string; inverse?: boolean; label?: string }) {
  return (
    <span
      className={`plotbeat-mark${inverse ? " plotbeat-mark-inverse" : ""}${className ? ` ${className}` : ""}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <svg viewBox="-8 0 272 232" focusable="false">
        <g className="plotbeat-layer plotbeat-layer-cyan">
          <path d="M118 14h73c20 0 33 14 32 34l-3 62c-1 20-15 32-35 32h-72c-20 0-33-14-32-34l3-62c1-20 14-32 34-32Z" />
        </g>
        <g className="plotbeat-layer plotbeat-layer-violet">
          <path d="M83 43h78c22 0 36 15 35 37l-3 68c-1 21-16 35-38 35H78c-22 0-36-16-35-37l3-68c1-22 15-35 37-35Z" />
        </g>
        <g className="plotbeat-layer plotbeat-layer-face">
          <g transform="rotate(-4 101 147)">
            <path d="M47 76h94c24 0 39 16 38 40l-3 68c-1 23-17 38-41 38H42c-24 0-39-17-38-40l3-68c1-23 17-38 40-38Z" />
            <rect width="20" height="55" x="54" y="117" rx="10" />
            <rect width="22" height="59" x="102" y="113" rx="11" />
          </g>
        </g>
      </svg>
    </span>
  );
}

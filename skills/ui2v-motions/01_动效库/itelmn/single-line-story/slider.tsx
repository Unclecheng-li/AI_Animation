"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Slider({ className, value, defaultValue, min = 0, max = 100, ...props }: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const values = React.useMemo(
    () => (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min]),
    [defaultValue, min, value],
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      className={cn("plotbeat-slider", className)}
      {...props}
    >
      <SliderPrimitive.Track data-slot="slider-track" className="plotbeat-slider-track">
        <SliderPrimitive.Range data-slot="slider-range" className="plotbeat-slider-range" />
      </SliderPrimitive.Track>
      {values.map((_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          className="plotbeat-slider-thumb"
          aria-label={props["aria-label"]}
          key={index}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };

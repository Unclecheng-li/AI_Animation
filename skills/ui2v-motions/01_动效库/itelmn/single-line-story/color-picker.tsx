"use client";

import { Input } from "./input";

type ColorPickerProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="plotbeat-color-picker">
      <span className="plotbeat-color-swatch" style={{ backgroundColor: value }}>
        <Input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label={`${label} color`}
        />
      </span>
      <span className="plotbeat-color-copy">
        <b>{label}</b>
        <code>{value}</code>
      </span>
    </div>
  );
}

export { ColorPicker };

import { useMemo, useState } from "react";
import { CopyButton, Field, Panel, SaveBar } from "../../components";

function clamp(value: number, max = 255) {
  return Math.min(max, Math.max(0, Math.round(value)));
}

function hexToRgb(hex: string) {
  const raw = hex.replace("#", "");
  const full = raw.length === 3 ? raw.split("").map((c) => c + c).join("") : raw;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function rgbToHsl(r: number, g: number, b: number) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      default:
        h = (rn - gn) / d + 4;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function ColorTool() {
  const [hex, setHex] = useState("#c45c26");
  const rgb = useMemo(() => hexToRgb(hex), [hex]);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;

  return (
    <Panel title="Color Lab" hint="Hex, RGB, and HSL for the same swatch.">
      <div className="row">
        <Field label="Hex">
          <input value={hex} onChange={(event) => setHex(event.target.value)} />
        </Field>
        <input
          type="color"
          value={rgb ? `#${[rgb.r, rgb.g, rgb.b].map((n) => n.toString(16).padStart(2, "0")).join("")}` : "#000000"}
          onChange={(event) => setHex(event.target.value)}
          aria-label="Color picker"
        />
      </div>
      <div className="swatch" style={{ background: rgb ? `rgb(${rgb.r} ${rgb.g} ${rgb.b})` : "#222" }} />
      {rgb && hsl ? (
        <div className="stat-row">
          <div>
            <small>RGB</small>
            <strong>{`${clamp(rgb.r)}, ${clamp(rgb.g)}, ${clamp(rgb.b)}`}</strong>
            <CopyButton value={`rgb(${rgb.r} ${rgb.g} ${rgb.b})`} />
          </div>
          <div>
            <small>HSL</small>
            <strong>{`${hsl.h}° ${hsl.s}% ${hsl.l}%`}</strong>
            <CopyButton value={`hsl(${hsl.h} ${hsl.s}% ${hsl.l}%)`} />
          </div>
        </div>
      ) : (
        <p className="alert">Enter a 3- or 6-digit hex color.</p>
      )}
      <SaveBar tool="color" defaultTitle="Color" payload={hex} />
    </Panel>
  );
}

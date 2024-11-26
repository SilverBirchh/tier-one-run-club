import { Check, Palette } from "lucide-react";
import { useState } from "react";
import type { Colour } from "./types";
import { HSLToHex } from "./generateColours";

type AccentOption = {
  name: string;
  color: string;
};

const generateHarmonies = (baseColor: string): AccentOption[] => {
  const hexToHSL = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s,
      l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return { h: h * 360, s: (s || 0) * 100, l: l * 100 };
  };

  const HSLToHex = (h: number, s: number, l: number): string => {
    h = h % 360;
    s = Math.min(100, Math.max(0, s));
    l = Math.min(100, Math.max(0, l));

    const c = ((1 - Math.abs((2 * l) / 100 - 1)) * s) / 100;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l / 100 - c / 2;

    let r = 0,
      g = 0,
      b = 0;

    if (h < 60) {
      r = c;
      g = x;
    } else if (h < 120) {
      r = x;
      g = c;
    } else if (h < 180) {
      g = c;
      b = x;
    } else if (h < 240) {
      g = x;
      b = c;
    } else if (h < 300) {
      r = x;
      b = c;
    } else {
      r = c;
      b = x;
    }

    return `#${Math.round((r + m) * 255)
      .toString(16)
      .padStart(2, "0")}${Math.round((g + m) * 255)
      .toString(16)
      .padStart(2, "0")}${Math.round((b + m) * 255)
      .toString(16)
      .padStart(2, "0")}`;
  };

  const { h, s, l } = hexToHSL(baseColor);

  return [
    { name: "Original", color: baseColor },
    { name: "Complementary", color: HSLToHex((h + 180) % 360, s, l) },
    { name: "Triadic 1", color: HSLToHex((h + 120) % 360, s, l) },
    { name: "Triadic 2", color: HSLToHex((h + 240) % 360, s, l) },
    { name: "Analogous 1", color: HSLToHex((h + 30) % 360, s, l) },
    { name: "Analogous 2", color: HSLToHex((h - 30 + 360) % 360, s, l) },
    { name: "Split Comp 1", color: HSLToHex((h + 150) % 360, s, l) },
    { name: "Split Comp 2", color: HSLToHex((h + 210) % 360, s, l) },
    { name: "Lighter", color: HSLToHex(h, s, Math.min(100, l + 15)) },
    { name: "Darker", color: HSLToHex(h, s, Math.max(0, l - 15)) },
  ];
};

const generateRandomAccent = (): AccentOption => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 70 + Math.random() * 20;
  const lightness = 55 + Math.random() * 20;

  return {
    name: "Random",
    color: HSLToHex(hue, saturation, lightness),
  };
};

type AccentPickerProps = {
  currentColour: Colour;
  onAccentSelect: (newAccent: string) => void;
};

export const AccentPicker = ({
  currentColour,
  onAccentSelect,
}: AccentPickerProps) => {
  const getBaseColor = (colour: Colour): string => {
    if ("style" in colour) {
      const match = colour.style.match(/#[0-9a-fA-F]{6}/);
      return match ? match[0] : "#000000";
    }
    return "#000000";
  };

  const baseColor = getBaseColor(currentColour);
  const [accents] = useState<AccentOption[]>(generateHarmonies(baseColor));

  const AccentButton = ({ accent }: { accent: AccentOption }) => (
    <div className="space-y-2">
      <button
        onClick={() => onAccentSelect(accent.color)}
        className={`
        group relative w-full h-24 rounded-lg shadow-md
        transition-transform hover:scale-105
        focus:outline-none focus:ring-2 focus:ring-blue-500
      `}
        style={{ backgroundColor: accent.color }}
        aria-label={`Select ${accent.name} accent color`}
      >
        {currentColour.accent === accent.color && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-full p-1">
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>
        )}
        <div
          className="absolute bottom-0 left-0 right-0 p-2 bg-black/50
          text-white text-sm rounded-b-lg opacity-0
          group-hover:opacity-100 transition-opacity"
        >
          {accent.name}
        </div>
      </button>
    </div>
  );

  const handleRandomAccent = () => {
    const newAccent = generateRandomAccent();
    onAccentSelect(newAccent.color);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accents.map((accent) => (
          <AccentButton key={accent.name} accent={accent} />
        ))}
        <div className="space-y-2">
          <button
            onClick={handleRandomAccent}
            className="relative w-full h-24 rounded-lg shadow-md bg-gray-100
      border-2 border-dashed border-gray-300
      transition-transform hover:scale-105
      flex items-center justify-center"
            aria-label="Generate random accent color"
          >
            <div className="flex flex-col items-center gap-1">
              <Palette className="w-6 h-6 text-gray-600" />
              <span className="text-sm text-gray-600">Random</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

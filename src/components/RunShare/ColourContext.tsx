import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Colour } from "./types";

const DEFAULT_COLOURS = [
  {
    name: "Sunset Vibes",
    style: "linear-gradient(to right, #f97316, #ec4899, #a855f7)",
    accent: "#facc15",
  },
  {
    name: "Ocean Breeze",
    style: "linear-gradient(to right, #06b6d4, #3b82f6)",
    accent: "#99f6e4",
  },
  {
    name: "Forest Fresh",
    style: "linear-gradient(to right, #4ade80, #10b981)",
    accent: "#fde047",
  },
  {
    name: "Berry Blast",
    style: "linear-gradient(to right, #a855f7, #ec4899)",
    accent: "#bfdbfe",
  },
  {
    name: "Golden Hour",
    style: "linear-gradient(to right, #facc15, #f97316)",
    accent: "#a855f7",
  },
  {
    name: "Electric Blue",
    style: "#3b82f6",
    accent: "#fde047",
  },
  {
    name: "Emerald Green",
    style: "#10b981",
    accent: "#f9a8d4",
  },
  {
    name: "Deep Purple",
    style: "#9333ea",
    accent: "#86efac",
  },
  {
    name: "Coral Red",
    style: "#f87171",
    accent: "#bfdbfe",
  },
  {
    name: "Royal Gold",
    style: "#eab308",
    accent: "#9333ea",
  },
];

type ColourContext = {
  colours: Colour[];
};

const ColourContext = createContext<ColourContext | null>(null);

export const useColours = () => {
  const colourContext = useContext(ColourContext);

  if (!colourContext) {
    throw new Error("colourContext must be used in a ColourProvider");
  }
  return colourContext;
};

export const ColourProvider = ({ children }: { children: ReactNode }) => {
  const [colours] = useState<Colour[]>(DEFAULT_COLOURS);

  return (
    <ColourContext.Provider value={useMemo(() => ({ colours }), [colours])}>
      {children}
    </ColourContext.Provider>
  );
};

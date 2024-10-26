import { useRef, useState } from "react";
import { ParsedGPX } from "@we-gold/gpxjs";
import { DropZone } from "./DropZone";
import { exportAsImage } from "./utils";
import { Button } from "../ui/button";
import { StatCard } from "./StatCard";
import ColorPicker, { type Colour } from "./ColourPicker";

export const RunShare = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [gpx, setGpx] = useState<ParsedGPX | null>(null);
  const [colour, setColour] = useState<Colour | null>(null);

  if (!gpx) return <DropZone setGpx={setGpx} />;

  return (
    <div className="flex w-full justify-center items-center flex-col md:flex-row gap-5">
      <div className="w-full flex-1">
        <ColorPicker onColorSelect={setColour} />
        <Button
          className="font-bold w-full"
          onClick={() => exportAsImage(ref.current)}
        >
          Export
        </Button>
      </div>
      <div className="rounded-md overflow-hidden flex-2">
        <StatCard gpx={gpx} backgroundColor={colour?.className} accentColor={colour?.accent} />

      </div>
      <div className="w-[600px] h-[600px] absolute top-[-99999px]">
        <StatCard ref={ref} gpx={gpx} backgroundColor={colour?.className} accentColor={colour?.accent} />
      </div>
    </div>
  );
};

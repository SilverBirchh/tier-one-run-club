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
    <div className="flex w-full justify-center items-center flex-col md:flex-row gap-5 col-start-2 full-bleed max-w-[1200px]">
      <div className="w-full md:w-1/2">
        <ColorPicker onColorSelect={setColour} />
        <Button
          className="font-bold"
          onClick={() => exportAsImage(ref.current)}
        >
          Export
        </Button>
      </div>
      <div className="rounded-md overflow-hidden w-full md:w-1/2">
        <StatCard gpx={gpx} backgroundColor={colour?.className} accentColor={colour?.accent} />
      </div>
      <div className="w-[1080px] h-[1080px] absolute top-[-99999px]">
        <StatCard ref={ref} gpx={gpx} backgroundColor={colour?.className} accentColor={colour?.accent} />
      </div>
    </div>
  );
};

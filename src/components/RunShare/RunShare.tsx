import { useRef, useState } from "react";
import { ParsedGPX } from "@we-gold/gpxjs";
import { DropZone } from "./DropZone";
import { exportAsImage } from "./utils";
import { Button } from "../ui/button";
import { StatCard } from "./StatCard";
import { defaultColour, ColourPicker } from "./ColourPicker";
import type { Colour } from "./types";
import { Tabs } from "../Tabs";
import { ColourProvider } from "./ColourContext";
import { AccentPicker } from "./AccentPicker";

export const RunShare = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [gpx, setGpx] = useState<ParsedGPX | null>(null);
  const [selectedColour, setColour] = useState<Colour>(defaultColour);  

  const handleAccentChange = (newAccent: string) => {
    setColour((prev) => ({
      ...prev,
      accent: newAccent,
    }));
  };

  if (!gpx) return <DropZone setGpx={setGpx} />;

  return (
    <ColourProvider>
      
        <div className="flex-col md:flex-row gap-5 max-w-[1200px] h-full col-start-2 full-bleed relative flex w-full justify-center items-center">
          <div className="w-full md:w-1/2 h-full">
            <Tabs
              data={[
                // {
                //   title: "Layout",
                //   value: "layout",
                //   content: <></>,
                // },
                {
                  title: "Background",
                  value: "background",
                  content: (
                    <ColourPicker
                      selectedColour={selectedColour}
                      onColourSelect={setColour}
                    />
                  ),
                },
                {
                  title: "Accent",
                  value: "accent",
                  content: (
                    <AccentPicker
                      currentColour={selectedColour}
                      onAccentSelect={handleAccentChange}
                    />
                  ),
                },
                // {
                //   title: "Stickers",
                //   value: "stickers",
                //   content: <></>,
                // },
                // {
                //   title: "Photo",
                //   value: "photo",
                //   content: <></>,
                // },
              ]}
              defaultValue="background"
              className="space-y-8 w-full"
            />
          </div>
          <div className="w-full md:w-1/2 h-full flex items-center justify-center flex-col">
          <div>

          
            <StatCard gpx={gpx} colour={selectedColour} />
            <div className="col-start-2 full-bleed mt-5 text-left">
              <Button
                className="w-fit"
                onClick={() => exportAsImage(ref.current)}
              >
                Export
              </Button>
            </div>
            </div>
          </div>
          {/* Hidden card for export */}
          <div className="w-[1080px] h-[1080px] fixed top-[-99999px]">
            <StatCard ref={ref} gpx={gpx} colour={selectedColour} />
          </div>
        </div>
      
    </ColourProvider>
  );
};

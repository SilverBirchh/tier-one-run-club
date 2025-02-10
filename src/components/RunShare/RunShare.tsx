import { useRef, useState } from "react";
import { ParsedGPX } from "@we-gold/gpxjs";
import { DropZone } from "./DropZone";
import { exportAsImage } from "./utils";
import { Button } from "../ui/button";
import { StatCard } from "./StatCard";
import { defaultColour, ColourPicker } from "./ColourPicker";
import type { Colour, TextData } from "./types";
import { Tabs } from "../Tabs";
import { ColourProvider } from "./ColourContext";
import { AccentPicker } from "./AccentPicker";
import { defaultText, Info } from "./Info";
import { StickerPicker } from "./StickerPicker";
import { LayoutPicker } from "./LayoutPicker";

export const RunShare = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [gpx, setGpx] = useState<ParsedGPX | null>(null);
  const [selectedColour, setColour] = useState<Colour>(defaultColour);
  const [selectedStickerId, setSelectedStickerId] = useState<
    string | undefined
  >("trophy");
  const [text, setText] = useState<TextData>(defaultText);
  const [selectedLayout, setSelectedLayout] = useState<string>('data-focused');
  const handleAccentChange = (newAccent: string) => {
    setColour((prev) => ({
      ...prev,
      accent: newAccent,
    }));
  };

  if (!gpx) return <DropZone setGpx={setGpx} />;

  return (
    <ColourProvider>
      <div className="flex-col items-start md:flex-row gap-5 max-w-[1200px] h-full col-start-2 full-bleed px-5 flex w-full justify-center relative">
  
        <div className="w-full md:w-1/2 h-full">
          <Tabs
            data={[
              {
                title: "Layout",
                value: "layout",
                content: (
                  <LayoutPicker
                    selectedLayoutId={selectedLayout}
                    onLayoutSelect={setSelectedLayout}
                  />
                ),
              },
              {
                title: "Text",
                value: "text",
                content: <Info text={text} setText={setText} gpx={gpx} layout={selectedLayout} />,
              },
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
              {
                title: "Stickers",
                value: "stickers",
                content: (
                  <StickerPicker
                    selectedStickerId={selectedStickerId}
                    onStickerSelect={setSelectedStickerId}
                  />
                ),
              },
              // {
              //   title: "Data",
              //   value: "data",
              //   content: <></>,
              // },
              // {
              //   title: "Photo",
              //   value: "photo",
              //   content: <></>,
              // },
            ]}
            defaultValue="layout"
            className="space-y-8 w-full"
          />
        </div>
        <div className="w-full md:w-1/2 h-full flex items-center justify-start flex-col">
          <div className="sticky top-28 w-full flex items-center flex-col">
            <StatCard
              gpx={gpx}
              colour={selectedColour}
              text={text}
              sticker={selectedStickerId}
              layout={selectedLayout}
            />
            <div className="mt-5 self-start">
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
          <StatCard
            ref={ref}
            gpx={gpx}
            colour={selectedColour}
            text={text}
            layout={selectedLayout}
            sticker={selectedStickerId}
          />
        </div>
      </div>
    </ColourProvider>
  );
};

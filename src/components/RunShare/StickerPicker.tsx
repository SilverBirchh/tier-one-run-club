import {
  Medal,
  Trophy,
  Crown,
  Award,
  Star,
  PersonStanding,
  Timer,
  Activity,
  Mountain,
  Trees,
  Sun,
  Wind,
  TrendingUp,
  BarChart2,
  Navigation,
  LineChart,
  Heart,
  Watch,
  Zap,
  Target,
  ThumbsUp,
  Footprints,
  Map,
  CloudSun,
  Snowflake,
  Thermometer,
  Dumbbell,
  Scale,
  Apple,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface StickerPickerProps {
  selectedStickerId: string | undefined;
  onStickerSelect: (stickerId: string | undefined) => void;
}

export const stickers = [
    { id: "medal", icon: Medal, label: "Medal" },
    { id: "trophy", icon: Trophy, label: "Trophy" },
    { id: "crown", icon: Crown, label: "Crown" },
    { id: "award", icon: Award, label: "Award" },
    { id: "star", icon: Star, label: "Star" },
    { id: "standing", icon: PersonStanding, label: "Standing" },
    { id: "activity", icon: Activity, label: "Activity" },
    { id: "timer", icon: Timer, label: "Timer" },
    { id: "mountain", icon: Mountain, label: "Mountain" },
    { id: "trees", icon: Trees, label: "Trail" },
    { id: "sun", icon: Sun, label: "Sun" },
    { id: "wind", icon: Wind, label: "Wind" },
    { id: "trending", icon: TrendingUp, label: "Trend" },
    { id: "barchart", icon: BarChart2, label: "Stats" },
    { id: "linechart", icon: LineChart, label: "Progress" },
    { id: "heart", icon: Heart, label: "Heart" },
    { id: "zap", icon: Zap, label: "Energy" },
    { id: "target", icon: Target, label: "Goal" },
    { id: "thumbs", icon: ThumbsUp, label: "Great!" },
    { id: "shoe", icon: Footprints, label: "Shoes" },
    { id: "watch", icon: Watch, label: "Watch" },
    { id: "map", icon: Map, label: "Map" },
    { id: "navigation", icon: Navigation, label: "Route" },
    { id: "workout", icon: Dumbbell, label: "Strength" },
    { id: "weight", icon: Scale, label: "Weight" },
    { id: "nutrition", icon: Apple, label: "Nutrition" },
    { id: "cloudsun", icon: CloudSun, label: "CloudSun" },
    { id: "snowflake", icon: Snowflake, label: "Snowflake" },
    { id: "thermometer", icon: Thermometer, label: "Thermometer" },
  ];


export const StickerPicker = ({
  selectedStickerId,
  onStickerSelect,
}: StickerPickerProps) => {
  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-4 gap-3">
        {stickers.map((sticker) => (
          <div key={sticker.id} className="relative">
            <Button
              variant="outline"
              className="w-full p-4 h-auto aspect-square flex flex-col items-center justify-center gap-2 hover:bg-accent"
              onClick={() => onStickerSelect(sticker.id)}
            >
              <sticker.icon />
              <span className="text-xs">{sticker.label}</span>
            </Button>
            {selectedStickerId === sticker.id && (
              <div className="absolute -bottom-2 left-0 right-0 flex justify-center">
                <div className="flex items-center gap-1 px-2 py-1 bg-primary rounded-full text-primary-foreground text-xs">
                  <span>Selected</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStickerSelect(undefined);
                    }}
                    className="ml-1 hover:text-primary-foreground/80"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

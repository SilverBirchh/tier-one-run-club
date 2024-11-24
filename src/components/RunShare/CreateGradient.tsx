import { Label } from "@radix-ui/react-label";
import { Trash } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface GradientStop {
  color: string;
  position: number;
}

interface Colour {
  name: string;
  className: string;
  accent: string;
}

interface CustomGradientModalProps {
  onColourSelect: (colour: Colour) => void;
}

type GradientDirection =
  | "to-r"
  | "to-l"
  | "to-t"
  | "to-b"
  | "to-tr"
  | "to-tl"
  | "to-br"
  | "to-bl";

const directionOptions: Record<GradientDirection, string> = {
  "to-r": "Left to Right",
  "to-l": "Right to Left",
  "to-t": "Bottom to Top",
  "to-b": "Top to Bottom",
  "to-tr": "Bottom Left to Top Right",
  "to-tl": "Bottom Right to Top Left",
  "to-br": "Top Left to Bottom Right",
  "to-bl": "Top Right to Bottom Left",
};

const CustomGradientModal: React.FC<CustomGradientModalProps> = ({
  onColourSelect,
}) => {
  const [gradientStops, setGradientStops] = useState<GradientStop[]>([
    { color: "#3B82F6", position: 0 }, // blue-500
    { color: "#10B981", position: 100 }, // emerald-500
  ]);
  const [gradientName, setGradientName] = useState<string>("");
  const [direction, setDirection] = useState<GradientDirection>("to-r");

  const handleAddStop = () => {
    if (gradientStops.length < 5) {
      const lastStop = gradientStops[gradientStops.length - 1];
      const newPosition = Math.min(lastStop.position + 20, 100);
      setGradientStops([
        ...gradientStops,
        { color: "#ffffff", position: newPosition },
      ]);
    }
  };

  const handleRemoveStop = (index: number) => {
    if (gradientStops.length > 2) {
      setGradientStops(gradientStops.filter((_, i) => i !== index));
    }
  };

  const updateStop = (index: number, updates: Partial<GradientStop>) => {
    setGradientStops(
      gradientStops.map((stop, i) =>
        i === index ? { ...stop, ...updates } : stop
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const gradientClass = `bg-gradient-${direction} ${gradientStops
      .map((stop) =>
        stop.position === 0
          ? `from-[${stop.color}]`
          : stop.position === 100
            ? `to-[${stop.color}]`
            : `via-[${stop.color}]`
      )
      .join(" ")}`;

    const newGradient: Colour = {
      name: gradientName || "Custom Gradient",
      className: gradientClass,
      accent: "text-white",
    };

    onColourSelect(newGradient);
  };

  const getGradientAngle = (dir: GradientDirection): string => {
    switch (dir) {
      case "to-r":
        return "90deg";
      case "to-l":
        return "270deg";
      case "to-t":
        return "0deg";
      case "to-b":
        return "180deg";
      case "to-tr":
        return "45deg";
      case "to-tl":
        return "315deg";
      case "to-br":
        return "135deg";
      case "to-bl":
        return "225deg";
    }
  };

  const gradientStyle: React.CSSProperties = {
    background: `linear-gradient(${getGradientAngle(direction)}, ${gradientStops
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(", ")})`,
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Create Custom Gradient</DialogTitle>
        <DialogDescription>
          Design your perfect gradient by adjusting colors and positions.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          className="w-full h-32 rounded-lg shadow-md"
          style={gradientStyle}
        />

        <div className="space-y-2">
          <Label htmlFor="gradientName">Gradient Name</Label>
          <Input
            id="gradientName"
            placeholder="My Custom Gradient"
            value={gradientName}
            onChange={(e) => setGradientName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Gradient Direction</Label>
          <Select
            value={direction}
            onValueChange={(value) => setDirection(value as GradientDirection)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select direction" />
            </SelectTrigger>
            <SelectContent>
              {(
                Object.entries(directionOptions) as [
                  GradientDirection,
                  string,
                ][]
              ).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Color Stops</Label>
            {gradientStops.length < 5 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddStop}
              >
                Add Color Stop
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {gradientStops.map((stop, index) => (
              <div key={index} className="flex items-center gap-4">
                <Input
                  type="color"
                  value={stop.color}
                  onChange={(e) => updateStop(index, { color: e.target.value })}
                  className="w-20 h-10"
                />

                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={stop.position}
                  onChange={(e) =>
                    updateStop(index, { position: parseInt(e.target.value) })
                  }
                  className="w-20"
                />

                {gradientStops.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveStop(index)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full">
          Add Gradient
        </Button>
      </form>
    </DialogContent>
  );
};

export default CustomGradientModal;

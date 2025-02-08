import { Check, Infinity, Palette } from "lucide-react";
import { generateRandomGradient, generateSolidColorPair } from "./generateColours";
import type { Colour } from "./types";
import { useColours } from "./ColourContext";

type ColourPicker = {
  onColourSelect: (colour: Colour) => void;
  selectedColour: Colour;
};

export const defaultColour = {
  name: "Electric Blue",
  style: "#3b82f6",
  accent: "#0a59da",
};

const CreateColorButton = ({
  onColourSelect,
  type = "gradient",
  icon: Icon = type === "gradient" ? Infinity : Palette,
  label = type === "gradient" ? "Random Gradient" : "Random Solid",
}: {
  onColourSelect: (colour: Colour) => void;
  type?: "gradient" | "solid";
  icon?: React.ElementType;
  label?: string;
}) => {
  const handleClick = () => {
    const timestamp = new Date().getTime();
    const { style, accent } =
      type === "gradient" ? generateRandomGradient() : generateSolidColorPair();

    onColourSelect({
      name: `Random ${type === "gradient" ? "Gradient" : "Solid"} ${timestamp}`,
      style,
      accent,
    });
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleClick}
        className={`
          relative w-full h-24 rounded-lg shadow-md
          transition-transform hover:scale-105
          focus:outline-none focus:ring-2 focus:ring-blue-500
          bg-gray-100 border-2 border-dashed border-gray-300
          flex items-center justify-center
        `}
        aria-label={`Create Custom ${type === "gradient" ? "Gradient" : "Solid Color"}`}
      >
        <div className="flex flex-col items-center gap-2 text-gray-600">
          <Icon className="w-6 h-6" />
          <span className="text-sm font-medium">{label}</span>
        </div>
      </button>
    </div>
  );
};

const ColourOption = ({
  colour,
  onColourSelect,
  isSelected,
}: {
  colour: Colour;
  onColourSelect: (colour: Colour) => void;
  isSelected: boolean;
}) => (
  <div className="space-y-2">
    <button
      onClick={() => onColourSelect(colour)}
      className={`
        relative w-full h-24 rounded-lg shadow-md 
        transition-transform hover:scale-105 
        focus:outline-none focus:ring-2 focus:ring-blue-500 
        ${"className" in colour ? colour.className : ""}
      `}
      style={"style" in colour ? { background: colour.style } : undefined}
      aria-label={`Select ${colour.name}`}
    >
      {isSelected && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white rounded-full p-1">
            <Check className="w-6 h-6 text-green-600" />
          </div>
        </div>
      )}
    </button>
  </div>
);

export const ColourPicker = ({
  onColourSelect,
  selectedColour,
}: ColourPicker) => {
  
  const { colours } = useColours()

  const selectColour = (colour: Colour) => {
    onColourSelect(colour);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {colours.map((colour) => (
            <ColourOption
              key={colour.name}
              colour={colour}
              isSelected={selectedColour.name === colour.name}
              onColourSelect={onColourSelect}
            />
          ))}
          <CreateColorButton
            onColourSelect={selectColour}
            type="gradient"
          />
          <CreateColorButton onColourSelect={selectColour} type="solid" />
        </div>
      </div>
    </div>
  );
};

export default ColourPicker;

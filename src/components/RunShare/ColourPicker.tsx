import { useState } from "react";
import { Check } from "lucide-react";

export type Colour = {
  name: string;
  className: string;
  accent: string;
};

type ColorPicker = {
  onColorSelect: (colour: Colour) => void;
};

const ColorPicker = ({ onColorSelect }: ColorPicker) => {
  const [selectedColor, setSelectedColor] = useState<Colour | null>(null);

  const gradients = [
    {
      name: "Sunset Vibes",
      className: "bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500",
      accent: "text-yellow-400",
    },
    {
      name: "Ocean Breeze",
      className: "bg-gradient-to-r from-cyan-500 to-blue-500",
      accent: "text-teal-200",
    },
    {
      name: "Forest Fresh",
      className: "bg-gradient-to-r from-green-400 to-emerald-500",
      accent: "text-yellow-300",
    },
    {
      name: "Berry Blast",
      className: "bg-gradient-to-r from-purple-500 to-pink-500",
      accent: "text-blue-200",
    },
    {
      name: "Golden Hour",
      className: "bg-gradient-to-r from-yellow-400 to-orange-500",
      accent: "text-purple-500",
    },
  ];

  const solidColors = [
    {
      name: "Electric Blue",
      className: "bg-blue-500",
      accent: "text-yellow-300",
    },
    {
      name: "Emerald Green",
      className: "bg-emerald-500",
      accent: "text-pink-300",
    },
    {
      name: "Deep Purple",
      className: "bg-purple-600",
      accent: "text-green-300",
    },
    {
      name: "Coral Red",
      className: "bg-red-400",
      accent: "text-blue-200",
    },
    {
      name: "Royal Gold",
      className: "bg-yellow-500",
      accent: "text-purple-600",
    },
  ];

  const handleColorSelect = (color: Colour) => {
    setSelectedColor(color);
    if (onColorSelect) {
      onColorSelect(color);
    }
  };

  const ColorOption = ({ color }: { color: Colour }) => (
    <div className="space-y-2">
      <button
        onClick={() => handleColorSelect(color)}
        className={`
          relative w-full h-24 rounded-lg shadow-md 
          transition-transform hover:scale-105 
          focus:outline-none focus:ring-2 focus:ring-blue-500 
          ${color.className}
        `}
        aria-label={`Select ${color.name}`}
      >
        {selectedColor?.name === color.name && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-full p-1">
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>
        )}
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
    <div>
      <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gradients.map((gradient) => (
          <ColorOption key={gradient.name} color={gradient} />
        ))}
        {solidColors.map((color) => (
          <ColorOption key={color.name} color={color} />
        ))}
      </div>
    </div>
  </div>
  )

};

export default ColorPicker;

import type { Colour } from "./types";

type StatBoxProps = {
  label: string;
  value: string;
  icon: React.ElementType;
  accentColor?: Colour
};

export const StatBox = ({
  label,
  value,
  icon: Icon,
  accentColor,
}: StatBoxProps) => {
  const getAccentStyle = () => {
    if (!accentColor) return '';
    
    if ('style' in accentColor) {
      return { color: accentColor.accent };
    }
    return accentColor.accent;
  };

  const iconStyle = getAccentStyle();
  const iconClassName = typeof iconStyle === 'string' ? `w-5 h-5 mb-1 ${iconStyle}` : 'w-5 h-5 mb-1';

  return (
    <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
      <Icon 
        className={iconClassName}
        style={typeof iconStyle === 'object' ? iconStyle : undefined}
      />
      <div className="text-xs text-white/70 mb-1">{label}</div>
      <div className="text-lg font-bold text-white">{value}</div>
    </div>
  );
};

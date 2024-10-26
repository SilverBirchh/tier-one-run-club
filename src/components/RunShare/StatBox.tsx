export const StatBox = ({
    label,
    value,
    icon: Icon,
    accentColor,
  }: {
    label: string;
    value: string;
    icon: React.ElementType;
    accentColor: string;
  }) => (
    <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
      <Icon className={`w-5 h-5 mb-1 ${accentColor}`} />
      <div className="text-xs text-white/70 mb-1">{label}</div>
      <div className="text-lg font-bold text-white">{value}</div>
    </div>
  );
  
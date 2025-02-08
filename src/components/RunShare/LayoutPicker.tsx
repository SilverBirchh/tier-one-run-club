import { Button } from '@/components/ui/button';
import { LayoutGrid, FileText } from 'lucide-react';

const layouts = [
  {
    id: 'data-focused',
    icon: LayoutGrid,
    label: 'Data Focus',
    description: 'Emphasizes statistics and metrics'
  },
  {
    id: 'instruction-focused',
    icon: FileText,
    label: 'Instruction Focus',
    description: 'Highlights workout instructions'
  }
];

interface LayoutPickerProps {
  selectedLayoutId?: string;
  onLayoutSelect: (layoutId: string) => void;
}

export const LayoutPicker = ({
  selectedLayoutId,
  onLayoutSelect,
}: LayoutPickerProps) => {
  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {layouts.map((layout) => (
          <div key={layout.id} className="relative">
            <Button
              variant="outline"
              className="w-full p-4 h-auto aspect-video flex flex-col items-center justify-center gap-2 hover:bg-accent"
              onClick={() => onLayoutSelect(layout.id)}
            >
              <layout.icon className="w-8 h-8" />
              <span className="font-medium text-sm break-words text-center whitespace-normal">{layout.label}</span>
              <span className="text-xs text-muted-foreground break-words text-center whitespace-normal">{layout.description}</span>
            </Button>
            {selectedLayoutId === layout.id && (
              <div className="absolute -bottom-2 left-0 right-0 flex justify-center">
                <div className="flex items-center gap-1 px-2 py-1 bg-primary rounded-full text-primary-foreground text-xs">
                  <span>Selected</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayoutPicker;
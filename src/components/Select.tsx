import {
  SelectContent,
  Select as BaseSelect,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export type SelectProps = {
  triggerClass?: string;
  itemClass?: string;
  contentClass?: string;
  triggerPlaceholder: string;
  data: { value: string; text: string }[];
};

export const Select = ({
  triggerPlaceholder,
  triggerClass,
  itemClass,
  contentClass,
  data,
}: SelectProps) => {
  return (
    <BaseSelect>
      <SelectTrigger className={triggerClass}>
        <SelectValue placeholder={triggerPlaceholder} />
      </SelectTrigger>
      <SelectContent className={contentClass}>
        {data.map((d) => (
          <SelectItem key={d.value} className={itemClass} value={d.value}>
            {d.text}
          </SelectItem>
        ))}
      </SelectContent>
    </BaseSelect>
  );
};

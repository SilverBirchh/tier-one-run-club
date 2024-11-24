import {
  Tabs as BaseTabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";

type Tabs = {
  defaultValue: string;
  className?: string;
  data: {
    value: string;
    title: string | React.ReactNode;
    content: React.ReactNode;
  }[];
};

export const Tabs = ({ data, defaultValue, className }: Tabs) => {
  return (
    <BaseTabs defaultValue={defaultValue} className={className}>
      <TabsList>
        {data.map((datum) => (
          <TabsTrigger value={datum.value}>{datum.title}</TabsTrigger>
        ))}
      </TabsList>
      {data.map((datum) => (
        <TabsContent value={datum.value}>{datum.content} </TabsContent>
      ))}
    </BaseTabs>
  );
};

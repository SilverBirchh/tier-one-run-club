import * as React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

export type LineSeries = {
  key: string;
  label?: React.ReactNode;
  color?: string;
  theme?: { light: string; dark: string };
  type?: "monotone" | "linear" | "basis" | "step" | "natural";
  dot?: boolean;
  dashed?: boolean;
  yAxisId?: string; // defaults to "left"
};

export type LineChartProps<T extends Record<string, any>> = {
  data: T[];
  xKey: keyof T & string;
  xType?: "category" | "number";
  xDomain?: [number | "auto" | "dataMin", number | "auto" | "dataMax"];
  xInterval?: number | "preserveStartEnd" | "preserveEnd";
  xTickCount?: number;
  series: LineSeries[];
  className?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  xTickFormatter?: (value: any) => string;
  yTickFormatter?: (value: any) => string;
  yDomain?: [number | "auto", number | "auto"];
  tooltipValueFormatter?: (value: number, name: string, payload: any) => React.ReactNode;
  tooltipFormatters?: { [dataKey: string]: "pace" | "heartRate" };
  // Advanced: define additional Y axes
  yAxes?: Array<{
    id: string;
    orientation?: "left" | "right";
    domain?: [number | "auto", number | "auto"];
    tickFormatter?: (value: any) => string | "pace" | "heartRate";
    hide?: boolean;
  }>;
  // Custom tooltip formatter with full context
  tooltipFormatter?: (
    payload: Array<{ name: string; value: number; dataKey: string; payload: any }>,
    label: string,
    active: boolean
  ) => React.ReactNode;
};

// Built-in formatters for Y-axis ticks
const TICK_FORMATTERS = {
  pace: (value: number) => {
    const minutes = Math.floor(value / 60);
    const secs = value % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  },
  heartRate: (value: number) => `${value}`,
};

// Built-in formatters for tooltips
const TOOLTIP_FORMATTERS = {
  pace: (value: number) => {
    const minutes = Math.floor(value / 60);
    const secs = value % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  },
  heartRate: (value: number) => `${value} bpm`,
};

export function LineChart<T extends Record<string, any>>({
  data,
  xKey,
  series,
  className,
  showGrid = true,
  showLegend = false,
  xType,
  xDomain,
  xInterval,
  xTickCount,
  xTickFormatter,
  yTickFormatter,
  yDomain,
  yAxes,
  tooltipValueFormatter,
  tooltipFormatters,
  tooltipFormatter,
}: LineChartProps<T>) {
  const config = React.useMemo(() => {
    return series.reduce((acc, s) => {
      acc[s.key] = {
        label: s.label ?? s.key,
        ...(s.theme ? { theme: s.theme } : s.color ? { color: s.color } : {}),
      };
      return acc;
    }, {} as ChartConfig);
  }, [series]);

  // Custom tooltip content that provides full context
  const CustomTooltipContent = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null;
    
    // Use custom tooltipFormatter if provided
    if (tooltipFormatter) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          {tooltipFormatter(payload, label, active)}
        </div>
      );
    }

    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="text-sm font-medium mb-1">{xKey}: {label}</div>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex w-full items-center justify-between gap-4">
            <span className="text-muted-foreground flex items-center gap-2">
              <div 
                className="h-2 w-2 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              {entry.name || entry.dataKey}
            </span>
            <span className="font-mono font-medium tabular-nums text-foreground">
              {tooltipValueFormatter
                ? tooltipValueFormatter(entry.value, entry.dataKey, entry.payload)
                : tooltipFormatters?.[entry.dataKey]
                ? TOOLTIP_FORMATTERS[tooltipFormatters[entry.dataKey]](entry.value)
                : String(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ChartContainer config={config} className={className}>
      <RechartsLineChart data={data} margin={{ left: 12, right: 12 }}>
        {showGrid && <CartesianGrid vertical={false} />}
        <XAxis
          dataKey={xKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          type={xType}
          domain={xDomain}
          interval={xInterval}
          tickCount={xTickCount}
          tickFormatter={xTickFormatter}
        />
        {/* Primary (left) Y axis - only render when no custom yAxes provided */}
        {!yAxes?.length && (
          <YAxis
            yAxisId="left"
            tickLine={false}
            axisLine={false}
            tickMargin={4}
            tickFormatter={yTickFormatter}
            domain={yDomain}
          />
        )}
        {/* Additional Y axes if provided */}
        {yAxes?.map((ax) => (
          <YAxis
            key={ax.id}
            yAxisId={ax.id}
            orientation={ax.orientation || "right"}
            tickLine={false}
            axisLine={false}
            tickMargin={4}
            tickFormatter={
              typeof ax.tickFormatter === "string"
                ? TICK_FORMATTERS[ax.tickFormatter as keyof typeof TICK_FORMATTERS]
                : ax.tickFormatter
            }
            domain={ax.domain}
            hide={ax.hide}
          />
        ))}
        <ChartTooltip
          cursor={false}
          content={<CustomTooltipContent />}
        />
        {series.map((s) => (
          <Line
            key={s.key}
            type={s.type ?? "monotone"}
            dataKey={s.key}
            stroke={`var(--color-${s.key})`}
            strokeWidth={2}
            dot={s.dot ?? false}
            activeDot={{ r: 3 }}
            strokeDasharray={s.dashed ? "4 4" : undefined}
            yAxisId={s.yAxisId || "left"}
          />
        ))}
        {showLegend && <ChartLegend verticalAlign="bottom" content={<ChartLegendContent />} />}
      </RechartsLineChart>
    </ChartContainer>
  );
}

export default LineChart;
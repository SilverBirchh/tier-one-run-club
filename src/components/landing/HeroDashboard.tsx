import { motion } from "motion/react";
import { TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis } from "recharts";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { fakeDashboardMetrics, fakeWeeklyChartData } from "./fake-data";

const chartConfig = {
  km: {
    label: "Distance",
    color: "var(--color-primary)",
  },
};

export function HeroDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="overflow-hidden border-primary/10 bg-gradient-to-br from-card via-card to-primary/5 p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            This Week
          </span>
          <Badge
            variant="outline"
            className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600"
          >
            <TrendingUp className="mr-1 h-3 w-3" />
            +12%
          </Badge>
        </div>

        {/* Metric cards */}
        <TooltipProvider delayDuration={200}>
          <div className="mb-6 grid grid-cols-3 gap-3">
            {fakeDashboardMetrics.map((metric, i) => (
              <Tooltip key={metric.label}>
                <TooltipTrigger asChild>
                  <motion.div
                    className="cursor-pointer rounded-lg border border-primary/10 bg-background/50 p-3 transition-all hover:border-primary/20 hover:shadow-md"
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <p className="text-xs text-muted-foreground">
                      {metric.label}
                    </p>
                    <p className="mt-1 text-lg font-semibold tabular-nums">
                      {metric.value}
                    </p>
                    <p
                      className={`mt-0.5 text-xs ${metric.trend.startsWith("+") ? "text-emerald-600" : "text-muted-foreground"}`}
                    >
                      {metric.trend}
                    </p>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className="border-border/50 bg-background text-foreground shadow-xl">
                  <p>{metric.description}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>

        {/* Chart */}
        <ChartContainer config={chartConfig} className="h-32 w-full">
          <BarChart
            data={fakeWeeklyChartData}
            margin={{ left: 0, right: 0, top: 8, bottom: 0 }}
          >
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
            />
            <ChartTooltip
              cursor={{ fill: "var(--color-muted)", opacity: 0.1 }}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value) => (
                    <span className="font-medium tabular-nums">{value} km</span>
                  )}
                />
              }
            />
            <Bar
              dataKey="km"
              fill="var(--color-primary)"
              radius={[4, 4, 0, 0]}
              className="transition-all hover:opacity-80"
            />
          </BarChart>
        </ChartContainer>
      </Card>
    </motion.div>
  );
}

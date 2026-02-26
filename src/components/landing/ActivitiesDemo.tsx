import { motion } from "motion/react";
import { Clock, Heart, Mountain, Route } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Line, LineChart, XAxis, YAxis } from "recharts";
import { fakeActivity, fakeHrZones, fakeSparklineData } from "./fake-data";
import { cn } from "@/lib/utils";

const chartConfig = {
  current: {
    label: "This week",
    color: "var(--color-primary)",
  },
  previous: {
    label: "Last week",
    color: "var(--color-muted-foreground)",
  },
};

export function ActivitiesDemo() {
  return (
    <Card className="overflow-hidden border-primary/10 bg-gradient-to-br from-card via-card to-primary/5 shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-semibold text-primary">{fakeActivity.name}</p>
            <p className="text-sm text-muted-foreground">{fakeActivity.date}</p>
          </div>
          <motion.div
            className="rounded-full bg-primary/10 p-2"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Route className="h-4 w-4 text-primary" />
          </motion.div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: Route, label: "Distance", value: `${fakeActivity.distance} km` },
            { icon: Clock, label: "Duration", value: fakeActivity.duration },
            { icon: Heart, label: "Avg HR", value: `${fakeActivity.hr} bpm` },
            { icon: Mountain, label: "Elevation", value: `${fakeActivity.elevation}m` },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="rounded-lg border border-primary/10 bg-background/50 p-2 text-center transition-all hover:border-primary/20 hover:bg-background"
              whileHover={{ y: -2 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <stat.icon className="mx-auto h-3.5 w-3.5 text-muted-foreground" />
              <p className="mt-1 text-sm font-semibold tabular-nums">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* HR Zones bar */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Heart Rate Zones</p>
          <TooltipProvider delayDuration={100}>
            <div className="flex h-6 overflow-hidden rounded-full">
              {fakeHrZones.map((zone) => (
                <Tooltip key={zone.zone}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "cursor-pointer transition-all hover:brightness-110",
                        zone.color
                      )}
                      style={{ width: `${zone.percent}%` }}
                    />
                  </TooltipTrigger>
                  <TooltipContent className="border-border/50 bg-background text-foreground shadow-xl">
                    <p>
                      <span className="font-medium">{zone.label}</span>
                      <span className="opacity-60"> · </span>
                      <span className="tabular-nums">{zone.percent}%</span>
                    </p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Z1</span>
            <span>Z2</span>
            <span>Z3</span>
            <span>Z4</span>
            <span>Z5</span>
          </div>
        </div>

        {/* Sparkline chart */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Weekly Trend</p>
          <ChartContainer config={chartConfig} className="h-20 w-full">
            <LineChart
              data={fakeSparklineData}
              margin={{ left: 0, right: 0, top: 8, bottom: 0 }}
            >
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
              />
              <YAxis hide domain={[0, "auto"]} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="bg-primary text-primary-foreground border-primary"
                    labelFormatter={(label) => label}
                    formatter={(value) => (
                      <span className="font-medium tabular-nums">{value} km</span>
                    )}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="current"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }}
              />
              <Line
                type="monotone"
                dataKey="previous"
                stroke="var(--color-muted-foreground)"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                activeDot={{ r: 3, strokeWidth: 1 }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

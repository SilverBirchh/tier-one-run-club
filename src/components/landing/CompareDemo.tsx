import { useState } from "react";
import { motion } from "motion/react";
import { Trophy, Zap, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis } from "recharts";
import { fakeCompareActivities, fakeCompareChartData } from "./fake-data";
import { cn } from "@/lib/utils";

const chartConfig = {
  run1: {
    label: "Tempo Run",
    color: "var(--color-primary)",
  },
  run2: {
    label: "Easy Run",
    color: "var(--color-muted-foreground)",
  },
};

export function CompareDemo() {
  const [activeRun, setActiveRun] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {/* Activity cards */}
      <div className="grid grid-cols-2 gap-3">
        {fakeCompareActivities.map((activity, i) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onHoverStart={() => setActiveRun(i)}
            onHoverEnd={() => setActiveRun(null)}
          >
            <Card
              className={cn(
                "cursor-pointer border-primary/10 transition-all",
                activeRun === i && "border-primary/30 shadow-lg"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-primary">{activity.name}</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                  {i === 0 && (
                    <Badge
                      variant="outline"
                      className="border-yellow-500/40 bg-yellow-500/10 text-yellow-600"
                    >
                      <Zap className="mr-1 h-3 w-3" />
                      Faster
                    </Badge>
                  )}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Distance</p>
                    <p className="font-semibold tabular-nums">{activity.distance} km</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Pace</p>
                    <p className="font-semibold tabular-nums">{activity.pace}/km</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Comparison chart */}
      <Card className="overflow-hidden border-primary/10 bg-gradient-to-br from-card via-card to-primary/5 shadow-xl">
        <CardContent className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Pace Comparison</p>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Tempo
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                Easy
              </span>
            </div>
          </div>

          <ChartContainer config={chartConfig} className="h-36 w-full">
            <LineChart
              data={fakeCompareChartData}
              margin={{ left: 0, right: 0, top: 8, bottom: 0 }}
            >
              <XAxis
                dataKey="km"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                tickFormatter={(v) => `${v}km`}
              />
              <YAxis
                hide
                domain={["dataMin - 0.2", "dataMax + 0.2"]}
                reversed
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => `Km ${label}`}
                    formatter={(value) => [`${value}/km`, ""]}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="run1"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="run2"
                stroke="var(--color-muted-foreground)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Leaderboard badges */}
      <motion.div
        className="flex flex-wrap justify-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {[
          { icon: Trophy, label: "Longest", winner: "Tempo Run", color: "text-yellow-500" },
          { icon: Zap, label: "Fastest", winner: "Tempo Run", color: "text-blue-500" },
          { icon: Heart, label: "Lowest HR", winner: "Easy Run", color: "text-rose-500" },
        ].map((badge, i) => (
          <motion.div
            key={badge.label}
            className="flex items-center gap-1.5 rounded-full border border-primary/10 bg-background/50 px-3 py-1.5 text-xs"
            whileHover={{ scale: 1.05, borderColor: "var(--color-primary)" }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.1 }}
          >
            <badge.icon className={cn("h-3.5 w-3.5", badge.color)} />
            <span className="font-medium">{badge.label}:</span>
            <span className="text-muted-foreground">{badge.winner}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

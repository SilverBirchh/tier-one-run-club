import { useState } from "react";
import { motion } from "motion/react";
import { Calendar, Route, Clock, Activity, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { fakeBlock } from "./fake-data";
import { cn } from "@/lib/utils";

export function BlocksDemo() {
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);
  const [hoveredGoal, setHoveredGoal] = useState<string | null>(null);

  const maxVolume = Math.max(...fakeBlock.volumeByWeek.map((w) => w.km));
  const progressPercent = (fakeBlock.elapsedDays / fakeBlock.totalDays) * 100;

  return (
    <Card className="overflow-hidden border-primary/10 bg-gradient-to-br from-card via-card to-primary/5 shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-semibold text-primary">{fakeBlock.name}</p>
            <p className="text-sm text-muted-foreground">{fakeBlock.dateRange}</p>
          </div>
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/40">
            Active
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Calendar progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              Block Progress
            </span>
            <span className="tabular-nums text-muted-foreground">
              {fakeBlock.elapsedDays} of {fakeBlock.totalDays} days
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Started</span>
            <span>{fakeBlock.daysLeft} days left</span>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: Route, label: "Distance", value: `${fakeBlock.stats.distance} km` },
            { icon: Clock, label: "Time", value: fakeBlock.stats.time },
            { icon: TrendingUp, label: "Avg Pace", value: `${fakeBlock.stats.avgPace}/km` },
            { icon: Activity, label: "Sessions", value: fakeBlock.stats.activities },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="rounded-lg border border-primary/10 bg-background/50 p-2 text-center transition-all hover:border-primary/20"
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

        {/* Weekly volume bars */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Weekly Volume</p>
          <div className="flex items-end gap-1.5">
            {fakeBlock.volumeByWeek.map((week, i) => {
              const height = (week.km / maxVolume) * 60;
              const isHovered = hoveredWeek === i;

              return (
                <motion.div
                  key={week.week}
                  className="relative flex-1"
                  onHoverStart={() => setHoveredWeek(i)}
                  onHoverEnd={() => setHoveredWeek(null)}
                >
                  {isHovered && (
                    <motion.div
                      className="absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded bg-popover px-2 py-1 text-xs shadow-lg"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {week.km} km
                    </motion.div>
                  )}
                  <motion.div
                    className={cn(
                      "w-full cursor-pointer rounded-t bg-primary transition-colors",
                      isHovered && "brightness-110"
                    )}
                    style={{ height: `${height}px`, minHeight: "8px" }}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}px` }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    whileHover={{ scaleX: 1.1 }}
                  />
                  <p className="mt-1 text-center text-[10px] text-muted-foreground">
                    W{week.week}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Race goals */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Race Goals</p>
          <div className="space-y-2">
            {fakeBlock.goals.map((goal, i) => {
              const isHovered = hoveredGoal === goal.label;
              const StatusIcon = goal.status === "ahead" ? TrendingUp : goal.status === "behind" ? TrendingDown : Minus;
              const statusColor = goal.status === "ahead" ? "text-emerald-500" : goal.status === "behind" ? "text-rose-500" : "text-muted-foreground";
              const statusText = goal.status === "ahead" ? "Ahead" : goal.status === "behind" ? "Behind" : "On track";

              return (
                <motion.div
                  key={goal.label}
                  className={cn(
                    "flex items-center justify-between rounded-lg border border-primary/10 bg-background/50 p-2.5 transition-all",
                    isHovered && "border-primary/20 shadow-sm"
                  )}
                  onHoverStart={() => setHoveredGoal(goal.label)}
                  onHoverEnd={() => setHoveredGoal(null)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div className="flex items-center gap-2">
                    <span className={cn("flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold text-white", goal.color)}>
                      {goal.label}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{goal.distance}</p>
                      <p className="text-[10px] text-muted-foreground">Target: {goal.targetTime}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <StatusIcon className={cn("h-3 w-3", statusColor)} />
                      <span className={cn("text-xs font-medium", statusColor)}>{statusText}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Need {goal.requiredPace}/km
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

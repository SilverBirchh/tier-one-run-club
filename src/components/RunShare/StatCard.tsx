import {
  MapPin,
  Calendar,
  Trophy,
  Navigation,
  Timer,
  TrendingUp,
  Wind,
  Flame,
} from "lucide-react";
import { formatPace, getActivityStats } from "./utils";
import { forwardRef } from "react";
import type { ParsedGPX } from "@we-gold/gpxjs";
import { StatBox } from "./StatBox";
import { RouteVisualization } from "./RouteVisualization";

type StatCard = {
  gpx: ParsedGPX;
  backgroundColor?: string;
  accentColor?: string;
};

const BACKGROUND_COLOR = "bg-gradient-to-br from-blue-600 to-blue-800";
const ACCENT_COLOR = "text-blue-200";

export const StatCard = forwardRef<HTMLDivElement, StatCard>(
  (
    { gpx, backgroundColor = BACKGROUND_COLOR, accentColor = ACCENT_COLOR },
    ref
  ) => {
    const stats = getActivityStats(gpx);
    const date = gpx.metadata.time ? new Date(gpx.metadata.time) : new Date();
    return (
      <div
        ref={ref}
        className={`max-w-[600px] max-h-[600px] ${backgroundColor} p-8 flex flex-col`}
      >
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {gpx.metadata.name || "Morning Run"}
            </h1>
            <div className="flex items-center text-white/70 text-sm mb-1">
              <Calendar className="w-4 h-4 mr-2" />
              {date.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="flex items-center text-white/70 text-sm">
              <MapPin className="w-4 h-4 mr-2" />
              {gpx.metadata.description || "Running Route"}
            </div>
          </div>
          <Trophy className="w-12 h-12 text-yellow-300" />
        </div>
        <RouteVisualization gpx={gpx} />
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatBox
            icon={Navigation}
            label="DISTANCE"
            accentColor={accentColor}
            value={`${stats.distance.km.toFixed(2)} km`}
          />
          <StatBox
            icon={Timer}
            label="MOVING TIME"
            accentColor={accentColor}
            value={`${stats.moving.hours ? `${stats.moving.hours}h ` : ""}${stats.moving.minutes}m`}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <StatBox
            icon={Wind}
            label="AVG PACE"
            value={formatPace(stats.movingPace.perKm)}
            accentColor={accentColor}
          />
          <StatBox
            icon={TrendingUp}
            label="ELEVATION GAIN"
            value={`${gpx.tracks[0].elevation.positive?.toFixed(0) || 0}m`}
            accentColor={accentColor}
          />
          <StatBox
            icon={Flame}
            accentColor={accentColor}
            label="CALORIES"
            value={stats.calories.toString() || "---"}
          />
        </div>
      </div>
    );
  }
);

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
import type { Colour } from "./types";
type StatCard = {
  gpx: ParsedGPX;
  colour?: Colour;
};

const DEFAULT_COLOUR: Colour = {
  name: "Default Blue",
  className: "bg-gradient-to-br from-blue-600 to-blue-800",
  accent: "text-blue-200",
};

export const StatCard = forwardRef<HTMLDivElement, StatCard>(
  ({ gpx, colour = DEFAULT_COLOUR }, ref) => {
    const stats = getActivityStats(gpx);
    const date = gpx.metadata.time ? new Date(gpx.metadata.time) : new Date();

    const backgroundStyle = 'style' in colour ? { background: colour.style } : undefined;
    const backgroundClass = 'className' in colour ? colour.className : '';

    const trophyStyle = 'style' in colour ? { color: colour.accent } : undefined;
    const trophyClass = 'className' in colour ? colour.accent : '';

    return (
      <div
        ref={ref}
        className={`max-w-[600px] rounded-md  max-h-[600px] p-8 flex flex-col ${backgroundClass}`}
        style={backgroundStyle}
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
          <Trophy 
            className={`w-12 h-12 ${trophyClass}`}
            style={trophyStyle}
          />
        </div>
        <RouteVisualization gpx={gpx} />
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatBox
            icon={Navigation}
            label="DISTANCE"
            accentColor={colour}
            value={`${stats.distance.km.toFixed(2)} km`}
          />
          <StatBox
            icon={Timer}
            label="MOVING TIME"
            accentColor={colour}
            value={`${stats.moving.hours ? `${stats.moving.hours}h ` : ""}${
              stats.moving.minutes
            }m`}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <StatBox
            icon={Wind}
            label="AVG PACE"
            value={formatPace(stats.movingPace.perKm)}
            accentColor={colour}
          />
          <StatBox
            icon={TrendingUp}
            label="ELEVATION GAIN"
            value={`${gpx.tracks[0].elevation.positive?.toFixed(0) || 0}m`}
            accentColor={colour}
          />
          <StatBox
            icon={Flame}
            accentColor={colour}
            label="CALORIES"
            value={stats.calories.toString() || "---"}
          />
        </div>
      </div>
    );
  }
);

StatCard.displayName = "StatCard";
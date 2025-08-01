// @ts-nocheck

export const formatMonth = (m: string) => {
  const [mon, year] = m.split("-");
  return `${mon} ${year}`;
};

export const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  return [
    h > 0 ? String(h).padStart(2, "0") : null,
    String(m).padStart(2, "0"),
    String(s).padStart(2, "0"),
  ]
    .filter(Boolean)
    .join(":");
};

export function formatLap(lap: any, index: number): string {
  const strideLength = lap.strideLength
    ? `${Math.round(lap.strideLength)}cm`
    : "—";
  const verticalOscillation = lap.verticalOscillation
    ? `${lap.verticalOscillation.toFixed(1)}cm`
    : "—";
  const verticalRatio = lap.verticalRatio
    ? `${lap.verticalRatio.toFixed(1)}%`
    : "—";

  return [
    `Lap ${index + 1}: ${Math.round(lap.distance)}m — ${formatDuration(lap.duration)}`,
    `  HR: ${lap.averageHR ?? "—"} avg / ${lap.maxHR ?? "—"} max — Power: ${lap.averagePower ?? "—"}W avg / ${lap.maxPower ?? "—"} max / ${lap.normalizedPower ?? "—"} NP`,
    `  Cadence: ${Math.round(lap.averageRunCadence ?? 0)} avg / ${lap.maxRunCadence ?? "—"} max — GCT: ${Math.round(lap.groundContactTime ?? 0)}ms`,
    `  Elevation: +${lap.elevationGain ?? 0}m / -${lap.elevationLoss ?? 0}m — Stride: ${strideLength} — VO: ${verticalOscillation} (${verticalRatio})`,
  ].join("\n");
}

export function formatEnrichedActivity(activity: any): string {
  const { activityName, startTimeLocal, distance, duration, enriched } =
    activity;

  const laps = enriched?.splits?.lapDTOs ?? [];
  const weather = enriched?.weather;
  const hrZones = enriched?.hrZones ?? [];
  const powerZones = enriched?.powerZones ?? [];

  const hrZ4Plus = hrZones
    .filter((z: any) => z.zoneNumber >= 4)
    .reduce((acc, z) => acc + z.secsInZone, 0);

  const powerZ4Plus = powerZones
    .filter((z: any) => z.zoneNumber >= 4)
    .reduce((acc, z) => acc + z.secsInZone, 0);

  const splitsHeader =
    "(Each lap shows: time, HR, power, cadence, ground time, stride, vertical motion)";
  const formattedLaps = [splitsHeader, ...laps.map(formatLap)].join("\n\n");

  return `
🏃 ${activityName} — ${startTimeLocal}
- Distance: ${(distance / 1000).toFixed(2)}km, Duration: ${formatDuration(duration)}
- Time in HR Z4+: ${(hrZ4Plus / 60).toFixed(1)} min, Power Z4+: ${(powerZ4Plus / 60).toFixed(1)} min
- Weather: ${weather?.desc ?? "N/A"}, ${weather?.temp ?? "?"}°F, Wind: ${weather?.windSpeed ?? "?"} km/h ${weather?.windDirectionCompassPoint ?? ""}
- Splits:
${formattedLaps}
  `.trim();
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function formatPace(pacePerKm: number): string {
  if (!isFinite(pacePerKm)) return "—";
  const mins = Math.floor(pacePerKm);
  const secs = Math.round((pacePerKm - mins) * 60);
  return `${mins}:${secs.toString().padStart(2, "0")}/km`;
}

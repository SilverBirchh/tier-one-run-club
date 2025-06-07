// @ts-nocheck

import { defineAction } from "astro:actions";
import {
  getTokens,
  fetchPublicProfile,
  fetchLifetimeStats,
  fetchMonthlyRunningStats,
  buildRunningPBs,
  fetchPersonalBests,
  fetchPersonalBestTypes,
  fetchActivities,
  enrichActivity,
} from "./garmin/garmin";
import { z } from "astro:schema";
import ts from "typescript";

const formatMonth = (m: string) => {
  const [mon, year] = m.split("-");
  return `${mon} ${year}`;
};

const formatTime = (seconds: number) => {
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

function formatLap(lap: any, index: number): string {
  const pace = lap.averageSpeed > 0 ? 1000 / lap.averageSpeed : 0;

  return `${index + 1}. ${Math.round(lap.distance)}m — ${formatDuration(lap.duration)} — ${formatPace(pace)} — ${lap.averageHR ?? "—"}bpm — ${lap.averagePower ?? "—"}W — ${Math.round(lap.averageRunCadence ?? 0)} — ${Math.round(lap.groundContactTime ?? 0)}ms — +${lap.elevationGain ?? 0}m`;
}

function formatEnrichedActivity(activity: any): string {
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

  const formattedLaps = laps.map(formatLap).join("\n");

  return `
🏃 ${activityName} — ${startTimeLocal}
- Distance: ${(distance / 1000).toFixed(2)}km, Duration: ${formatDuration(duration)}
- Time in HR Z4+: ${(hrZ4Plus / 60).toFixed(1)} min, Power Z4+: ${(powerZ4Plus / 60).toFixed(1)} min
- Weather: ${weather?.desc ?? "N/A"}, ${weather?.temp ?? "?"}°F, Wind: ${weather?.windSpeed ?? "?"} km/h ${weather?.windDirectionCompassPoint ?? ""}
- Splits:
${formattedLaps}
  `.trim();
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatPace(pacePerKm: number): string {
  if (!isFinite(pacePerKm)) return "—";
  const mins = Math.floor(pacePerKm);
  const secs = Math.round((pacePerKm - mins) * 60);
  return `${mins}:${secs.toString().padStart(2, "0")}/km`;
}

export const server = {
  garmin: defineAction({
    schema: z.object({
      id: z.string(),
      raceName: z.string().min(1),
      context: z.string().optional(),
      trainingPlan: z.string().optional(),
      distance: z.number().positive(),
      raceDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
      }),
      goalTime: z
        .string()
        .regex(/^\d{1,2}:\d{2}:\d{2}$/, "Expected format HH:MM:SS"),
    }),
    handler: async ({ id, raceName, raceDate, goalTime, distance, context, trainingPlan }) => {
      try {
        const token = await getTokens();
        const profile = await fetchPublicProfile(token, id);
        const lifetimeStats = await fetchLifetimeStats(token, id);
        const monthlyRunningStats = await fetchMonthlyRunningStats(token, id);
        const monthlyBreakdown = monthlyRunningStats
          .slice()
          .sort(
            (a, b) =>
              new Date(`01-${b.month}` as string).getTime() -
              new Date(`01-${a.month}` as string).getTime()
          )
          .map(
            (m) =>
              `- ${formatMonth(m.month)}: ${m.totalDistance.toLocaleString()} m over ${m.totalActivities} run${m.totalActivities !== 1 ? "s" : ""} — ` +
              `${m.totalCalories.toLocaleString()} kcal, ${m.totalElevationGain.toLocaleString()} m climb`
          )
          .join("\n");

        const prTypes = await fetchPersonalBestTypes(token, id);
        const prRecords = await fetchPersonalBests(token, id);
        const runningPBs = buildRunningPBs(prTypes, prRecords);
        const pbSummary = runningPBs
          .map(
            (pb) =>
              `- ${pb.label.toUpperCase()}: ${formatTime(pb.value)} (${pb.activityName}, ${pb.date.slice(0, 10)})`
          )
          .join("\n");

        const recentActivities = await fetchActivities(token, id, 0, 30);

        const enriched = await Promise.all(
          recentActivities.activityList.map((activity) =>
            enrichActivity(token, activity)
          )
        );

        const fullSummary = enriched
          .map((activity) => formatEnrichedActivity(activity))
          .join("\n\n");

        const today = new Date();
        const race = new Date(raceDate);
        const msDiff = race.getTime() - today.getTime();
        const daysDiff = Math.round(msDiff / (1000 * 60 * 60 * 24));

        const raceTimingNote =
          daysDiff > 0
            ? `The race is in ${daysDiff} day${daysDiff !== 1 ? "s" : ""}.`
            : daysDiff === 0
              ? `The race is today.`
              : `The race was ${Math.abs(daysDiff)} day${Math.abs(daysDiff) !== 1 ? "s" : ""} ago.`;


        return `
My name is ${profile.fullName} from ${profile.location}.
You are an elite trainer and coach with expertise in running and endurance sports.
I'm targeting a time of ${goalTime} for the ${raceName}, which is ${distance}km, on ${raceDate}.
${raceTimingNote}

Lifetime Stats:
- ${lifetimeStats.totalDistanceKm.toFixed(1)} km run
- ${lifetimeStats.totalSteps.toLocaleString()} steps
- ${lifetimeStats.totalCalories.toLocaleString()} kcal burned
- ${lifetimeStats.totalActiveDays} active days

Running Personal Bests:
${pbSummary}

Monthly Running Breakdown:
${monthlyBreakdown}

Recent Key Activities:
${fullSummary}

${context ? `Context: ${context}` : ""}
${trainingPlan ? `Training Plan: ${trainingPlan}` : ""}

---

🔍 Please analyze the data and provide an evidence-based evaluation of my readiness for this ${distance}km goal race:

1. **How does my recent training compare to what's required to hit ${goalTime} over ${distance}km?**
2. **What strengths stand out in my training data?** (e.g., endurance, speed, consistency, power)
3. **Where are my weaknesses or underdeveloped areas?** Please reference specific activities or stats where relevant.
4. **What can you infer about my aerobic/anaerobic conditioning based on heart rate and power zone data?**
5. **Have I spent enough time training at paces or intensities that reflect my target pace?**
6. **Are there signs of overtraining, poor recovery, or missing training types (e.g., tempo, VO₂max, race pace)?**
7. **What are the most valuable training adjustments I could make in the remaining time to improve my odds of hitting my goal?**

Please base your advice on my current training volume, distribution, and race timeline. Be honest but constructive. Prioritize suggestions that are specific and high-impact for this distance and goal.
`;
      } catch (err) {
        console.error("Garmin API error:", err);
        return { error: "Failed to fetch Garmin data" };
      }
    },
  }),
};

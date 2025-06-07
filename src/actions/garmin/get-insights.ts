
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
} from "./garmin";
import { z } from "astro:schema";
import { formatMonth, formatTime, formatEnrichedActivity } from "./helpers";

export const insights = defineAction({
  schema: z.object({
    id: z.string(),
    context: z.string().optional(),
  }),
  handler: async ({ id, context }) => {
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

      return `
My name is ${profile.fullName} from ${profile.location}.
You are an elite trainer and coach with expertise in running and endurance sports.

Please review my Garmin data and training history, and provide a comprehensive performance analysis.

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

---

🔍 Based on the training data above, please provide a detailed analysis:

1. **What are the most notable strengths in my training?**
2. **Are there any weaknesses, gaps, or inconsistencies?** Please reference specific stats or activities.
3. **What does my heart rate and power zone distribution suggest about my aerobic and anaerobic conditioning?**
4. **How has my training volume and intensity evolved recently?**
5. **Are there trends suggesting overtraining, stagnation, or strong progression?**
6. **What types of sessions am I missing that could help balance my development?** (e.g., tempo, threshold, recovery)
7. **How does my training compare to general principles of effective endurance training?**
8. **Based on this history, what types of races (distance/intensity) might suit me best right now?**

Please base your analysis on observable patterns in training, physiological indicators, and overall balance. Offer specific, actionable feedback for optimizing future training or planning goals.
`;
    } catch (err) {
      console.error("Garmin API error:", err);
      return { error: "Failed to fetch Garmin data" };
    }
  },
});

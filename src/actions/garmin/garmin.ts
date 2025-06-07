// @ts-nocheck
import { GARMIN_BASE_URL } from "./constants";

export const garminFetch = async (accessToken: string, url: string) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "DI-Backend": "connectapi.garmin.com",
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching Garmin data from ${url}: ${response.status}`);
  }

  return response.json();
};

export const getTokens = async (): Promise<string> => {
  const response = await fetch(`${GARMIN_BASE_URL}/services/auth/token/public`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Error fetching tokens: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
};

export const fetchPublicProfile = async (accessToken: string, userId: string) => {
  const url = `${GARMIN_BASE_URL}/userprofile-service/socialProfile/public/${userId}`;
  const data = await garminFetch(accessToken, url);

  return {
    fullName: data.fullName,
    location: data.location,
    profileImageUrl: data.profileImageUrlMedium,
  };
};

export const fetchLifetimeStats = async (accessToken: string, userId: string) => {
  const url = `${GARMIN_BASE_URL}/usersummary-service/stats/connectLifetimeTotals/${userId}`;
  const data = await garminFetch(accessToken, url);

  return {
    totalDistanceKm: data.totalDistance / 1000, // Convert meters to km
    totalSteps: data.totalSteps,
    totalCalories: data.totalCalories,
    totalActiveDays: data.totalActiveDays,
    totalStepCalories: data.totalStepCalories,
  };
};

export const fetchMonthlyRunningStats = async (accessToken: string, userId: string) => {
  const url = `${GARMIN_BASE_URL}/userstats-service/statistics/monthly/${userId}?ByParentType=true`;
  const data = await garminFetch(accessToken, url);

  const runningStats = data.userMetrics
    .filter((m: any) => m.activityType?.typeKey === "running")
    .map((m: any) => ({
      month: m.month, // e.g., "MAY-2025"
      totalActivities: m.totalActivities,
      totalDistance: Math.round(m.totalDistance), // leave in meters
      totalDuration: Math.round(m.totalDuration), // seconds
      totalCalories: Math.round(m.totalCalories),
      totalElevationGain: Math.round(m.totalElevationGain),
    }));

  return runningStats;
};

export const fetchPersonalBestTypes = async (accessToken: string, userId: string) => {
  const url = `${GARMIN_BASE_URL}/personalrecord-service/personalrecordtype/prtypes/${userId}`;
  return await garminFetch(accessToken, url);
};

export const fetchPersonalBests = async (accessToken: string, userId: string) => {
  const url = `${GARMIN_BASE_URL}/personalrecord-service/personalrecord/prs/${userId}`;
  return await garminFetch(accessToken, url);
};

export const buildRunningPBs = (types: any[], records: any[]) => {
  const timePBs = records
    .map((record) => {
      const type = types.find((t) => t.id === record.typeId && t.sport === "RUNNING" && t.visible);
      if (!type) return null;

      return {
        label: type.key.replace("pr.label.", "").replace(".run", "").replace(".", " "),
        value: record.value, // seconds
        date: record.actStartDateTimeInGMTFormatted,
        activityName: record.activityName,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.value - b.value);

  return timePBs;
};


export const fetchActivities = async (accessToken: string, userId: string, start: number, limit: number) => {
  const url = `${GARMIN_BASE_URL}/activitylist-service/activities/${userId}?start=${start}&limit=${limit}`;
  return await garminFetch(accessToken, url);
};


export const fetchSplitSummaries = async (accessToken: string, activityId: string) => {
  const url = `${GARMIN_BASE_URL}/activity-service/activity/${activityId}/split_summaries`;
  return await garminFetch(accessToken, url);
};

export const fetchHeartRateZones = async (accessToken: string, activityId: string) => {
  const url = `${GARMIN_BASE_URL}/activity-service/activity/${activityId}/hrTimeInZones`;
  return await garminFetch(accessToken, url);
};

export const fetchPowerZones = async (accessToken: string, activityId: string) => {
  const url = `${GARMIN_BASE_URL}/activity-service/activity/${activityId}/powerTimeInZones`;
  return await garminFetch(accessToken, url);
};

export const fetchWeather = async (accessToken: string, activityId: string) => {
  const url = `${GARMIN_BASE_URL}/activity-service/activity/${activityId}/weather`;
  return await garminFetch(accessToken, url);
};

export const fetchSplits = async (accessToken: string, activityId: string) => {
  const url = `${GARMIN_BASE_URL}/activity-service/activity/${activityId}/splits`;
  return await garminFetch(accessToken, url);
};

export const enrichActivity = async (token: string, activity: any) => {
  const activityId = activity.activityId.toString();

  const [splits, splitSummaries, hrZones, powerZones, weather] = await Promise.all([
    fetchSplits(token, activityId),
    fetchSplitSummaries(token, activityId),
    fetchHeartRateZones(token, activityId),
    fetchPowerZones(token, activityId),
    fetchWeather(token, activityId),
  ]);

  return {
    ...activity,
    enriched: {
      splits,
      splitSummaries,
      hrZones,
      powerZones,
      weather,
    },
  };
};

import type { ParsedGPX } from "@we-gold/gpxjs";
import type { TimeAndPace, PaceUnit } from "./types";

function calculateTotalTime(gpx: ParsedGPX) {
  if (gpx.tracks.length === 0) {
    throw new Error("No tracks found in GPX file");
  }

  const track = gpx.tracks[0]; // Get first track
  const points = track.points;

  if (points.length < 2) {
    throw new Error("Track must have at least 2 points to calculate time");
  }

  const startTime = points[0].time;
  const endTime = points[points.length - 1].time;

  if (!startTime || !endTime) {
    throw new Error("Track points missing timestamp data");
  }

  const totalTimeMs = endTime.getTime() - startTime.getTime();

  const hours = Math.floor(totalTimeMs / (1000 * 60 * 60));
  const minutes = Math.floor((totalTimeMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((totalTimeMs % (1000 * 60)) / 1000);

  return {
    hours,
    minutes,
    seconds,
    totalMs: totalTimeMs,
  };
}

function calculateMovingTime(gpx: ParsedGPX, speedThreshold: number = 0.3) {
  if (gpx.tracks.length === 0) {
    throw new Error("No tracks found in GPX file");
  }

  const track = gpx.tracks[0];
  const points = track.points;

  if (points.length < 2) {
    throw new Error("Track must have at least 2 points to calculate time");
  }

  let movingTimeMs = 0;

  for (let i = 0; i < points.length - 1; i++) {
    const currentPoint = points[i];
    const nextPoint = points[i + 1];

    if (!currentPoint.time || !nextPoint.time) {
      continue; // Skip points without timestamps
    }

    // Get time difference between points
    const timeDiff = nextPoint.time.getTime() - currentPoint.time.getTime();

    // Calculate speed between points using the cumulative distance array
    // track.distance.cumulative gives us the distance at each point
    const distance =
      track.distance.cumulative[i + 1] - track.distance.cumulative[i];
    const speed = distance / (timeDiff / 1000); // Convert to m/s

    // If speed is above threshold, add the time difference to moving time
    if (speed > speedThreshold) {
      movingTimeMs += timeDiff;
    }
  }

  const hours = Math.floor(movingTimeMs / (1000 * 60 * 60));
  const minutes = Math.floor((movingTimeMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((movingTimeMs % (1000 * 60)) / 1000);

  return {
    hours,
    minutes,
    seconds,
    totalMs: movingTimeMs,
  };
}

// Helper function to get both total and moving time
export function getActivityTimes(gpx: ParsedGPX) {
  const totalTime = calculateTotalTime(gpx);
  const movingTime = calculateMovingTime(gpx);

  return {
    total: totalTime,
    moving: movingTime,
    stopped: {
      totalMs: totalTime.totalMs - movingTime.totalMs,
      hours: Math.floor(
        (totalTime.totalMs - movingTime.totalMs) / (1000 * 60 * 60)
      ),
      minutes: Math.floor(
        ((totalTime.totalMs - movingTime.totalMs) % (1000 * 60 * 60)) /
          (1000 * 60)
      ),
      seconds: Math.floor(
        ((totalTime.totalMs - movingTime.totalMs) % (1000 * 60)) / 1000
      ),
    },
  };
}

function getDistanceAndPace(gpx: ParsedGPX): TimeAndPace {
  const track = gpx.tracks[0];

  // Get total distance in meters from GPX data
  const distanceMeters = track.distance.total;

  // Convert to km and miles
  const distanceKm = distanceMeters / 1000;
  const distanceMiles = distanceKm * 0.621371;

  // Get total and moving time
  const totalTimeMs = calculateTotalTime(gpx).totalMs;
  const movingTimeMs = calculateMovingTime(gpx).totalMs;

  // Calculate paces
  const calcPace = (timeMs: number, distance: number) => {
    const timeMinutes = timeMs / (1000 * 60);
    const paceMinutes = timeMinutes / distance;
    return {
      minutes: Math.floor(paceMinutes),
      seconds: Math.round((paceMinutes % 1) * 60),
      raw: paceMinutes,
    };
  };

  // Calculate average pace (using total time)
  const avgPacePerKm = calcPace(totalTimeMs, distanceKm);
  const avgPacePerMile = calcPace(totalTimeMs, distanceMiles);

  // Calculate moving pace (using moving time)
  const movingPacePerKm = calcPace(movingTimeMs, distanceKm);
  const movingPacePerMile = calcPace(movingTimeMs, distanceMiles);

  return {
    distance: {
      km: Math.round(distanceKm * 100) / 100, // Round to 2 decimal places
      miles: Math.round(distanceMiles * 100) / 100,
    },
    avgPace: {
      perKm: avgPacePerKm,
      perMile: avgPacePerMile,
    },
    movingPace: {
      perKm: movingPacePerKm,
      perMile: movingPacePerMile,
    },
  };
}

// Helper function to format pace nicely
export function formatPace(
  pace: { minutes: number; seconds: number },
  unit: PaceUnit = "km"
) {
  return `${pace.minutes}:${pace.seconds.toString().padStart(2, "0")}/${unit}`;
}

// Combine all our activity stats
export function getActivityStats(gpx: ParsedGPX) {
  const times = getActivityTimes(gpx);
  const distanceAndPace = getDistanceAndPace(gpx);

  return {
    ...times,
    ...distanceAndPace,
    calories: calculateCalories(gpx.tracks)
  };
}

export function calculateCalories(segments: ParsedGPX["tracks"], weightKg = 70) {
  const MET_TO_CALORIES = 0.0175;
  const INCLINE_FACTOR = 0.073;
  
  let totalDistance = 0;
  let totalTime = 0;
  let totalElevationGain = 0;

  segments.forEach(segment => {
    const points = segment.points;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      
      if (!prev.time || !curr.time) continue;

      totalTime += (curr.time.getTime() - prev.time.getTime()) / 1000;
      totalDistance += segment.distance.cumulative[i] - segment.distance.cumulative[i-1];

      if (prev.elevation !== null && curr.elevation !== null) {
        const elevationDiff = curr.elevation - prev.elevation;
        if (elevationDiff > 0) totalElevationGain += elevationDiff;
      }
    }
  });

  const avgSpeed = (totalDistance / 1000) / (totalTime / 3600);
  
  // Base MET value based on speed
  let baseMET;
  if (avgSpeed < 4) baseMET = 2.5;
  else if (avgSpeed < 6) baseMET = 3.5;
  else if (avgSpeed < 8) baseMET = 4.3;
  else if (avgSpeed < 12) baseMET = 6.0;
  else if (avgSpeed < 16) baseMET = 9.0;
  else baseMET = 11.0;

  const averageGrade = totalDistance > 0 ? (totalElevationGain / totalDistance) * 100 : 0;
  const adjustedMET = baseMET * (1 + (averageGrade * INCLINE_FACTOR));

  return Math.round(adjustedMET * MET_TO_CALORIES * weightKg * (totalTime / 60));
}

export const formatTime = ({
  hours,
  minutes,
  seconds,
}: {
  hours: number;
  minutes: number;
  seconds: number;
}) => {
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  return `${minutes}m ${seconds}s`;
};


export const exportAsImage = async (elem?: HTMLElement | null) => {
  if (elem) {
    // Dynamically import html2canvas only on client side
    const html2canvas = (await import('html2canvas-pro')).default;
    
    if (elem) {
      const canvas = await html2canvas(elem);
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'card-export.png';
      link.click();
    }
  }
};
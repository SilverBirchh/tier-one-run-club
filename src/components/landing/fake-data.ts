// Fake data for landing page demos

export const fakeSparklineData = [
  { day: "Mon", current: 5.2, previous: 4.8 },
  { day: "Tue", current: 0, previous: 6.1 },
  { day: "Wed", current: 8.5, previous: 0 },
  { day: "Thu", current: 6.2, previous: 5.5 },
  { day: "Fri", current: 0, previous: 7.2 },
  { day: "Sat", current: 12.1, previous: 10.5 },
  { day: "Sun", current: 15.3, previous: 14.2 },
];

export const fakeActivity = {
  name: "Morning Run",
  date: "Today, 6:45 AM",
  distance: 8.5,
  duration: "42:15",
  pace: "4:58",
  hr: 152,
  elevation: 85,
  calories: 620,
};

export const fakeHrZones = [
  { zone: 1, label: "Recovery", percent: 8, color: "bg-blue-400" },
  { zone: 2, label: "Easy", percent: 22, color: "bg-green-400" },
  { zone: 3, label: "Aerobic", percent: 45, color: "bg-yellow-400" },
  { zone: 4, label: "Threshold", percent: 20, color: "bg-orange-400" },
  { zone: 5, label: "Max", percent: 5, color: "bg-red-400" },
];

export const fakeBlock = {
  name: "Marathon Prep",
  dateRange: "Nov 4 - Dec 29",
  totalDays: 56,
  elapsedDays: 38,
  daysLeft: 18,
  stats: {
    distance: 312,
    time: "26h 45m",
    avgPace: "5:08",
    activities: 42,
  },
  volumeByWeek: [
    { week: 1, km: 45 },
    { week: 2, km: 52 },
    { week: 3, km: 58 },
    { week: 4, km: 48 },
    { week: 5, km: 62 },
    { week: 6, km: 47 },
  ],
  goals: [
    { label: "A", color: "bg-emerald-500", race: "Marathon", distance: "42.2 km", targetTime: "3:15:00", requiredPace: "4:37", avgPace: "5:08", status: "behind" },
    { label: "B", color: "bg-blue-500", race: "Marathon", distance: "42.2 km", targetTime: "3:30:00", requiredPace: "4:58", avgPace: "5:08", status: "behind" },
    { label: "C", color: "bg-amber-500", race: "Marathon", distance: "42.2 km", targetTime: "3:45:00", requiredPace: "5:19", avgPace: "5:08", status: "ahead" },
  ],
};

export const fakeCompareActivities = [
  {
    id: 1,
    name: "Tempo Run",
    date: "Dec 15",
    distance: 10.2,
    duration: "48:30",
    pace: "4:45",
    hr: 165,
    elevation: 95,
  },
  {
    id: 2,
    name: "Easy Run",
    date: "Dec 12",
    distance: 8.1,
    duration: "42:15",
    pace: "5:13",
    hr: 142,
    elevation: 62,
  },
];

export const fakeCompareChartData = [
  { km: 1, run1: 4.52, run2: 5.15 },
  { km: 2, run1: 4.48, run2: 5.18 },
  { km: 3, run1: 4.45, run2: 5.12 },
  { km: 4, run1: 4.42, run2: 5.08 },
  { km: 5, run1: 4.38, run2: 5.15 },
  { km: 6, run1: 4.45, run2: 5.22 },
  { km: 7, run1: 4.48, run2: 5.18 },
  { km: 8, run1: 4.52, run2: 5.10 },
];

export const fakeCoachMessages = [
  {
    role: "user" as const,
    content: "How was my tempo run today?",
  },
  {
    role: "assistant" as const,
    content:
      "Great session! You held 4:45/km consistently with a negative split in the last 2km. Your HR stayed in zone 4 which is ideal for tempo work. Consider extending to 12km next week.",
  },
];

export const fakeDashboardMetrics = [
  { label: "Distance", value: "47.3 km", trend: "+12%", description: "Total distance this week vs last week" },
  { label: "Duration", value: "4h 15m", trend: "+8%", description: "Total moving time across all runs" },
  { label: "Activities", value: "5 runs", trend: "same", description: "Number of runs logged this week" },
];

export const fakeWeeklyChartData = [
  { day: "M", km: 5.2 },
  { day: "T", km: 0 },
  { day: "W", km: 8.5 },
  { day: "T", km: 6.2 },
  { day: "F", km: 0 },
  { day: "S", km: 12.1 },
  { day: "S", km: 15.3 },
];

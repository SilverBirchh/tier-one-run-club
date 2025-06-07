import { insights } from "./garmin/get-insights";
import { reviewRaceGoal } from "./garmin/review-goal";


export const server = {
  garmin: {
    reviewRaceGoal,
    insights
  },
};

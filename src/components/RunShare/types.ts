export type PaceUnit = 'km' | 'mile';
export type TimeAndPace = {
  distance: {
    km: number;
    miles: number;
  };
  avgPace: {
    perKm: {
      minutes: number;
      seconds: number;
      raw: number; // minutes as decimal
    };
    perMile: {
      minutes: number;
      seconds: number;
      raw: number; // minutes as decimal
    };
  };
  movingPace: {
    perKm: {
      minutes: number;
      seconds: number;
      raw: number;
    };
    perMile: {
      minutes: number;
      seconds: number;
      raw: number;
    };
  };
};
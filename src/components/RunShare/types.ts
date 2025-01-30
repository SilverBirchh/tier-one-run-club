export type PaceUnit = "km" | "mile";
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
export type Colour =
  | {
      name: string;
      className: string;
      accent: string;
    }
  | {
      name: string;
      style: string;
      accent: string;
    };

export type TextData = {
  title: string
  description?: string
  date?: string
  instructions?: string
}

export interface Sticker {
  id: string;
  icon: React.ReactNode;
  position: {
    x: number;
    y: number;
  };
  rotation: number;
  scale: number;
}
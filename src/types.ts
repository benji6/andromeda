import { SCALES } from "./constants";

export interface Note {
  id: string;
  gain: number;
  frequency: number;
}

export type ScaleName = keyof typeof SCALES;

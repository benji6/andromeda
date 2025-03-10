import { INSTRUMENTS, SCALES } from "./constants";

export type Instrument = (typeof INSTRUMENTS)[number];

export interface Note {
  id: string;
  gain: number;
  frequency: number;
}

export type ScaleName = keyof typeof SCALES;

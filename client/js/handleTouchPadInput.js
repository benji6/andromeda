import {playNote, stopNote} from './noteController';
import {major} from './scales';
const {floor} = Math;

const calculatePitch = (xRatio) => major[floor(major.length * xRatio)];

export const inputXY = (xRatio, yRatio) => playNote(calculatePitch(xRatio), yRatio);

export const inputStop = () => stopNote();

import {assoc, compose, isNil} from 'ramda';
import {playNote, stopNote} from './noteController';
import store from './store';

const {floor} = Math;
const getState = ::store.getState;

let currentlyPlayingPitch = null;
let stopLastNoteOnNoteChange = true;

const calculatePitch = xRatio => {
  const {scaleName, scales} = getState().scale;
  const scale = scales[scaleName];
  if (isNil(scale)) {
    stopLastNoteOnNoteChange = false;
    return xRatio * 12;
  }
  const {length} = scale.toArray();
  stopLastNoteOnNoteChange = true;
  const i = floor((length + 1) * xRatio);
  return i < length ? scale(i) : scale(i) + 12;
};

const calculatePitchAndMod = ({xRatio, yRatio}) => ({pitch: calculatePitch(xRatio), modulation: yRatio});
const getNoteFromXYRatios = compose(assoc('id', 'controlPad'), calculatePitchAndMod);

export const handleControlPadInput = xYRatios => {
  const note = getNoteFromXYRatios(xYRatios);
  const {id, pitch} = note;
  if (currentlyPlayingPitch !== pitch && currentlyPlayingPitch !== null && stopLastNoteOnNoteChange) {
    stopNote({id});
  }
  currentlyPlayingPitch = pitch;
  playNote(note);
};

export const handleControlPadInputEnd = xYRatios => {
  currentlyPlayingPitch = null;
  stopNote(getNoteFromXYRatios(xYRatios));
};

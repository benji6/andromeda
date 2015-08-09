/* global R */
import alt from './alt';
import {playNote, stopNote} from './noteController';
const {assoc, compose, isNil} = R;
const {floor} = Math;

let currentlyPlayingPitch = null;
let stopLastNoteOnNoteChange = true;

const calculatePitch = (xRatio) => {
  const scaleStoreState = alt.getStore('ScaleStore').getState();
  const {scaleName, scales} = scaleStoreState;
  const scale = scales[scaleName];
  if (isNil(scale)) {
    stopLastNoteOnNoteChange = false;
    return xRatio * 12;
  }
  stopLastNoteOnNoteChange = true;
  return scale[floor(scale.length * xRatio)];
};

const calculatePitchAndMod = ({xRatio, yRatio}) => ({pitch: calculatePitch(xRatio), modulation: yRatio});
const getNoteFromXYRatios = compose(assoc('id', 'controlPad'), calculatePitchAndMod);

export const handleControlPadInput = (xYRatios) => {
  const note = getNoteFromXYRatios(xYRatios);
  const {id, pitch} = note;
  if (currentlyPlayingPitch !== pitch && currentlyPlayingPitch !== null && stopLastNoteOnNoteChange) {
    stopNote({id, pitch: currentlyPlayingPitch});
  }
  currentlyPlayingPitch = pitch;
  playNote(note);
};

export const handleControlPadInputEnd = (xYRatios) => {
  currentlyPlayingPitch = null;
  stopNote(getNoteFromXYRatios(xYRatios));
};

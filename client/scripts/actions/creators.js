import {
  UPDATE_ARPEGGIATOR_IS_ON,
  UPDATE_SELECTED_EFFECT,
  UPDATE_SELECTED_INSTRUMENT,
  UPDATE_SELECTED_PATTERN,
  UPDATE_SELECTED_SCALE,
  UPDATE_ROOT_NOTE,
} from './types';

const typeValueAction = type => value => ({type, value});

export const updateArpeggiatorIsOn = typeValueAction(UPDATE_ARPEGGIATOR_IS_ON);
export const updateSelectedEffect = typeValueAction(UPDATE_SELECTED_EFFECT);
export const updateSelectedPattern = typeValueAction(UPDATE_SELECTED_PATTERN);
export const updateSelectedInstrument = typeValueAction(UPDATE_SELECTED_INSTRUMENT);
export const updateSelectedScale = typeValueAction(UPDATE_SELECTED_SCALE);
export const updateSelectedRootNote = typeValueAction(UPDATE_ROOT_NOTE);

const actionCreator = (type) => (payload) => ({ payload, type });

export const ADD_EFFECT = "ADD_EFFECT";
export const ADD_EFFECT_TO_CHANNEL = "ADD_EFFECT_TO_CHANNEL";
export const ADD_INSTRUMENT_TO_CHANNEL = "ADD_INSTRUMENT_TO_CHANNEL";
export const BPM_SET = "BPM_SET";
export const CONTROL_PAD_INSTRUMENT_SET = "CONTROL_PAD_INSTRUMENT_SET";
export const CONTROL_PAD_NO_SCALE_SET = "CONTROL_PAD_NO_SCALE_SET";
export const CONTROL_PAD_OCTAVE_SET = "CONTROL_PAD_OCTAVE_SET";
export const CONTROL_PAD_RANGE_SET = "CONTROL_PAD_RANGE_SET";
export const CONTROL_PAD_TOUCHED = "CONTROL_PAD_TOUCHED";
export const INSTANTIATE_EFFECT = "INSTANTIATE_EFFECT";
export const INSTANTIATE_INSTRUMENT = "INSTANTIATE_INSTRUMENT";
export const KEYBOARD_INSTRUMENT_SET = "KEYBOARD_INSTRUMENT_SET";
export const KEYBOARD_MONOPHONIC_SET = "KEYBOARD_MONOPHONIC_SET";
export const KEYBOARD_OCTAVE_SET = "KEYBOARD_OCTAVE_SET";
export const KEYBOARD_VOLUME_SET = "KEYBOARD_VOLUME_SET";
export const LOAD_PLUGIN_EFFECT = "LOAD_PLUGIN_EFFECT";
export const LOAD_PLUGIN_INSTRUMENT = "LOAD_PLUGIN_INSTRUMENT";
export const NAV_LAST_DIRECTION_SET = "NAV_LAST_DIRECTION_SET";
export const ROOT_NOTE_SET = "ROOT_NOTE_SET";
export const SCREEN_RESIZE = "SCREEN_RESIZE";
export const SELECTED_SCALE_SET = "SELECTED_SCALE_SET";

export const addEffect = actionCreator(ADD_EFFECT);
export const addEffectToChannel = actionCreator(ADD_EFFECT_TO_CHANNEL);
export const addInstrumentToChannel = actionCreator(ADD_INSTRUMENT_TO_CHANNEL);
export const bpmSet = actionCreator(BPM_SET);
export const controlPadInstrumentSet = actionCreator(
  CONTROL_PAD_INSTRUMENT_SET
);
export const controlPadNoScaleSet = actionCreator(CONTROL_PAD_NO_SCALE_SET);
export const controlPadOctaveSet = actionCreator(CONTROL_PAD_OCTAVE_SET);
export const controlPadRangeSet = actionCreator(CONTROL_PAD_RANGE_SET);
export const controlPadTouched = actionCreator(CONTROL_PAD_TOUCHED);
export const instantiateEffect = actionCreator(INSTANTIATE_EFFECT);
export const instantiateInstrument = actionCreator(INSTANTIATE_INSTRUMENT);
export const keyboardInstrumentSet = actionCreator(KEYBOARD_INSTRUMENT_SET);
export const keyboardMonophonicSet = actionCreator(KEYBOARD_MONOPHONIC_SET);
export const keyboardOctaveSet = actionCreator(KEYBOARD_OCTAVE_SET);
export const keyboardVolumeSet = actionCreator(KEYBOARD_VOLUME_SET);
export const loadPluginEffect = actionCreator(LOAD_PLUGIN_EFFECT);
export const loadPluginInstrument = actionCreator(LOAD_PLUGIN_INSTRUMENT);
export const navLastDirectionSet = actionCreator(NAV_LAST_DIRECTION_SET);
export const rootNoteSet = actionCreator(ROOT_NOTE_SET);
export const screenResize = actionCreator(SCREEN_RESIZE);
export const selectedScaleSet = actionCreator(SELECTED_SCALE_SET);

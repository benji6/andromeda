const actionCreator = type => payload => ({payload, type})

export const ADD_CHANNEL = 'ADD_CHANNEL'
export const ADD_EFFECT_TO_CHANNEL = 'ADD_EFFECT_TO_CHANNEL'
export const ADD_EFFECT = 'ADD_EFFECT'
export const ADD_INSTRUMENT_TO_CHANNEL = 'ADD_INSTRUMENT_TO_CHANNEL'
export const APP_INITIALIZE = 'APP_INITIALIZE'
export const BPM_SET = 'BPM_SET'
export const CONTROL_PAD_INSTRUMENT_SET = 'CONTROL_PAD_INSTRUMENT_SET'
export const CONTROL_PAD_NO_SCALE_SET = 'CONTROL_PAD_NO_SCALE_SET'
export const CONTROL_PAD_OCTAVE_SET = 'CONTROL_PAD_OCTAVE_SET'
export const CONTROL_PAD_PORTAMENTO_SET = 'CONTROL_PAD_PORTAMENTO_SET'
export const CONTROL_PAD_RANGE_SET = 'CONTROL_PAD_RANGE_SET'
export const CONTROL_PAD_TOUCHED = 'CONTROL_PAD_TOUCHED'
export const INSTANTIATE_EFFECT = 'INSTANTIATE_EFFECT'
export const INSTANTIATE_INSTRUMENT = 'INSTANTIATE_INSTRUMENT'
export const KEYBOARD_INSTRUMENT_SET = 'KEYBOARD_INSTRUMENT_SET'
export const KEYBOARD_MONOPHONIC_SET = 'KEYBOARD_MONOPHONIC_SET'
export const KEYBOARD_OCTAVE_SET = 'KEYBOARD_OCTAVE_SET'
export const KEYBOARD_VOLUME_SET = 'KEYBOARD_VOLUME_SET'
export const LOAD_PLUGIN_EFFECT = 'LOAD_PLUGIN_EFFECT'
export const LOAD_PLUGIN_INSTRUMENT = 'LOAD_PLUGIN_INSTRUMENT'
export const NAV_LAST_DIRECTION_SET = 'NAV_LAST_DIRECTION_SET'
export const PATTERN_ACTIVE_NOTES_SET = 'PATTERN_ACTIVE_NOTES_SET'
export const PATTERN_BEAT_ADD = 'PATTERN_BEAT_ADD'
export const PATTERN_BEAT_CELL_CLICK = 'PATTERN_BEAT_CELL_CLICK'
export const PATTERN_BEAT_PLAYING_START = 'PATTERN_BEAT_PLAYING_START'
export const PATTERN_BEAT_PLAYING_STOP = 'PATTERN_BEAT_PLAYING_STOP'
export const PATTERN_DELETE = 'PATTERN_DELETE'
export const PATTERN_INSTRUMENT_SET = 'PATTERN_INSTRUMENT_SET'
export const PATTERN_MARKER_POSITION_SET = 'PATTERN_MARKER_POSITION_SET'
export const PATTERN_NEXT_LOOP_END_TIME_SET = 'PATTERN_NEXT_LOOP_END_TIME_SET'
export const PATTERN_SYNTH_ADD = 'PATTERN_SYNTH_ADD'
export const PATTERN_SYNTH_CELL_CLICK = 'PATTERN_SYNTH_CELL_CLICK'
export const PATTERN_SYNTH_PLAYING_START = 'PATTERN_SYNTH_PLAYING_START'
export const PATTERN_SYNTH_PLAYING_STOP = 'PATTERN_SYNTH_PLAYING_STOP'
export const PATTERN_VOLUME_SET = 'PATTERN_VOLUME_SET'
export const REMOVE_CHANNEL = 'REMOVE_CHANNEL'
export const REMOVE_EFFECT_FROM_CHANNEL = 'REMOVE_EFFECT_FROM_CHANNEL'
export const REMOVE_INSTRUMENT_FROM_CHANNEL = 'REMOVE_INSTRUMENT_FROM_CHANNEL'
export const ROOT_NOTE_SET = 'ROOT_NOTE_SET'
export const SAMPLE_FETCHED = 'SAMPLE_FETCHED'
export const SCREEN_RESIZE = 'SCREEN_RESIZE'
export const SELECTED_SCALE_SET = 'SELECTED_SCALE_SET'
export const SONG_ACTIVE_NOTES_SET = 'SONG_ACTIVE_NOTES_SET'
export const SONG_MARKER_POSITION_SET = 'SONG_MARKER_POSITION_SET'
export const SONG_PLAYING_START = 'SONG_PLAYING_START'
export const SONG_PLAYING_STOP = 'SONG_PLAYING_STOP'
export const SONG_STEPS_ADD = 'SONG_STEPS_ADD'
export const SONG_STEPS_REMOVE = 'SONG_STEPS_REMOVE'

export const addChannel = actionCreator(ADD_CHANNEL)
export const addEffectToChannel = actionCreator(ADD_EFFECT_TO_CHANNEL)
export const addEffect = actionCreator(ADD_EFFECT)
export const addInstrumentToChannel = actionCreator(ADD_INSTRUMENT_TO_CHANNEL)
export const appInitialize = actionCreator(APP_INITIALIZE)
export const bpmSet = actionCreator(BPM_SET)
export const controlPadInstrumentSet = actionCreator(CONTROL_PAD_INSTRUMENT_SET)
export const controlPadNoScaleSet = actionCreator(CONTROL_PAD_NO_SCALE_SET)
export const controlPadOctaveSet = actionCreator(CONTROL_PAD_OCTAVE_SET)
export const controlPadPortamentoSet = actionCreator(CONTROL_PAD_PORTAMENTO_SET)
export const controlPadRangeSet = actionCreator(CONTROL_PAD_RANGE_SET)
export const controlPadTouched = actionCreator(CONTROL_PAD_TOUCHED)
export const instantiateEffect = actionCreator(INSTANTIATE_EFFECT)
export const instantiateInstrument = actionCreator(INSTANTIATE_INSTRUMENT)
export const keyboardInstrumentSet = actionCreator(KEYBOARD_INSTRUMENT_SET)
export const keyboardMonophonicSet = actionCreator(KEYBOARD_MONOPHONIC_SET)
export const keyboardOctaveSet = actionCreator(KEYBOARD_OCTAVE_SET)
export const keyboardVolumeSet = actionCreator(KEYBOARD_VOLUME_SET)
export const loadPluginEffect = actionCreator(LOAD_PLUGIN_EFFECT)
export const loadPluginInstrument = actionCreator(LOAD_PLUGIN_INSTRUMENT)
export const navLastDirectionSet = actionCreator(NAV_LAST_DIRECTION_SET)
export const patternActiveNotesSet = actionCreator(PATTERN_ACTIVE_NOTES_SET)
export const patternBeatAdd = actionCreator(PATTERN_BEAT_ADD)
export const patternBeatCellClick = actionCreator(PATTERN_BEAT_CELL_CLICK)
export const patternBeatPlayingStart = actionCreator(PATTERN_BEAT_PLAYING_START)
export const patternBeatPlayingStop = actionCreator(PATTERN_BEAT_PLAYING_STOP)
export const patternDelete = actionCreator(PATTERN_DELETE)
export const patternInstrumentSet = actionCreator(PATTERN_INSTRUMENT_SET)
export const patternMarkerPositionSet = actionCreator(PATTERN_MARKER_POSITION_SET)
export const patternNextLoopEndTimeSet = actionCreator(PATTERN_NEXT_LOOP_END_TIME_SET)
export const patternSynthAdd = actionCreator(PATTERN_SYNTH_ADD)
export const patternSynthCellClick = actionCreator(PATTERN_SYNTH_CELL_CLICK)
export const patternSynthPlayingStart = actionCreator(PATTERN_SYNTH_PLAYING_START)
export const patternSynthPlayingStop = actionCreator(PATTERN_SYNTH_PLAYING_STOP)
export const patternVolumeSet = actionCreator(PATTERN_VOLUME_SET)
export const removeChannel = actionCreator(REMOVE_CHANNEL)
export const removeEffectFromChannel = actionCreator(REMOVE_EFFECT_FROM_CHANNEL)
export const removeInstrumentFromChannel = actionCreator(REMOVE_INSTRUMENT_FROM_CHANNEL)
export const rootNoteSet = actionCreator(ROOT_NOTE_SET)
export const sampleFetched = actionCreator(SAMPLE_FETCHED)
export const screenResize = actionCreator(SCREEN_RESIZE)
export const selectedScaleSet = actionCreator(SELECTED_SCALE_SET)
export const songActiveNotesSet = actionCreator(SONG_ACTIVE_NOTES_SET)
export const songMarkerPositionSet = actionCreator(SONG_MARKER_POSITION_SET)
export const songPlayingStart = actionCreator(SONG_PLAYING_START)
export const songPlayingStop = actionCreator(SONG_PLAYING_STOP)
export const songStepsAdd = actionCreator(SONG_STEPS_ADD)
export const songStepsRemove = actionCreator(SONG_STEPS_REMOVE)

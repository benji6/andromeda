const createAction = type => payload => ({type, payload})

export const [
  ADD_CHANNEL,
  ADD_NEW_PATTERN,
  ADD_EFFECT,
  ADD_EFFECT_TO_CHANNEL,
  ADD_INSTRUMENT_TO_CHANNEL,
  INSTANTIATE_EFFECT,
  INSTANTIATE_INSTRUMENT,
  LOAD_PLUGIN_EFFECT,
  LOAD_PLUGIN_INSTRUMENT,
  PATTERN_CELL_CLICK,
  REMOVE_CHANNEL,
  REMOVE_EFFECT_FROM_CHANNEL,
  REMOVE_INSTRUMENT_FROM_CHANNEL,
  SET_PATTERN_ACTIVE_POSITION,
  SET_PATTERN_Y_LENGTH,
  SET_SONG_ACTIVE_POSITION,
  SONG_CELL_CLICK,
  UPDATE_BPM,
  UPDATE_CONTROL_PAD_ARPEGGIATOR_IS_ON,
  UPDATE_CONTROL_PAD_ARPEGGIATOR_OCTAVES,
  UPDATE_CONTROL_PAD_INSTRUMENT,
  UPDATE_CONTROL_PAD_NO_SCALE,
  UPDATE_CONTROL_PAD_OCTAVE,
  UPDATE_CONTROL_PAD_PORTAMENTO,
  UPDATE_CONTROL_PAD_RANGE,
  UPDATE_CONTROL_PAD_SELECTED_ARPEGGIATOR_PATTERN,
  UPDATE_KEYBOARD_INSTRUMENT,
  UPDATE_KEYBOARD_OCTAVE,
  UPDATE_KEYBOARD_VOLUME,
  UPDATE_PATTERN_INSTRUMENT,
  UPDATE_PATTERN_OCTAVE,
  UPDATE_PATTERN_VOLUME,
  UPDATE_PATTERN_X_LENGTH,
  UPDATE_PLAYING,
  UPDATE_ROOT_NOTE,
  UPDATE_SELECTED_SCALE
] = (function * (n = 0) { while (true) yield String(n++) })()

export const addChannel = createAction(ADD_CHANNEL)
export const addNewPattern = createAction(ADD_NEW_PATTERN)
export const addEffect = createAction(ADD_EFFECT)
export const addEffectToChannel = createAction(ADD_EFFECT_TO_CHANNEL)
export const addInstrumentToChannel = createAction(ADD_INSTRUMENT_TO_CHANNEL)
export const instantiateEffect = createAction(INSTANTIATE_EFFECT)
export const instantiateInstrument = createAction(INSTANTIATE_INSTRUMENT)
export const loadPluginEffect = createAction(LOAD_PLUGIN_EFFECT)
export const loadPluginInstrument = createAction(LOAD_PLUGIN_INSTRUMENT)
export const patternCellClick = createAction(PATTERN_CELL_CLICK)
export const removeChannel = createAction(REMOVE_CHANNEL)
export const removeEffectFromChannel = createAction(REMOVE_EFFECT_FROM_CHANNEL)
export const removeInstrumentFromChannel = createAction(REMOVE_INSTRUMENT_FROM_CHANNEL)
export const setPatternActivePosition = createAction(SET_PATTERN_ACTIVE_POSITION)
export const setPatternYLength = createAction(SET_PATTERN_Y_LENGTH)
export const setSongActivePosition = createAction(SET_SONG_ACTIVE_POSITION)
export const songCellClick = createAction(SONG_CELL_CLICK)
export const updateBpm = createAction(UPDATE_BPM)
export const updateControlPadArpeggiatorIsOn = createAction(UPDATE_CONTROL_PAD_ARPEGGIATOR_IS_ON)
export const updateControlPadArpeggiatorOctaves = createAction(UPDATE_CONTROL_PAD_ARPEGGIATOR_OCTAVES)
export const updateControlPadInstrument = createAction(UPDATE_CONTROL_PAD_INSTRUMENT)
export const updateControlPadNoScale = createAction(UPDATE_CONTROL_PAD_NO_SCALE)
export const updateControlPadOctave = createAction(UPDATE_CONTROL_PAD_OCTAVE)
export const updateControlPadPortamento = createAction(UPDATE_CONTROL_PAD_PORTAMENTO)
export const updateControlPadRange = createAction(UPDATE_CONTROL_PAD_RANGE)
export const updateControlPadSelectedArpeggiatorPattern = createAction(UPDATE_CONTROL_PAD_SELECTED_ARPEGGIATOR_PATTERN)
export const updateKeyboardInstrument = createAction(UPDATE_KEYBOARD_INSTRUMENT)
export const updateKeyboardOctave = createAction(UPDATE_KEYBOARD_OCTAVE)
export const updateKeyboardVolume = createAction(UPDATE_KEYBOARD_VOLUME)
export const updatePatternInstrument = createAction(UPDATE_PATTERN_INSTRUMENT)
export const updatePatternOctave = createAction(UPDATE_PATTERN_OCTAVE)
export const updatePatternVolume = createAction(UPDATE_PATTERN_VOLUME)
export const updatePatternXLength = createAction(UPDATE_PATTERN_X_LENGTH)
export const updatePlaying = createAction(UPDATE_PLAYING)
export const updateRootNote = createAction(UPDATE_ROOT_NOTE)
export const updateSelectedRootNote = createAction(UPDATE_ROOT_NOTE)
export const updateSelectedScale = createAction(UPDATE_SELECTED_SCALE)

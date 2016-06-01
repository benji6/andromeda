const createActions = function * () {
  const createAction = type => payload => ({type, payload})
  while (true) {
    const sym = Symbol()
    yield [sym, createAction(sym)]
  }
}

export const [
  [ADD_CHANNEL, addChannel],
  [ADD_EFFECT_TO_CHANNEL, addEffectToChannel],
  [ADD_EFFECT, addEffect],
  [ADD_INSTRUMENT_TO_CHANNEL, addInstrumentToChannel],
  [ADD_NEW_PATTERN, addNewPattern],
  [DELETE_PATTERN, deletePattern],
  [INSTANTIATE_EFFECT, instantiateEffect],
  [INSTANTIATE_INSTRUMENT, instantiateInstrument],
  [KEYBOARD_MONOPHONIC_SET, keyboardMonophonicSet],
  [LOAD_PLUGIN_EFFECT, loadPluginEffect],
  [LOAD_PLUGIN_INSTRUMENT, loadPluginInstrument],
  [PATTERN_ACTIVE_NOTES_APPEND, patternActiveNotesAppend],
  [PATTERN_ACTIVE_NOTES_CLEAR, patternActiveNotesClear],
  [PATTERN_ACTIVE_NOTES_REJECT, patternActiveNotesReject],
  [PATTERN_ACTIVE_NOTES_SET, patternActiveNotesSet],
  [PATTERN_CELL_CLICK, patternCellClick],
  [REMOVE_CHANNEL, removeChannel],
  [REMOVE_EFFECT_FROM_CHANNEL, removeEffectFromChannel],
  [REMOVE_INSTRUMENT_FROM_CHANNEL, removeInstrumentFromChannel],
  [SET_PATTERN_MARKER_POSITION, setPatternMarkerPosition],
  [SET_PATTERN_NEXT_LOOP_END_TIME, setPatternNextLoopEndTime],
  [SET_PATTERN_PLAY_START_TIME, setPatternPlayStartTime],
  [SET_PATTERN_PLAYING, setPatternPlaying],
  [BPM_SET, updateBpm],
  [UPDATE_CONTROL_PAD_INSTRUMENT, updateControlPadInstrument],
  [UPDATE_CONTROL_PAD_NO_SCALE, updateControlPadNoScale],
  [UPDATE_CONTROL_PAD_OCTAVE, updateControlPadOctave],
  [UPDATE_CONTROL_PAD_PORTAMENTO, updateControlPadPortamento],
  [UPDATE_CONTROL_PAD_RANGE, updateControlPadRange],
  [UPDATE_KEYBOARD_INSTRUMENT, updateKeyboardInstrument],
  [UPDATE_KEYBOARD_OCTAVE, updateKeyboardOctave],
  [UPDATE_KEYBOARD_VOLUME, updateKeyboardVolume],
  [UPDATE_PATTERN_INSTRUMENT, updatePatternInstrument],
  [UPDATE_PATTERN_VOLUME, updatePatternVolume],
  [UPDATE_PATTERN_X_LENGTH, updatePatternXLength],
  [UPDATE_ROOT_NOTE, updateRootNote],
  [UPDATE_SELECTED_SCALE, updateSelectedScale]
] = createActions()

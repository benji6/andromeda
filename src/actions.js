function* createActions () {
  const createAction = type => payload => ({type, payload})
  while (true) {
    let sym = Symbol()
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
  [LOAD_PLUGIN_EFFECT, loadPluginEffect],
  [LOAD_PLUGIN_INSTRUMENT, loadPluginInstrument],
  [PATTERN_CELL_CLICK, patternCellClick],
  [REMOVE_CHANNEL, removeChannel],
  [REMOVE_EFFECT_FROM_CHANNEL, removeEffectFromChannel],
  [REMOVE_INSTRUMENT_FROM_CHANNEL, removeInstrumentFromChannel],
  [SET_PATTERN_ACTIVE_POSITION, setPatternActivePosition],
  [SET_PATTERN_PLAYING, setPatternPlaying],
  [SET_PATTERN_Y_LENGTH, setPatternYLength],
  [SET_SONG_ACTIVE_POSITION, setSongActivePosition],
  [SONG_CELL_CLICK, songCellClick],
  [UPDATE_BPM, updateBpm],
  [UPDATE_CONTROL_PAD_ARPEGGIATOR_IS_ON, updateControlPadArpeggiatorIsOn],
  [UPDATE_CONTROL_PAD_ARPEGGIATOR_OCTAVES, updateControlPadArpeggiatorOctaves],
  [UPDATE_CONTROL_PAD_INSTRUMENT, updateControlPadInstrument],
  [UPDATE_CONTROL_PAD_NO_SCALE, updateControlPadNoScale],
  [UPDATE_CONTROL_PAD_OCTAVE, updateControlPadOctave],
  [UPDATE_CONTROL_PAD_PORTAMENTO, updateControlPadPortamento],
  [UPDATE_CONTROL_PAD_RANGE, updateControlPadRange],
  [UPDATE_CONTROL_PAD_SELECTED_ARPEGGIATOR_PATTERN, updateControlPadSelectedArpeggiatorPattern],
  [UPDATE_KEYBOARD_INSTRUMENT, updateKeyboardInstrument],
  [UPDATE_KEYBOARD_OCTAVE, updateKeyboardOctave],
  [UPDATE_KEYBOARD_VOLUME, updateKeyboardVolume],
  [UPDATE_PATTERN_INSTRUMENT, updatePatternInstrument],
  [UPDATE_PATTERN_OCTAVE, updatePatternOctave],
  [UPDATE_PATTERN_VOLUME, updatePatternVolume],
  [UPDATE_PATTERN_X_LENGTH, updatePatternXLength],
  [UPDATE_ROOT_NOTE, updateRootNote],
  [UPDATE_SELECTED_SCALE, updateSelectedScale]
] = createActions()

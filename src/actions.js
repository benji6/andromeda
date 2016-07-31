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
  [APP_INITIALIZE, appInitialize],
  [BPM_SET, bpmSet],
  [CONTROL_PAD_INSTRUMENT_SET, controlPadInstrumentSet],
  [CONTROL_PAD_NO_SCALE_SET, controlPadNoScaleSet],
  [CONTROL_PAD_OCTAVE_SET, controlPadOctaveSet],
  [CONTROL_PAD_PORTAMENTO_SET, controlPadPortamentoSet],
  [CONTROL_PAD_RANGE_SET, controlPadRangeSet],
  [CONTROL_PAD_TOUCHED, controlPadTouched],
  [INSTANTIATE_EFFECT, instantiateEffect],
  [INSTANTIATE_INSTRUMENT, instantiateInstrument],
  [KEYBOARD_INSTRUMENT_SET, keyboardInstrumentSet],
  [KEYBOARD_MONOPHONIC_SET, keyboardMonophonicSet],
  [KEYBOARD_OCTAVE_SET, keyboardOctaveSet],
  [KEYBOARD_VOLUME_SET, keyboardVolumeSet],
  [LOAD_PLUGIN_EFFECT, loadPluginEffect],
  [LOAD_PLUGIN_INSTRUMENT, loadPluginInstrument],
  [PATTERN_ACTIVE_NOTES_SET, patternActiveNotesSet],
  [PATTERN_BEAT_ADD, patternBeatAdd],
  [PATTERN_BEAT_CELL_CLICK, patternBeatCellClick],
  [PATTERN_BEAT_PLAYING_START, patternBeatPlayingStart],
  [PATTERN_BEAT_PLAYING_STOP, patternBeatPlayingStop],
  [PATTERN_DELETE, patternDelete],
  [PATTERN_INSTRUMENT_SET, patternInstrumentSet],
  [PATTERN_MARKER_POSITION_SET, patternMarkerPositionSet],
  [PATTERN_NEXT_LOOP_END_TIME_SET, patternNextLoopEndTimeSet],
  [PATTERN_SYNTH_ADD, patternSynthAdd],
  [PATTERN_SYNTH_CELL_CLICK, patternSynthCellClick],
  [PATTERN_SYNTH_PLAYING_START, patternSynthPlayingStart],
  [PATTERN_SYNTH_PLAYING_STOP, patternSynthPlayingStop],
  [PATTERN_VOLUME_SET, patternVolumeSet],
  [PATTERN_X_LENGTH_SET, patternXLengthSet],
  [REMOVE_CHANNEL, removeChannel],
  [REMOVE_EFFECT_FROM_CHANNEL, removeEffectFromChannel],
  [REMOVE_INSTRUMENT_FROM_CHANNEL, removeInstrumentFromChannel],
  [ROOT_NOTE_SET, rootNoteSet],
  [SAMPLE_FETCHED, sampleFetched],
  [SELECTED_SCALE_SET, selectedScaleSet],
  [SONG_ACTIVE_NOTES_SET, songActiveNotesSet],
  [SONG_PLAYING_START, songPlayingStart],
  [SONG_PLAYING_STOP, songPlayingStop],
] = createActions()

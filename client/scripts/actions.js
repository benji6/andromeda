const typeValueAction = type => value => ({type, value});

export const UPDATE_ACTIVE_PATTERN_NOTES = 'UPDATE_ACTIVE_PATTERN_NOTES';
export const UPDATE_ACTIVE_PATTERN_INSTRUMENT = 'UPDATE_ACTIVE_PATTERN_INSTRUMENT';
export const UPDATE_ARPEGGIATOR_IS_ON = 'UPDATE_ARPEGGIATOR_IS_ON';
export const UPDATE_BPM = 'UPDATE_BPM';
export const UPDATE_KEYBOARD_ACTIVE = 'UPDATE_ARPEGGIATOR_IS_ON';
export const UPDATE_PLAYING = 'UPDATE_PLAYING';
export const UPDATE_ROOT_NOTE = 'UPDATE_ROOT_NOTE';
export const UPDATE_SELECTED_EFFECT = 'UPDATE_SELECTED_EFFECT';
export const UPDATE_SELECTED_INSTRUMENT = 'UPDATE_SELECTED_INSTRUMENT';
export const UPDATE_SELECTED_PATTERN = 'UPDATE_SELECTED_PATTERN';
export const UPDATE_SELECTED_SCALE = 'UPDATE_SELECTED_SCALE';
export const UPDATE_SONG_NOTES = 'UPDATE_SONG_NOTES';

export const updateActivePatternNotes = typeValueAction(UPDATE_ACTIVE_PATTERN_NOTES);
export const updateActivePatternInstrument = typeValueAction(UPDATE_ACTIVE_PATTERN_INSTRUMENT);
export const updateArpeggiatorIsOn = typeValueAction(UPDATE_ARPEGGIATOR_IS_ON);
export const updateBpm = typeValueAction(UPDATE_BPM);
export const updateKeyboardActive = typeValueAction(UPDATE_KEYBOARD_ACTIVE);
export const updatePlaying = typeValueAction(UPDATE_PLAYING);
export const updateRootNote = typeValueAction(UPDATE_ROOT_NOTE);
export const updateSelectedEffect = typeValueAction(UPDATE_SELECTED_EFFECT);
export const updateSelectedPattern = typeValueAction(UPDATE_SELECTED_PATTERN);
export const updateSelectedInstrument = typeValueAction(UPDATE_SELECTED_INSTRUMENT);
export const updateSelectedScale = typeValueAction(UPDATE_SELECTED_SCALE);
export const updateSelectedRootNote = typeValueAction(UPDATE_ROOT_NOTE);
export const updateSongNotes = typeValueAction(UPDATE_SONG_NOTES);

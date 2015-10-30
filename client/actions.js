const typeValueAction = type => value => ({type, value});

export const ACTIVE_PATTERN_CELL_CLICK = 'PATTERN_CELL_CLICK';
export const ADD_EFFECT = 'ADD_EFFECT';
export const MOVE_CHANNEL_SOURCE_DOWN = 'MOVE_CHANNEL_SOURCE_DOWN';
export const MOVE_CHANNEL_SOURCE_UP = 'MOVE_CHANNEL_SOURCE_UP';
export const MOVE_EFFECT_SOURCE_DOWN = 'MOVE_EFFECT_SOURCE_DOWN';
export const MOVE_EFFECT_SOURCE_UP = 'MOVE_EFFECT_SOURCE_UP';
export const REMOVE_CHANNEL_EFFECT = 'REMOVE_CHANNEL_EFFECT';
export const REMOVE_CHANNEL_SOURCE = 'REMOVE_CHANNEL_SOURCE';
export const UPDATE_ACTIVE_PATTERN_ACTIVE_POSITION = 'UPDATE_ACTIVE_PATTERN_ACTIVE_POSITION';
export const UPDATE_ACTIVE_PATTERN_INDEX = 'UPDATE_ACTIVE_PATTERN_INDEX';
export const UPDATE_ACTIVE_PATTERN_INSTRUMENT = 'UPDATE_ACTIVE_PATTERN_INSTRUMENT';
export const UPDATE_ACTIVE_PATTERN_OCTAVE = 'UPDATE_ACTIVE_PATTERN_OCTAVE';
export const UPDATE_ACTIVE_PATTERN_X_LENGTH = 'UPDATE_ACTIVE_PATTERN_X_LENGTH';
export const UPDATE_ARPEGGIATOR_IS_ON = 'UPDATE_ARPEGGIATOR_IS_ON';
export const UPDATE_BPM = 'UPDATE_BPM';
export const UPDATE_MICROPHONE_IS_AVAILABLE = 'UPDATE_MICROPHONE_IS_AVAILABLE';
export const UPDATE_MICROPHONE_IS_ON = 'UPDATE_MICROPHONE_IS_ON';
export const UPDATE_PLAYING = 'UPDATE_PLAYING';
export const UPDATE_ROOT_NOTE = 'UPDATE_ROOT_NOTE';
export const UPDATE_SELECTED_ADD_EFFECT = 'UPDATE_SELECTED_ADD_EFFECT';
export const UPDATE_SELECTED_ADD_SOURCE = 'UPDATE_SELECTED_ADD_SOURCE';
export const UPDATE_SELECTED_EFFECT = 'UPDATE_SELECTED_EFFECT';
export const UPDATE_SELECTED_INSTRUMENT = 'UPDATE_SELECTED_INSTRUMENT';
export const UPDATE_SELECTED_PATTERN = 'UPDATE_SELECTED_PATTERN';
export const UPDATE_SELECTED_SCALE = 'UPDATE_SELECTED_SCALE';
export const UPDATE_SONG_NOTES = 'UPDATE_SONG_NOTES';

export const activePatternCellClick = typeValueAction(ACTIVE_PATTERN_CELL_CLICK);
export const addEffect = typeValueAction(ADD_EFFECT);
export const moveChannelSourceDown = typeValueAction(MOVE_CHANNEL_SOURCE_DOWN);
export const moveChannelSourceUp = typeValueAction(MOVE_CHANNEL_SOURCE_UP);
export const moveEffectSourceDown = typeValueAction(MOVE_EFFECT_SOURCE_DOWN);
export const moveEffectSourceUp = typeValueAction(MOVE_EFFECT_SOURCE_UP);
export const removeChannelEffect = typeValueAction(REMOVE_CHANNEL_EFFECT);
export const removeChannelSource = typeValueAction(REMOVE_CHANNEL_SOURCE);
export const updateActivePatternActivePosition = typeValueAction(UPDATE_ACTIVE_PATTERN_ACTIVE_POSITION);
export const updateActivePatternIndex = typeValueAction(UPDATE_ACTIVE_PATTERN_INDEX);
export const updateActivePatternInstrument = typeValueAction(UPDATE_ACTIVE_PATTERN_INSTRUMENT);
export const updateActivePatternOctave = typeValueAction(UPDATE_ACTIVE_PATTERN_OCTAVE);
export const updateActivePatternXLength = typeValueAction(UPDATE_ACTIVE_PATTERN_X_LENGTH);
export const updateArpeggiatorIsOn = typeValueAction(UPDATE_ARPEGGIATOR_IS_ON);
export const updateBpm = typeValueAction(UPDATE_BPM);
export const updateMicrophoneIsAvailable = typeValueAction(UPDATE_MICROPHONE_IS_AVAILABLE);
export const updateMicrophoneIsOn = typeValueAction(UPDATE_MICROPHONE_IS_ON);
export const updatePlaying = typeValueAction(UPDATE_PLAYING);
export const updateRootNote = typeValueAction(UPDATE_ROOT_NOTE);
export const updateSelectedAddEffect = typeValueAction(UPDATE_SELECTED_ADD_EFFECT);
export const updateSelectedAddSource = typeValueAction(UPDATE_SELECTED_ADD_SOURCE);
export const updateSelectedEffect = typeValueAction(UPDATE_SELECTED_EFFECT);
export const updateSelectedInstrument = typeValueAction(UPDATE_SELECTED_INSTRUMENT);
export const updateSelectedPattern = typeValueAction(UPDATE_SELECTED_PATTERN);
export const updateSelectedRootNote = typeValueAction(UPDATE_ROOT_NOTE);
export const updateSelectedScale = typeValueAction(UPDATE_SELECTED_SCALE);
export const updateSongNotes = typeValueAction(UPDATE_SONG_NOTES);

import { instrumentInstance } from "./utils/derivedData";
import { KEY_CODES_TO_PITCHES } from "./constants";
import pitchToFrequency from "./audioHelpers/pitchToFrequency";
import store from "./store";

const pressedKeys = new Set<number>();

const computeId = (pitch: number) => `keyboard: ${pitch}`;

const computeNoteParams = (pitch: number) => {
  const {
    keyboard: { instrument, octave, volume },
  } = store.getState();
  return {
    frequency: pitchToFrequency(pitch + 12 * octave),
    gain: volume,
    id: computeId(pitch),
    instrument,
  };
};

const stopAndRemoveNote = (keyCode: keyof typeof KEY_CODES_TO_PITCHES) => {
  pressedKeys.delete(keyCode);
  const pitch = KEY_CODES_TO_PITCHES[keyCode];
  if (pitch === undefined) return;
  const noteParams = computeNoteParams(pitch);
  const instrumentObj = instrumentInstance(
    noteParams.instrument,
    store.getState().plugins,
  );
  instrumentObj?.noteStop(noteParams.id);
};

const isValidKeyCode = (
  keyCode: number,
): keyCode is keyof typeof KEY_CODES_TO_PITCHES =>
  keyCode in KEY_CODES_TO_PITCHES;

document.addEventListener("keydown", (e) => {
  const { keyCode } = e;
  if (keyCode === 191) e.preventDefault();
  if (pressedKeys.has(keyCode)) return;
  pressedKeys.add(keyCode);
  if (!isValidKeyCode(keyCode)) return;
  const pitch = KEY_CODES_TO_PITCHES[keyCode];
  const state = store.getState();
  if (state.keyboard.monophonic) {
    for (const code of pressedKeys)
      if (isValidKeyCode(code) && code !== keyCode) stopAndRemoveNote(code);
  }
  const noteParams = computeNoteParams(pitch);
  const instrumentObj = instrumentInstance(
    noteParams.instrument,
    state.plugins,
  );
  instrumentObj?.noteStart(noteParams);
});

document.addEventListener("keyup", ({ keyCode }) => {
  pressedKeys.delete(keyCode);
  if (!isValidKeyCode(keyCode)) return;
  const pitch = KEY_CODES_TO_PITCHES[keyCode];
  const noteParams = computeNoteParams(pitch);
  const instrumentObj = instrumentInstance(
    noteParams.instrument,
    store.getState().plugins,
  );
  instrumentObj?.noteStop(noteParams.id);
});

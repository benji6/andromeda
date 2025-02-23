import { instrumentInstance } from "./utils/derivedData";
import keyCodesToPitches from "./constants/keyCodesToPitches";
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

const stopAndRemoveNote = (keyCode: keyof typeof keyCodesToPitches) => {
  pressedKeys.delete(keyCode);
  const pitch = keyCodesToPitches[keyCode];
  if (pitch === undefined) return;
  const noteParams = computeNoteParams(pitch);
  const instrumentObj = instrumentInstance(
    noteParams.instrument,
    store.getState().plugins,
  );
  instrumentObj.noteStop(noteParams.id);
};

const isValidKeyCode = (
  keyCode: number,
): keyCode is keyof typeof keyCodesToPitches => keyCode in keyCodesToPitches;

document.addEventListener("keydown", (e) => {
  const { keyCode } = e;
  if (keyCode === 191) e.preventDefault();
  if (pressedKeys.has(keyCode)) return;
  pressedKeys.add(keyCode);
  if (!isValidKeyCode(keyCode)) return;
  const pitch = keyCodesToPitches[keyCode];
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
  instrumentObj.noteStart(noteParams);
});

document.addEventListener("keyup", ({ keyCode }) => {
  pressedKeys.delete(keyCode);
  if (!isValidKeyCode(keyCode)) return;
  const pitch = keyCodesToPitches[keyCode];
  const noteParams = computeNoteParams(pitch);
  const instrumentObj = instrumentInstance(
    noteParams.instrument,
    store.getState().plugins,
  );
  instrumentObj.noteStop(noteParams.id);
});

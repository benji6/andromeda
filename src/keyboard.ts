import { KEY_CODES_TO_PITCHES } from "./constants";
import pitchToFrequency from "./audioHelpers/pitchToFrequency";
import store from "./store";
import keyboardSlice from "./store/keyboardSlice";

const pressedKeyCodes = new Set<number>();

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

const isValidKeyCode = (
  keyCode: number,
): keyCode is keyof typeof KEY_CODES_TO_PITCHES =>
  keyCode in KEY_CODES_TO_PITCHES;

const setNotes = () =>
  store.dispatch(
    keyboardSlice.actions.currentNotesSet(
      [...pressedKeyCodes].filter(isValidKeyCode).map((keyCode) => {
        const pitch = KEY_CODES_TO_PITCHES[keyCode];
        return computeNoteParams(pitch);
      }),
    ),
  );

document.addEventListener("keydown", (e) => {
  const { keyCode } = e;
  if (keyCode === 191) e.preventDefault();
  if (pressedKeyCodes.has(keyCode)) return;
  pressedKeyCodes.add(keyCode);
  setNotes();

  // TODO add monophony
  // if (state.keyboard.monophonic) {
  //   for (const code of pressedKeyCodes)
  //     if (isValidKeyCode(code) && code !== keyCode) stopAndRemoveNote(code);
  // }
});

document.addEventListener("keyup", ({ keyCode }) => {
  pressedKeyCodes.delete(keyCode);
  setNotes();
});

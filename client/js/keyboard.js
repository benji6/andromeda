import {playNote, stopNote} from './noteController';
import {isNil} from 'ramda';

let pressedKeys = new Set();

const keyCodesToPitches = {
  220: -10,
  90: -9,
  83: -8,
  88: -7,
  68: -6,
  67: -5,
  86: -4,
  71: -3,
  66: -2,
  72: -1,
  78: 0,
  74: 1,
  49: 1,
  77: 2,
  81: 2,
  87: 3,
  188: 3,
  51: 4,
  76: 4,
  69: 5,
  190: 5,
  186: 6,
  52: 6,
  59: 6,
  82: 7,
  191: 7,
  84: 8,
  222: 9,
  54: 9,
  89: 10,
  55: 11,
  85: 12,
  56: 13,
  73: 14,
  79: 15,
  48: 16,
  80: 17,
  189: 18,
  219: 19,
  221: 20,
};

document.onkeydown = (e) => {
  const {keyCode} = e;

  if (keyCode === 191) e.preventDefault();
  if (pressedKeys.has(keyCode)) return;

  const pitch = keyCodesToPitches[keyCode];

  if (isNil(pitch)) return;

  pressedKeys.add(keyCode);

  playNote({
    id: `keyboard: ${keyCode}`,
    keyCode,
    pitch,
  });
};

document.onkeyup = ({keyCode}) => {
  const pitch = keyCodesToPitches[keyCode];

  if (isNil(pitch)) return;

  pressedKeys.delete(keyCode);

  stopNote({
    id: `keyboard: ${keyCode}`,
    keyCode,
    pitch,
  });
};

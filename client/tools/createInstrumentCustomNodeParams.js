import {map} from 'ramda';
import Random from 'random-js';
import store from '../store';

let currentIndex = 0;
let ascending = true;

const getState = ::store.getState;
const calculateFrequency = pitch => 440 * 2 ** (pitch / 12);
const pickRandom = arr => Random.pick(Random.engines.browserCrypto, arr);

const incrementScalePitch = (pitch, increment) => {
  const {scales, scaleName} = getState().scale;
  const scale = scales[scaleName];
  const scaleArray = scale.toArray();
  if (scaleArray.indexOf(pitch % 12) === -1) {
    return pitch;
  }
  return (function recur (index, pitchIncrement) {
    const {length} = scale.toArray();
    if (index >= length) {
      return recur(index - length, pitchIncrement + 12);
    }
    return scale(index) + pitchIncrement;
  }(scaleArray.indexOf(pitch % 12) + increment, Math.floor(pitch / 12) * 12));
};

export const resetArpeggiator = () => currentIndex = 0;

export default ({pitch, instrument = getState().instrument.selectedInstrument, rootNote, modulation, startTime, stopTime}) => {
  const {arpeggiator, scale} = getState();
  const {arpeggiatorIsOn, selectedPattern} = arpeggiator;
  let pitchToPlay = pitch;

  if (arpeggiatorIsOn && scale.scaleName !== 'none') {
    const arpeggiatorPitches = map(x => incrementScalePitch(pitchToPlay, x),
                                   [0, 2, 4, 7, 9, 11]);

    switch (selectedPattern) {
      case 'up':
        ascending = true;
        break;
      case 'down':
        ascending = false;
        break;
      case 'up and down':
        if (currentIndex === 0) {
          ascending = true;
        } else if (currentIndex === arpeggiatorPitches.length - 1) {
          ascending = false;
        }
        break;
    }

    if (selectedPattern === 'random') {
      pitchToPlay = pickRandom(arpeggiatorPitches);
    } else if (ascending) {
      pitchToPlay = arpeggiatorPitches[currentIndex];
      currentIndex = ++currentIndex === arpeggiatorPitches.length ?
        0 :
        currentIndex;
    } else {
      currentIndex = currentIndex === 0 ?
        arpeggiatorPitches.length - 1 :
        --currentIndex;
      pitchToPlay = arpeggiatorPitches[currentIndex];
    }
  }

  return [
    instrument,
    ['output', 0],
    {
      frequency: calculateFrequency(pitchToPlay + rootNote),
      gain: (1 - modulation) / 4,
      startTime,
      stopTime,
    },
  ];
};

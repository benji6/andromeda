import {map} from 'ramda';
import Random from 'random-js';
import computeAscending from './computeAscending';

let currentIndex = 0;
let ascending = true;

const calculateFrequency = pitch => 440 * 2 ** (pitch / 12);
const pickRandom = arr => Random.pick(Random.engines.browserCrypto, arr);

const incrementScalePitch = (pitch, increment, {scales, scaleName}) => {
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

export default ({arpeggiator,
                 effectsLength,
                 modulation,
                 pitch,
                 scale,
                 startTime,
                 stopTime}) => instrument => {
  const {arpeggiatorIsOn, selectedPattern} = arpeggiator;
  let pitchToPlay = pitch;

  if (arpeggiatorIsOn && scale.scaleName !== 'none') {
    const arpeggiatorPitches = map(x => incrementScalePitch(pitchToPlay, x, scale),
                                   [0, 2, 4, 7, 9, 11]);
    const {length} = arpeggiatorPitches;

    ascending = computeAscending(selectedPattern,
                                 currentIndex,
                                 length,
                                 ascending);

    if (selectedPattern === 'random') {
      pitchToPlay = pickRandom(arpeggiatorPitches);
    } else if (ascending) {
      pitchToPlay = arpeggiatorPitches[currentIndex];
      currentIndex = ++currentIndex === length ?
        0 :
        currentIndex;
    } else {
      currentIndex = currentIndex === 0 ?
        length - 1 :
        --currentIndex;
      pitchToPlay = arpeggiatorPitches[currentIndex];
    }
  }

  return [
    instrument,
    effectsLength - 1,
    {
      frequency: calculateFrequency(pitchToPlay),
      gain: (1 - modulation) / 4,
      startTime,
      stopTime,
    },
  ];
};

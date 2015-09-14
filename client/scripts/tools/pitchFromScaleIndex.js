/* global R */
import store from '../store';

const {dropLast} = R;

export default scaleIndex => {
  const {scales, scaleName} = store.getState().scale;
  const scale = scales[scaleName];
  if (!scale) {
    return null;
  }
  const scaleWithNoRepeats = dropLast(1, scale);
  const scaleLength = scaleWithNoRepeats.length;
  const tcoComputePitch = (index, pitchIncrement = 0) => index >= scaleLength ?
      tcoComputePitch(index - scaleLength, pitchIncrement + 12) :
      scaleWithNoRepeats[index] + pitchIncrement;
  return tcoComputePitch(scaleIndex);
};

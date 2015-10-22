export default (scale, scaleIndex) => {
  if (!scale) {
    return null;
  }
  const {length} = scale.toArray();
  const computePitch = (i, pitchOffset = 0) => {
    if (i < length) {
      if (i >= 0) {
        return scale(i) + pitchOffset;
      }
      return computePitch(i + length, pitchOffset - 12);
    }
    return computePitch(i - length, pitchOffset + 12);
  };
  return computePitch(scaleIndex);
};

export default (scale, scaleIndex) => {
  if (!scale) {
    return null;
  }
  const {size} = scale;
  const computePitch = (i, pitchOffset = 0) => {
    if (i < size) {
      if (i >= 0) {
        return scale(i) + pitchOffset;
      }
      return computePitch(i + size, pitchOffset - 12);
    }
    return computePitch(i - size, pitchOffset + 12);
  };
  return computePitch(scaleIndex);
};

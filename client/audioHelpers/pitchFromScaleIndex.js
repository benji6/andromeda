export default (scale, scaleIndex) =>
  scale ?
    (function computePitch (i, length, pitchOffset = 0) {
      if (i < length) {
        if (i >= 0) {
          return scale(i) + pitchOffset;
        }
        return computePitch(i + length, length, pitchOffset - 12);
      }
      return computePitch(i - length, length, pitchOffset + 12);
    }(scaleIndex, scale.toArray().length)) :
    null;

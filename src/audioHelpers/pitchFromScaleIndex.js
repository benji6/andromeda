const computePitch = function computePitch (scale, i, length, pitchOffset = 0) {
  if (i >= length) return computePitch(scale, i - length, length, pitchOffset + 12)
  if (i >= 0) return scale[(i % length + length) % length] + pitchOffset
  return computePitch(scale, i + length, length, pitchOffset - 12)
}

export default (scale, scaleIndex) => computePitch(scale, scaleIndex, scale.length)

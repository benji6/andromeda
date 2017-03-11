export default (scale, i) => {
  const {length} = scale
  return scale[(i % length + length) % length] + Math.floor(i / length) * 12
}

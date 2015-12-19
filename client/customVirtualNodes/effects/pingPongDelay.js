export default ({
  decay = 1 / 3,
  delayTime = 1 / 3,
  maxDelayTime = 1 / 3,
  mix = 1 / 3
} = {}) => ({
  0: ['stereoPanner', 'output', {pan: -1}],
  1: ['stereoPanner', 'output', {pan: 1}],
  2: ['delay', [1, 5], {maxDelayTime, delayTime}],
  3: ['gain', 2, {gain: decay}],
  4: ['delay', [0, 3], {maxDelayTime, delayTime}],
  5: ['gain', 4, {gain: decay}],
  6: ['gain', 'output', {gain: 1 - mix}],
  7: ['gain', [5, 6], {gain: 1}, 'input']
})

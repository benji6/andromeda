export default {
  filter: {
    frequency: 1300,
    gain: -12,
    Q: 5,
    type: 'lowpass',
  },
  lfo: {
    frequency: 0.3,
    gain: 400,
    type: 'triangle',
  },
  master: {
    gain: 0.75,
    pan: 0,
  },
  oscillatorSingles: [
    {detune: 13, gain: 0.5, id: 0, pan: 0.4, pitch: -12, type: 'triangle'},
    {detune: -7, gain: 0.8, id: 1, pan: 0.1, pitch: -12, type: 'square'},
    {detune: 10, gain: 0.2, id: 2, pan: -0.4, pitch: 0, type: 'square'},
  ],
  oscillatorSupers: [
    {detune: -3, gain: 0.35, id: 0, numberOfOscillators: 5, pan: -0.3, pitch: 0, spread: 6, type: 'sawtooth'},
  ],
}

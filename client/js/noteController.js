import VirtualAudioGraph from 'virtual-audio-graph';

const calculateFrequency = (pitch) => 440 * Math.pow(2, pitch / 12);

const audioContext = new AudioContext();

const virtualAudioGraph = new VirtualAudioGraph({
  audioContext,
  destination: audioContext.destination,
});

export const playNote = (pitch) => {
  virtualAudioGraph.update([
    {
      connections: 0,
      id: 1,
      name: 'gain',
      params: {
        gain: 0.2,
      }
    },
    {
      connections: 1,
      id: 2,
      name: 'oscillator',
      params: {
        detune: 5,
        frequency: calculateFrequency(pitch) / 2,
        type: 'sawtooth',
      },
    },
    {
      connections: 1,
      id: 3,
      name: 'oscillator',
      params: {
        frequency: calculateFrequency(pitch + 7),
        type: 'triangle',
      },
    },
  ]);
}

export const stopNote = () => {
  virtualAudioGraph.update([
    {
      connections: 0,
      id: 1,
      name: 'gain',
      params: {
        gain: 0.2,
      }
    },
  ]);
}
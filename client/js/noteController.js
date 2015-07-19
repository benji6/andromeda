import {append, propEq, reject} from 'ramda';
import Random from 'random-js';
import alt from './alt';
import virtualAudioGraph from './virtualAudioGraph';

const calculateFrequency = (pitch) => 440 * Math.pow(2, pitch / 12);
const pickRandom = (arr) => Random.pick(Random.engines.browserCrypto, arr);

const bpm = 140;
const beatDuration = 60 / bpm / 2;

let currentVirtualAudioGraph = [];
let intervalId = null;
let lastStartTime = null;
let lastStopTime = null;

const incrementPitch = (pitch, increment) => {
  const scale = alt.getStore('ScaleStore').getState().scales[alt.getStore('ScaleStore').getState().scaleName];
  let index = scale.indexOf(pitch) + increment;
  if (index > scale.length - 1) {
    return scale[index - scale.length] + 12;
  }
  return scale[index];
};

const createInstrumentCustomNodeParams = (pitch, id, rootNote, modulation, startTime, stopTime) => {
  let octave = 1;
  if (alt.getStore('ArpeggiatorStore').getState().arpeggiatorIsOn &&
      alt.getStore('ScaleStore').getState().scaleName !== 'none') {
    octave = pickRandom([1, 2]);
    pitch = pickRandom([pitch, incrementPitch(pitch, 2), incrementPitch(pitch, 5)]);
  }
  const instrumentCustomNodeParams = {
    output: ['output', 0],
    id,
    node: alt.getStore('InstrumentStore').getState().selectedInstrument,
    params: {
      frequency: calculateFrequency(pitch + rootNote) * octave,
      gain: (1 - modulation) / 4,
    },
  };

  if (startTime) {
    instrumentCustomNodeParams.params.startTime = startTime;
  }
  if (stopTime) {
    instrumentCustomNodeParams.params.stopTime = stopTime;
  }
  return instrumentCustomNodeParams;
};

export const playNote = ({id, pitch, modulation = 0.5}) => {
  const EffectStore = alt.getStore('EffectStore');
  const RootNoteStore = alt.getStore('RootNoteStore');
  const rootNote = RootNoteStore.getState().rootNote;

  currentVirtualAudioGraph[0] = {
    output: 'output',
    id: 0,
    node: EffectStore.getState().selectedEffect,
  };

  currentVirtualAudioGraph = reject(propEq(id, 'id'), currentVirtualAudioGraph);

  if (alt.getStore('ArpeggiatorStore').getState().arpeggiatorIsOn &&
      alt.getStore('ScaleStore').getState().scaleName !== 'none') {
    clearInterval(intervalId);

    const scheduleEvents = () => {
      const startTime = Math.ceil(virtualAudioGraph.currentTime * 10) / 10;
      if (startTime === lastStartTime) {
        return;
      }
      lastStartTime = startTime;

      const stopTime = startTime + beatDuration / 2;
      if (startTime <= lastStopTime) {
        return;
      }
      lastStopTime = stopTime;

      currentVirtualAudioGraph = reject(propEq(id, 'id'), currentVirtualAudioGraph);
      currentVirtualAudioGraph = append(createInstrumentCustomNodeParams(pitch, id, rootNote, modulation, startTime, stopTime), currentVirtualAudioGraph);
      virtualAudioGraph.update(currentVirtualAudioGraph);
    };

    scheduleEvents();

    intervalId = setInterval(scheduleEvents, 90);
  } else {
    currentVirtualAudioGraph = append(createInstrumentCustomNodeParams(pitch, id, rootNote, modulation), currentVirtualAudioGraph);
    virtualAudioGraph.update(currentVirtualAudioGraph);
  }
};

export const stopNote = ({id}) => {
  if (alt.getStore('ArpeggiatorStore').getState().arpeggiatorIsOn &&
      alt.getStore('ScaleStore').getState().scaleName !== 'none') {
    clearInterval(intervalId);
  }
  lastStartTime = null;
  lastStopTime = null;
  currentVirtualAudioGraph = reject(propEq(id, 'id'), currentVirtualAudioGraph);
  virtualAudioGraph.update(currentVirtualAudioGraph);
};

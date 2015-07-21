import {append, dropLast, propEq, reject} from 'ramda';
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

const incrementScalePitch = (pitch, increment) => {
  const scale = alt.getStore('ScaleStore').getState().scales[alt.getStore('ScaleStore').getState().scaleName];
  const scaleWithNoRepeats = dropLast(1, scale);
  if (scaleWithNoRepeats.indexOf(pitch % 12) === -1) {
    return pitch;
  }
  return (function recur (index, pitchIncrement) {
    const scaleLength = scaleWithNoRepeats.length;
    if (index >= scaleLength) {
      return recur(index - scaleLength, pitchIncrement + 12);
    }
    return scaleWithNoRepeats[index] + pitchIncrement;
  }(scaleWithNoRepeats.indexOf(pitch % 12) + increment, Math.floor(pitch / 12) * 12));
};

let currentIndex = 0;
let ascending = true;

const createInstrumentCustomNodeParams = (pitch, id, rootNote, modulation, startTime, stopTime) => {
  if (alt.getStore('ArpeggiatorStore').getState().arpeggiatorIsOn &&
      alt.getStore('ScaleStore').getState().scaleName !== 'none') {
    const arpeggiatorPitches = [
      incrementScalePitch(pitch, 0),
      incrementScalePitch(pitch, 2),
      incrementScalePitch(pitch, 4),
      incrementScalePitch(pitch, 7),
      incrementScalePitch(pitch, 9),
      incrementScalePitch(pitch, 11),
    ];
    if (alt.getStore('ArpeggiatorStore').getState().selectedPattern === 'random') {
      pitch = pickRandom(arpeggiatorPitches);
    }
    if (alt.getStore('ArpeggiatorStore').getState().selectedPattern === 'up') {
      ascending = true;
    }
    if (alt.getStore('ArpeggiatorStore').getState().selectedPattern === 'down') {
      ascending = false;
    }
    if (alt.getStore('ArpeggiatorStore').getState().selectedPattern === 'up and down') {
      if (currentIndex === 0) {
        ascending = true;
      }
      if (currentIndex === arpeggiatorPitches.length - 1) {
        ascending = false;
      }
    }
    if (ascending) {
      pitch = arpeggiatorPitches[currentIndex];
      currentIndex = ++currentIndex === arpeggiatorPitches.length ?
        0 :
        currentIndex;
    } else {
      currentIndex = currentIndex === 0 ?
        arpeggiatorPitches.length - 1 :
        --currentIndex;
      pitch = arpeggiatorPitches[currentIndex];
    }
  }
  const instrumentCustomNodeParams = {
    output: ['output', 0],
    id,
    node: alt.getStore('InstrumentStore').getState().selectedInstrument,
    params: {
      frequency: calculateFrequency(pitch + rootNote),
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
  const rootNote = alt.getStore('RootNoteStore').getState().rootNote;

  currentVirtualAudioGraph[0] = {
    output: 'output',
    id: 0,
    node: alt.getStore('EffectStore').getState().selectedEffect,
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
  currentIndex = 0;
  lastStartTime = null;
  lastStopTime = null;
  currentVirtualAudioGraph = reject(propEq(id, 'id'), currentVirtualAudioGraph);
  virtualAudioGraph.update(currentVirtualAudioGraph);
};

import {compose, dropLast, map, reject, tap} from 'ramda';
import Random from 'random-js';
import alt from './alt';
import virtualAudioGraph from './virtualAudioGraph';
import {stream, transduce} from 'flyd';

const calculateFrequency = (pitch) => 440 * 2 ** (pitch / 12);
const pickRandom = (arr) => Random.pick(Random.engines.browserCrypto, arr);

const bpm = 140;
const beatDuration = 60 / bpm / 2;

let currentVirtualAudioGraph = {};
let intervalId = null;
let lastStartTime = null;

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
  const {arpeggiatorIsOn,
         selectedPattern} = alt.getStore('ArpeggiatorStore').getState();

  if (arpeggiatorIsOn &&
      alt.getStore('ScaleStore').getState().scaleName !== 'none') {
    const arpeggiatorPitches = [
      incrementScalePitch(pitch, 0),
      incrementScalePitch(pitch, 2),
      incrementScalePitch(pitch, 4),
      incrementScalePitch(pitch, 7),
      incrementScalePitch(pitch, 9),
      incrementScalePitch(pitch, 11),
    ];
    if (selectedPattern === 'up') {
      ascending = true;
    } else if (selectedPattern === 'down') {
      ascending = false;
    } else if (selectedPattern === 'up and down') {
      if (currentIndex === 0) {
        ascending = true;
      } else if (currentIndex === arpeggiatorPitches.length - 1) {
        ascending = false;
      }
    }

    if (selectedPattern === 'random') {
      pitch = pickRandom(arpeggiatorPitches);
    } else {
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
  }
  const instrumentCustomNodeParams = {
    output: ['output', 0],
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

const computeNextStartTime = t => Math.ceil(t * 10) / 10;
const computeNextStopTime = t => computeNextStartTime(t) + beatDuration;

export const playNote = ({id, pitch, modulation = 0.5}) => {
  const rootNote = alt.getStore('RootNoteStore').getState().rootNote;

  currentVirtualAudioGraph[0] = {
    output: 'output',
    node: alt.getStore('EffectStore').getState().selectedEffect,
  };

  delete currentVirtualAudioGraph[id];

  if (alt.getStore('ArpeggiatorStore').getState().arpeggiatorIsOn &&
      alt.getStore('ScaleStore').getState().scaleName !== 'none') {
    clearInterval(intervalId);

    const scheduleEventsStream = stream();

    transduce(compose(map(computeNextStartTime),
                      reject(startTime => startTime === lastStartTime),
                      map(tap(startTime => lastStartTime = startTime)),
                      map(startTime => ({startTime, stopTime: computeNextStopTime(startTime)})),
                      map(tap(({startTime, stopTime}) =>
                        currentVirtualAudioGraph[id] = createInstrumentCustomNodeParams(pitch,
                                                                                        id,
                                                                                        rootNote,
                                                                                        modulation,
                                                                                        startTime,
                                                                                        stopTime))),
                      map(() => virtualAudioGraph.update(currentVirtualAudioGraph))),
              scheduleEventsStream);

    scheduleEventsStream(virtualAudioGraph.currentTime);
    intervalId = setInterval(() => scheduleEventsStream(virtualAudioGraph.currentTime),
                             80);
  } else {
    currentVirtualAudioGraph[id] = createInstrumentCustomNodeParams(pitch,
                                                                    id,
                                                                    rootNote,
                                                                    modulation);
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
  delete currentVirtualAudioGraph[id];
  virtualAudioGraph.update(currentVirtualAudioGraph);
};

import {compose, dissoc, map, reject, tap} from 'ramda';
import store from './store';
import virtualAudioGraph from './virtualAudioGraph';
import createInstrumentCustomNodeParams, {resetArpeggiator} from './tools/createInstrumentCustomNodeParams';

const {Observable, Subject} = Rx;

const {interval} = Observable;
const getState = ::store.getState;

const noteDuration = () => 60 / getState().bpm / 4;

const getVirtualNodeId = (() => {
  let currentId = 0;
  return id => {
    currentId = currentId >= 3 ? 0 : currentId + 1;
    return `${id}-${currentId}`;
  };
}());

let currentVirtualAudioGraph = {};
let lastStartTime = null;
const arpStop$ = new Subject();
arpStop$.subscribe();

const computeNextStartTime = currentTime => Math.ceil(currentTime / noteDuration()) * noteDuration();

export const playNote = ({id, instrument, pitch, modulation = 0.5}) => {
  const {arpeggiator, effect, rootNote, scale} = getState();

  currentVirtualAudioGraph = {...currentVirtualAudioGraph,
                              0: [effect.selectedEffect, 'output']};

  if (arpeggiator.arpeggiatorIsOn && scale.scaleName !== 'none') {
    arpStop$.onNext();
    interval(noteDuration())
      .transduce(compose(map(() => virtualAudioGraph.currentTime),
                         map(computeNextStartTime),
                         reject(startTime => startTime === lastStartTime),
                         map(tap(startTime => lastStartTime = startTime)),
                         map(startTime => ({startTime, stopTime: startTime + noteDuration()})),
                         reject(({stopTime}) => stopTime < virtualAudioGraph.currentTime),
                         map(({startTime, stopTime}) =>
                           currentVirtualAudioGraph = {...currentVirtualAudioGraph,
                                                       [getVirtualNodeId(id)]: createInstrumentCustomNodeParams({pitch, id, rootNote, modulation, startTime, stopTime, instrument})}),
                         map(() => virtualAudioGraph.update(currentVirtualAudioGraph))))
      .takeUntil(arpStop$)
      .subscribe();
  } else {
    currentVirtualAudioGraph = {...currentVirtualAudioGraph,
                                [id]: createInstrumentCustomNodeParams({pitch, id, instrument, rootNote, modulation})};
    virtualAudioGraph.update(currentVirtualAudioGraph);
  }
};

export const stopNote = ({id}) => {
  const {arpeggiator, scale} = getState();
  if (arpeggiator.arpeggiatorIsOn && scale.scaleName !== 'none') {
    arpStop$.onNext();
    resetArpeggiator();
    lastStartTime = null;
  }
  currentVirtualAudioGraph = dissoc(id, currentVirtualAudioGraph);
  virtualAudioGraph.update(currentVirtualAudioGraph);
};

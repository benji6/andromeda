import {compose, contains, dissoc, filter, forEach, map, reject, tap} from 'ramda';
import store from './store';
import virtualAudioGraph from './virtualAudioGraph';
import createInstrumentCustomNodeParams, {resetArpeggiator} from './audioHelpers/createInstrumentCustomNodeParams';
import computeAudioGraph from './audioHelpers/computeAudioGraph';

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

let currentAudioGraph = {};
let lastStartTime = null;
const arpStop$ = new Subject();
arpStop$.subscribe();

const computeNextStartTime = currentTime => Math.ceil(currentTime / noteDuration()) * noteDuration();

export const playNote = ({id, instrument = 'sine', pitch, modulation = 0.5}) => {
  const {arpeggiator, channels, rootNote, scale} = getState();
  const relevantChannels = filter(({sources}) => contains(instrument,
                                                          sources),
                                  channels);
  const sourcesAndEffects = map(({effects, sources}) => ({effects, sources}),
                                relevantChannels);
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
                           currentAudioGraph = {...currentAudioGraph,
                                                       [getVirtualNodeId(id)]: createInstrumentCustomNodeParams({pitch, id, rootNote, modulation, startTime, stopTime, instrument})}),
                         map(() => virtualAudioGraph.update(currentAudioGraph))))
      .takeUntil(arpStop$)
      .subscribe();
    return;
  }

  forEach(({sources, effects}) => currentAudioGraph = computeAudioGraph({arpeggiator,
                                                                         currentAudioGraph,
                                                                         effects,
                                                                         id,
                                                                         instrument,
                                                                         modulation,
                                                                         pitch,
                                                                         rootNote,
                                                                         sources}),
          sourcesAndEffects);

  virtualAudioGraph.update(currentAudioGraph);
};

export const stopNote = ({id}) => {
  const {arpeggiator, scale} = getState();
  if (arpeggiator.arpeggiatorIsOn && scale.scaleName !== 'none') {
    arpStop$.onNext();
    resetArpeggiator();
    lastStartTime = null;
  }
  currentAudioGraph = dissoc(id, currentAudioGraph);
  virtualAudioGraph.update(currentAudioGraph);
};

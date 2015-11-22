import {compose, contains, filter, forEach, map, reject, tap} from 'ramda';
import store, {dispatch} from './store';
import audioContext from './audioContext';
import createInstrumentCustomNodeParams, {resetArpeggiator} from './audioHelpers/createInstrumentCustomNodeParams';
import computeAudioGraph from './audioHelpers/computeAudioGraph';
import {mergeIntoAudioGraph} from './actions';

const {Observable: interval, Subject} = Rx;

const getState = ::store.getState;
const dispatchMergeIntoAudioGraph = compose(dispatch, mergeIntoAudioGraph);

const noteDuration = () => 60 / getState().bpm / 4;

const getVirtualNodeId = (() => {
  let currentId = 0;
  return id => {
    currentId = currentId >= 3 ? 0 : currentId + 1;
    return `${id}-${currentId}`;
  };
}());

let lastStartTime = null;
const arpStop$ = new Subject();
arpStop$.subscribe();

const computeNextStartTime = currentTime => Math.ceil(currentTime / noteDuration()) * noteDuration();

export const playNote = ({id, instrument, pitch, modulation = 0.5}) => {
  const {arpeggiator, channels, rootNote, scale} = getState();
  const relevantChannels = filter(({sources}) => contains(instrument,
                                                          sources),
                                  channels);
  if (!relevantChannels.length) {
    dispatchMergeIntoAudioGraph(computeAudioGraph({arpeggiator,
                                                   effects: ['none'],
                                                   id,
                                                   instrument,
                                                   modulation,
                                                   pitch,
                                                   rootNote,
                                                   sources: [instrument]}))
    return;
  }
  const sourcesAndEffects = map(({effects, sources}) => ({effects, sources}),
                                relevantChannels);
  if (arpeggiator.arpeggiatorIsOn && scale.scaleName !== 'none') {
    arpStop$.onNext();
    interval(noteDuration())
      .transduce(compose(map(() => audioContext.currentTime),
                         map(computeNextStartTime),
                         reject(startTime => startTime === lastStartTime),
                         map(tap(startTime => lastStartTime = startTime)),
                         map(startTime => ({startTime, stopTime: startTime + noteDuration()})),
                         reject(({stopTime}) => stopTime < audioContext.currentTime),
                         map(({startTime, stopTime}) => ({[getVirtualNodeId(id)]: createInstrumentCustomNodeParams({pitch, id, rootNote, modulation, startTime, stopTime, instrument})}))),
                         map(dispatchMergeIntoAudioGraph))
      .takeUntil(arpStop$)
      .subscribe();
    return;
  }

  forEach(({sources, effects}) => dispatchMergeIntoAudioGraph(computeAudioGraph({arpeggiator,
                                                                                 effects,
                                                                                 id,
                                                                                 instrument,
                                                                                 modulation,
                                                                                 pitch,
                                                                                 rootNote,
                                                                                 sources})),
          sourcesAndEffects);
};

// this is being deprecated
export const stopNote = () => {
  const {arpeggiator, scale} = getState();
  if (arpeggiator.arpeggiatorIsOn && scale.scaleName !== 'none') {
    arpStop$.onNext();
    resetArpeggiator();
    lastStartTime = null;
  }
};

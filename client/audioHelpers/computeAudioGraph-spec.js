import test from 'tape';
import computeAudioGraph from './computeAudioGraph';
import {initialState as effects} from '../reducers/effects';
import {initialState as arpeggiator} from '../reducers/arpeggiator';
import {defaultChannel} from '../reducers/channels';

test('computeAudioGraph', t => {
  t.deepEquals(computeAudioGraph({arpeggiator,
                                  effects,
                                  id: 'test id',
                                  instrument: 'sine',
                                  modulation: 0.5,
                                  pitch: 4,
                                  rootNote: 1,
                                  sources: defaultChannel.sources,
                                  startTime: 34,
                                  stopTime: 78}),
               {'test id-sine-4-0': ['pingPongDelay', 'output'],
                'test id-sine-4-1': ['none', 'test id-sine-4-0'],
                'test id-sine-4-2': ['sine', 'test id-sine-4-1', {frequency: 587.3295358348151,
                                                                  gain: 0.125,
                                                                  startTime: 34,
                                                                  stopTime: 78}]});
  t.deepEquals(computeAudioGraph({arpeggiator,
                                  effects,
                                  id: 'test id',
                                  instrument: 'sine',
                                  modulation: 0.5,
                                  pitch: 4,
                                  rootNote: 1,
                                  sources: defaultChannel.sources}),
               {'test id-sine-4-0': ['pingPongDelay', 'output'],
                'test id-sine-4-1': ['none', 'test id-sine-4-0'],
                'test id-sine-4-2': ['sine', 'test id-sine-4-1', {frequency: 587.3295358348151,
                                                                  gain: 0.125}]});
  t.end();
});

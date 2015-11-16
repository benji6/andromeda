import test from 'tape';
import createInstrumentCustomNodeParams from './createInstrumentCustomNodeParams';
import {initialState} from '../reducers/scale';
import {initialState as arpeggiator} from '../reducers/arpeggiator';

const majorScale = initialState.scales.major;

test('createEffectCustomNodeParams', t => {
  t.deepEquals(createInstrumentCustomNodeParams({effectsLength: 4,
                                                 modulation: 0.5,
                                                 pitch: 9,
                                                 scale: majorScale,
                                                 arpeggiator,
                                                 startTime: 64,
                                                 stopTime: 65})('testInstrument', 0),
               ['testInstrument', 3, {frequency: 739.9888454232688,
                                      gain: 0.125,
                                      startTime: 64,
                                      stopTime: 65}]);
  t.deepEquals(createInstrumentCustomNodeParams({effectsLength: 4,
                                                 modulation: 0.5,
                                                 pitch: 9,
                                                 scale: majorScale,
                                                 arpeggiator})('testInstrument', 0),
               ['testInstrument', 3, {frequency: 739.9888454232688,
                                      gain: 0.125}]);
  t.end();
});

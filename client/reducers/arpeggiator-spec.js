import test from 'tape';
import reducer, {initialState} from './arpeggiator';
import {updateArpeggiatorIsOn, updateSelectedPattern} from '../actions';

test('arpeggiator reducer returns initial state', t => {
  t.deepEqual(reducer(undefined, {}), initialState);
  t.deepEqual(reducer(undefined, {}), initialState);
  t.end();
});

test('arpeggiator reducer updates state', t => {
  t.deepEqual(reducer(undefined, updateArpeggiatorIsOn(true)),
              {...initialState, arpeggiatorIsOn: true});
  t.deepEqual(reducer(undefined, updateSelectedPattern('down')),
              {...initialState, selectedPattern: 'down'});
  t.end();
});

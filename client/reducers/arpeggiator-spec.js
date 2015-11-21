import test from 'tape';
import reducer, {initialState} from './arpeggiator';
import {updateArpeggiatorIsOn, updateSelectedPattern} from '../actions';

const reducerName = 'arpeggiator';

test(`${reducerName} reducer returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), initialState);
  t.deepEqual(reducer(undefined, {}), initialState);
  t.end();
});

test(`${reducerName} reducer returns updateArpeggiatorIsOn`, t => {
  t.deepEqual(reducer(undefined, updateArpeggiatorIsOn(true)),
              {...initialState, arpeggiatorIsOn: true});
  t.end();
});
test(`${reducerName} reducer returns updateArpeggiatorIsOn`, t => {
  t.deepEqual(reducer(undefined, updateSelectedPattern('down')),
              {...initialState, selectedPattern: 'down'});
  t.end();
});

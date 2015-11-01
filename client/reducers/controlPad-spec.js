import test from 'tape';
import reducer, {initialState} from './controlPad';
import {updateControlPadInstrument} from '../actions';

const reducerName = 'controlPad';

test(`${reducerName} reducer returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), initialState);
  t.deepEqual(reducer(undefined, {}), initialState);
  t.end();
});

test(`${reducerName} reducer updateControlPadChannel`, t => {
  const testVal = 'piano';
  t.deepEqual(reducer(undefined, updateControlPadInstrument(testVal)),
              {...initialState, instrument: testVal});
  t.end();
});

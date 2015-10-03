import test from 'tape';
import reducer, {initialState} from './instrument';
import {updateSelectedInstrument} from '../actions';

test('rootNote reducer returns initial state', t => {
  t.deepEqual(reducer(undefined, {}), initialState);
  t.deepEqual(reducer(undefined, {}), initialState);
  t.end();
});

test('rootNote reducer updates root note', t => {
  t.deepEqual(reducer(undefined, updateSelectedInstrument('detuned')),
              {...initialState, selectedInstrument: 'detuned'});
  t.end();
});

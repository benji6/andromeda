import test from 'tape';
import reducer, {initialState} from './bpm';
import {updateBpm} from '../actions';

test('bpm reducer returns initial state', t => {
  t.deepEqual(reducer(undefined, {}), initialState);
  t.deepEqual(reducer(undefined, {}), initialState);
  t.end();
});

test('bpm reducer updates state', t => {
  t.deepEqual(reducer(undefined, updateBpm(180)),
              180);
  t.end();
});

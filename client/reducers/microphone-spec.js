import test from 'tape';
import reducer, {initialState} from './microphone';
import {updateMicrophoneIsAvailable,
        updateMicrophoneIsOn} from '../actions';

const reducerName = 'microphone';

test(`${reducerName} reducer returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), initialState);
  t.deepEqual(reducer(undefined, {}), initialState);
  t.end();
});

test(`${reducerName} reducer updates isOn`, t => {
  t.deepEqual(reducer(undefined, updateMicrophoneIsAvailable(true)),
              {...initialState, isAvailable: true});
  t.end();
});

test(`${reducerName} reducer updates isAvailable`, t => {
  t.deepEqual(reducer(undefined, updateMicrophoneIsOn(true)),
              {...initialState, isOn: true});
  t.end();
});

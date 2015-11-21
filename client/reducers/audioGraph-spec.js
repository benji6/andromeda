import test from 'tape';
import reducer, {initialState} from './audioGraph';
import {mergeIntoAudioGraph, removeKeysFromAudioGraphContaining} from '../actions';

const reducerName = 'audioGraph';

test(`${reducerName} reducer returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), initialState);
  t.deepEqual(reducer(undefined, {}), initialState);
  t.end();
});

test(`${reducerName} reducer mergeIntoAudioGraph`, t => {
  t.deepEqual(reducer(undefined, mergeIntoAudioGraph({someKey: 'someNote'})),
              {someKey: 'someNote'});
  t.end();
});

test(`${reducerName} reducer stopNotesWithId`, t => {
  t.deepEqual(reducer({aaa: 'someNote',
                       'someKey-sdfuisofhshfdushu': 'someNote',
                       'someKey-sdfuisofhshfdu': 'someNote'}, removeKeysFromAudioGraphContaining('someKey')),
              {aaa: 'someNote'});
  t.end();
});

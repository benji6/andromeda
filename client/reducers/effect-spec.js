import test from 'tape';
import reducer, {initialState} from './effect';
import {addEffect,
        updateSelectedEffect} from '../actions';

const reducerName = 'effect';

test(`${reducerName} reducer returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), initialState);
  t.deepEqual(reducer(undefined, {}), initialState);
  t.end();
});

test(`${reducerName} reducer updates selectedEffect state`, t => {
  t.deepEqual(reducer(undefined, updateSelectedEffect('pingPongDelay')),
              {...initialState, selectedEffect: 'pingPongDelay'});
  t.end();
});

test(`${reducerName} reducer - adding an effect`, t => {
  t.deepEqual(reducer(undefined, addEffect('awesomeEffect')),
              {...initialState, effects: [...initialState.effects, 'awesomeEffect']});
  t.end();
});

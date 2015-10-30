import test from 'tape';
import reducer, {initialState} from './channels';
import {moveChannelSourceDown,
        moveChannelSourceUp,
        moveEffectSourceDown,
        moveEffectSourceUp,
        removeChannelSource,
        removeChannelEffect} from '../actions';

const reducerName = 'channels';

test(`${reducerName} reducer returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), initialState);
  t.deepEqual(reducer(undefined, {}), initialState);
  t.end();
});

test(`${reducerName} reducer moveChannelSourceDown`, t => {
  const channelId = 0;
  const sourceId = 0;
  const value = {channelId, sourceId};
  const channel = initialState[channelId];
  const {sources} = channel;
  t.deepEqual(reducer(undefined, moveChannelSourceDown(value)),
              [...initialState.slice(0, channelId),
               {...channel, sources: [...sources.slice(0, sourceId),
                                      sources[sourceId + 1],
                                      sources[sourceId],
                                      ...sources.slice(sourceId + 2)]},
               ...initialState.slice(channelId + 1)]);
  t.end();
});

test(`${reducerName} reducer moveChannelSourceUp`, t => {
  const channelId = 0;
  const sourceId = 0;
  const value = {channelId, sourceId};
  const channel = initialState[channelId];
  const {sources} = channel;
  t.deepEqual(reducer(undefined, moveChannelSourceUp(value)),
              [...initialState.slice(0, channelId),
               {...channel, sources: [...sources.slice(0, sourceId - 1),
                                      sources[sourceId],
                                      sources[sourceId - 1],
                                      ...sources.slice(sourceId + 1)]},
               ...initialState.slice(channelId + 1)]);
  t.end();
});

test(`${reducerName} reducer moveEffectSourceDown`, t => {
  const channelId = 0;
  const effectId = 0;
  const value = {channelId, effectId};
  const channel = initialState[channelId];
  const {effects} = channel;
  t.deepEqual(reducer(undefined, moveEffectSourceDown(value)),
              [...initialState.slice(0, channelId),
               {...channel, effects: [...effects.slice(0, effectId),
                                      effects[effectId + 1],
                                      effects[effectId],
                                      ...effects.slice(effectId + 2)]},
               ...initialState.slice(channelId + 1)]);
  t.end();
});

test(`${reducerName} reducer moveEffectSourceUp`, t => {
  const channelId = 0;
  const effectId = 0;
  const value = {channelId, effectId};
  const channel = initialState[channelId];
  const {effects} = channel;
  t.deepEqual(reducer(undefined, moveEffectSourceUp(value)),
              [...initialState.slice(0, channelId),
               {...channel, effects: [...effects.slice(0, effectId - 1),
                                      effects[effectId],
                                      effects[effectId - 1],
                                      ...effects.slice(effectId + 1)]},
               ...initialState.slice(channelId + 1)]);
  t.end();
});

test(`${reducerName} reducer removeChannelSource`, t => {
  const channelId = 0;
  const sourceId = 0;
  const value = {channelId, sourceId};
  const channel = initialState[channelId];
  const {sources} = channel;
  t.deepEqual(reducer(undefined, removeChannelSource(value)),
              [...initialState.slice(0, channelId),
               {...channel, sources: [...sources.slice(0, sourceId),
                                      ...sources.slice(sourceId + 1)]},
               ...initialState.slice(channelId + 1)]);
  t.end();
});

test(`${reducerName} reducer removeChannelEffect`, t => {
  const channelId = 0;
  const effectId = 0;
  const value = {channelId, effectId};
  const channel = initialState[channelId];
  const {effects} = channel;
  t.deepEqual(reducer(undefined, removeChannelEffect(value)),
              [...initialState.slice(0, channelId),
               {...channel, effects: [...effects.slice(0, effectId),
                                      ...effects.slice(effectId + 1)]},
               ...initialState.slice(channelId + 1)]);
  t.end();
});

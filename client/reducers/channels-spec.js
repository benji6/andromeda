import test from 'tape';
import reducer, {defaultChannel, initialState} from './channels';
import {addChannel,
        addChannelEffect,
        addChannelSource,
        moveChannelSourceDown,
        moveChannelSourceUp,
        moveChannelEffectDown,
        moveChannelEffectUp,
        removeChannel,
        removeChannelSource,
        removeChannelEffect,
        updateSelectedAddEffect,
        updateSelectedAddSource} from '../actions';

const reducerName = 'channels';

test(`${reducerName} reducer returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), initialState);
  t.deepEqual(reducer(undefined, {}), initialState);
  t.end();
});

test(`${reducerName} reducer addChannel`, t => {
  t.deepEqual(reducer(undefined, addChannel()),
              [...initialState,
               defaultChannel]);
  t.end();
});

test(`${reducerName} reducer addChannelSource`, t => {
  const channelId = 0;
  const source = 'testVal';
  const value = {channelId, source};
  const channel = initialState[channelId];
  const {sources} = channel;
  t.deepEqual(reducer(undefined, addChannelSource(value)),
              [...initialState.slice(0, channelId),
               {...channel, sources: [...sources, source]},
               ...initialState.slice(channelId + 1)]);
  t.end();
});

test(`${reducerName} reducer addChannelEffect`, t => {
  const channelId = 0;
  const effect = 'testVal';
  const value = {channelId, effect};
  const channel = initialState[channelId];
  const {effects} = channel;
  t.deepEqual(reducer(undefined, addChannelEffect(value)),
              [...initialState.slice(0, channelId),
               {...channel, effects: [...effects, effect]},
               ...initialState.slice(channelId + 1)]);
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
  t.deepEqual(reducer(undefined, moveChannelEffectDown(value)),
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
  t.deepEqual(reducer(undefined, moveChannelEffectUp(value)),
              [...initialState.slice(0, channelId),
               {...channel, effects: [...effects.slice(0, effectId - 1),
                                      effects[effectId],
                                      effects[effectId - 1],
                                      ...effects.slice(effectId + 1)]},
               ...initialState.slice(channelId + 1)]);
  t.end();
});

test(`${reducerName} reducer removeChannel `, t => {
  const value = 0;
  t.deepEqual(reducer(undefined, removeChannel(value)),
              [...initialState.slice(0, value),
               ...initialState.slice(value + 1)]);
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

test(`${reducerName} reducer updateSelectedAddSource`, t => {
  const channelId = 0;
  const selectedAddSource = 'testVal';
  const value = {channelId, selectedAddSource};
  const channel = initialState[channelId];
  t.deepEqual(reducer(undefined, updateSelectedAddSource(value)),
              [...initialState.slice(0, channelId),
               {...channel, selectedAddSource},
               ...initialState.slice(channelId + 1)]);
  t.end();
});

test(`${reducerName} reducer updateSelectedAddEffect`, t => {
  const channelId = 0;
  const selectedAddEffect = 'testVal';
  const value = {channelId, selectedAddEffect};
  const channel = initialState[channelId];
  t.deepEqual(reducer(undefined, updateSelectedAddEffect(value)),
              [...initialState.slice(0, channelId),
               {...channel, selectedAddEffect},
               ...initialState.slice(channelId + 1)]);
  t.end();
});

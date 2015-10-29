import test from 'tape';
import reducer, {initialState} from './channels';
import {removeChannelSource,
        removeChannelEffect} from '../actions';

const reducerName = 'channels';

test(`${reducerName} reducer returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), initialState);
  t.deepEqual(reducer(undefined, {}), initialState);
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
  const {sources} = channel;
  t.deepEqual(reducer(undefined, removeChannelEffect(value)),
              [...initialState.slice(0, channelId),
               {...channel, effects: [...sources.slice(0, effectId),
                                      ...sources.slice(effectId + 1)]},
               ...initialState.slice(channelId + 1)]);
  t.end();
});

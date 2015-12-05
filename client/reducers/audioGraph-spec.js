import test from 'tape';
import reducer, {computeInitialState, initialState} from './audioGraph';
import {
  addAudioGraphSource,
  addChannelEffect,
  moveChannelEffectDown,
  moveChannelEffectUp,
  removeChannel,
  removeChannelEffect,
  removeKeysFromAudioGraphContaining,
} from '../actions';

const reducerName = 'audioGraph';

test(`${reducerName} computeInitialState`, t => {
  const defaultChannel = {effects: [{id: 0, name: 'none'}, {id: 1, name: 'pingPongDelay'}],
                          selectedAddEffect: 'pingPongDelay',
                          selectedAddSource: 'detuned',
                          sources: ['sine']};

  const channelsState = [{...defaultChannel, sources: ['detuned']},
                         defaultChannel];
  t.deepEqual(computeInitialState(channelsState), {
    'channel:0-type:effect-id:0': ['none', 'output'],
    'channel:0-type:effect-id:1': ['pingPongDelay', 'channel:0-type:effect-id:0'],
    'channel:1-type:effect-id:0': ['none', 'output'],
    'channel:1-type:effect-id:1': ['pingPongDelay', 'channel:1-type:effect-id:0'],
  });
  t.end();
});

test(`${reducerName} reducer returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), initialState);
  t.deepEqual(reducer(undefined, {}), initialState);
  t.end();
});

test(`${reducerName} reducer addAudioGraphSource`, t => {
  const instrument = 'some instrument'
  const params = {someParams: true}
  const id = 'some id'
  const value0 = {
    channelIds: [0],
    id,
    instrument,
    params,
  }
  t.deepEqual(reducer({'channel:0-type:effect-id:0': ['effect0', 'output'],
                       'channel:0-type:effect-id:1': ['effect1', 'channel:0-type:effect-id:0'],
                       'channel:0-type:effect-id:2': ['effect2', 'channel:0-type:effect-id:1'],
                       'channel:1-type:effect-id:10': ['effect0', 'output'],
                       'channel:[0]-type:source-id:0': ['source0', 'channel:0-type:effect-id:2', {a: 5}]},
                      addAudioGraphSource(value0)),
              {'channel:0-type:effect-id:0': ['effect0', 'output'],
               'channel:0-type:effect-id:1': ['effect1', 'channel:0-type:effect-id:0'],
               'channel:0-type:effect-id:2': ['effect2', 'channel:0-type:effect-id:1'],
               'channel:1-type:effect-id:10': ['effect0', 'output'],
               'channel:[0]-type:source-id:0': ['source0', 'channel:0-type:effect-id:2', {a: 5}],
               'channel:[0]-type:source-id:some id': [instrument, ['channel:0-type:effect-id:2'], params]})
  const value1 = {
    channelIds: [0, 1],
    id,
    instrument,
    params,
  }
  t.deepEqual(reducer({'channel:0-type:effect-id:0': ['effect0', 'output'],
                       'channel:0-type:effect-id:1': ['effect1', 'channel:0-type:effect-id:0'],
                       'channel:0-type:effect-id:2': ['effect2', 'channel:0-type:effect-id:1'],
                       'channel:1-type:effect-id:10': ['effect0', 'output'],
                       'channel:[0]-type:source-id:some id': ['source0', 'channel:0-type:effect-id:2', {a: 5}]},
                      addAudioGraphSource(value1)), {
    'channel:0-type:effect-id:0': ['effect0', 'output'],
    'channel:0-type:effect-id:1': ['effect1', 'channel:0-type:effect-id:0'],
    'channel:0-type:effect-id:2': ['effect2', 'channel:0-type:effect-id:1'],
    'channel:1-type:effect-id:10': ['effect0', 'output'],
    'channel:[0]-type:source-id:some id': ['source0', 'channel:0-type:effect-id:2', {a: 5}],
    'channel:[0 1]-type:source-id:some id': [
      instrument,
      ['channel:0-type:effect-id:2', 'channel:1-type:effect-id:10'],
      params,
    ],
  });
  t.end();
});

test(`${reducerName} reducer stopNotesWithId`, t => {
  t.deepEqual(reducer({aaa: 'someNote',
                       'someKey-sdfuisofhshfdushu': 'someNote',
                       'someKey-sdfuisofhshfdu': 'someNote'},
                      removeKeysFromAudioGraphContaining('someKey')),
              {aaa: 'someNote'});
  t.end();
});

test(`${reducerName} reducer addChannelEffect`, t => {
  t.deepEqual(reducer({'channel:0-type:effect-id:0': ['effect0', 'output'],
                       'channel:0-type:effect-id:1': ['effect1', 'channel:0-type:effect-id:0']},
                      addChannelEffect({channelId: 1,
                                        effect: 'effect2',
                                        effects: []})),
              {'channel:0-type:effect-id:0': ['effect0', 'output'],
               'channel:0-type:effect-id:1': ['effect1', 'channel:0-type:effect-id:0'],
               'channel:1-type:effect-id:0': ['effect2', 'output']});
  t.deepEqual(reducer({'channel:0-type:effect-id:0': ['effect0', 'output'],
                       'channel:0-type:effect-id:1': ['effect1', 'channel:0-type:effect-id:0']},
                      addChannelEffect({channelId: 0,
                                        effect: 'effect2',
                                        effects: [{id: 0}, {id: 1}]})),
              {'channel:0-type:effect-id:0': ['effect0', 'output'],
               'channel:0-type:effect-id:1': ['effect1', 'channel:0-type:effect-id:0'],
               'channel:0-type:effect-id:2': ['effect2', 'channel:0-type:effect-id:1']});
  t.deepEqual(reducer({'channel:0-type:effect-id:0': ['effect0', 'output'],
                       'channel:0-type:effect-id:1': ['effect1', 'channel:0-type:effect-id:0'],
                       'source-id:2': ['source0', 'channel:0-type:effect-id:1']},
                      addChannelEffect({channelId: 0,
                                        effect: 'effect2',
                                        effects: [{id: 0}, {id: 1}]})),
              {'channel:0-type:effect-id:0': ['effect0', 'output'],
               'channel:0-type:effect-id:1': ['effect1', 'channel:0-type:effect-id:0'],
               'channel:0-type:effect-id:2': ['effect2', 'channel:0-type:effect-id:1'],
               'source-id:2': ['source0', 'channel:0-type:effect-id:2']});
  t.end();
});

test(`${reducerName} reducer moveChannelEffectDown`, t => {
  t.deepEqual(reducer({'channel:0-type:effect-id:0': ['effect0', 'output'],
                       'channel:0-type:effect-id:1': ['effect1', 'channel:0-type:effect-id:0'],
                       'channel:0-type:effect-id:2': ['effect2', 'channel:0-type:effect-id:1']},
                        moveChannelEffectDown({channelId: 0, effectId: 0})),
              {'channel:0-type:effect-id:0': ['effect0', 'channel:0-type:effect-id:1'],
               'channel:0-type:effect-id:1': ['effect1', 'output'],
               'channel:0-type:effect-id:2': ['effect2', 'channel:0-type:effect-id:0']});
  t.deepEqual(reducer({'channel:0-type:effect-id:0': ['effect0', 'channel:0-type:effect-id:1'],
                       'channel:0-type:effect-id:1': ['effect1', 'output'],
                       'channel:0-type:effect-id:2': ['effect2', 'channel:0-type:effect-id:0']},
                        moveChannelEffectDown({channelId: 0, effectId: 0})),
              {'channel:0-type:effect-id:0': ['effect0', 'channel:0-type:effect-id:2'],
               'channel:0-type:effect-id:1': ['effect1', 'output'],
               'channel:0-type:effect-id:2': ['effect2', 'channel:0-type:effect-id:1']});
  t.end();
});

test(`${reducerName} reducer moveChannelEffectUp`, t => {
  t.deepEqual(reducer({'channel:0-type:effect-id:0': ['effect0', 'output'],
                       'channel:0-type:effect-id:1': ['effect1', 'channel:0-type:effect-id:0'],
                       'channel:0-type:effect-id:2': ['effect2', 'channel:0-type:effect-id:1']},
                        moveChannelEffectUp({channelId: 0, effectId: 2})),
              {'channel:0-type:effect-id:0': ['effect0', 'output'],
               'channel:0-type:effect-id:1': ['effect1', 'channel:0-type:effect-id:2'],
               'channel:0-type:effect-id:2': ['effect2', 'channel:0-type:effect-id:0']});
  t.deepEqual(reducer({'channel:0-type:effect-id:0': ['effect0', 'output'],
                       'channel:0-type:effect-id:1': ['effect1', 'channel:0-type:effect-id:2'],
                       'channel:0-type:effect-id:2': ['effect2', 'channel:0-type:effect-id:0']},
                        moveChannelEffectUp({channelId: 0, effectId: 2})),
              {'channel:0-type:effect-id:0': ['effect0', 'channel:0-type:effect-id:2'],
               'channel:0-type:effect-id:1': ['effect1', 'channel:0-type:effect-id:0'],
               'channel:0-type:effect-id:2': ['effect2', 'output']});
  t.end();
});

test(`${reducerName} reducer removeChannel`, t => {
  t.deepEqual(reducer({'channel:0-type:effect-id:0': ['effect0', 'output'],
                       'channel:0-type:effect-id:1': ['effect1', 'channel:0-type:effect-id:0'],
                       'channel:0-type:effect-id:2': ['effect2', 'channel:0-type:effect-id:1'],
                       'channel:1-type:effect-id:0': ['effect0', 'output'],
                       'channel:1-type:effect-id:1': ['effect1', 'channel:0-type:effect-id:0'],
                       'channel:1-type:effect-id:2': ['effect2', 'channel:0-type:effect-id:1']},
                        removeChannel(1)),
              {'channel:0-type:effect-id:0': ['effect0', 'output'],
               'channel:0-type:effect-id:1': ['effect1', 'channel:0-type:effect-id:0'],
               'channel:0-type:effect-id:2': ['effect2', 'channel:0-type:effect-id:1']});
  t.end();
});

test(`${reducerName} reducer removeChannelEffect`, t => {
  t.deepEqual(reducer({'channel:0-type:effect-id:0': ['effect0', 'output'],
                       'channel:0-type:effect-id:1': ['effect1', 'channel:0-type:effect-id:0'],
                       'channel:0-type:effect-id:2': ['effect2', 'channel:0-type:effect-id:1']},
                        removeChannelEffect({channelId: 0, effectId: 0})),
              {'channel:0-type:effect-id:1': ['effect1', 'output'],
               'channel:0-type:effect-id:2': ['effect2', 'channel:0-type:effect-id:1']});
  t.deepEqual(reducer({'channel:0-type:effect-id:0': ['effect0', 'output'],
                       'channel:0-type:effect-id:1': ['effect1', 'channel:0-type:effect-id:0'],
                       'channel:0-type:effect-id:2': ['effect2', 'channel:0-type:effect-id:1']},
                        removeChannelEffect({channelId: 0, effectId: 1})),
              {'channel:0-type:effect-id:0': ['effect0', 'output'],
               'channel:0-type:effect-id:2': ['effect2', 'channel:0-type:effect-id:0']});
  t.deepEqual(reducer({'channel:0-type:effect-id:0': ['effect0', 'output'],
                       'channel:0-type:effect-id:1': ['effect1', 'channel:0-type:effect-id:0'],
                       'channel:0-type:effect-id:2': ['effect2', 'channel:0-type:effect-id:1']},
                        removeChannelEffect({channelId: 0, effectId: 2})),
              {'channel:0-type:effect-id:0': ['effect0', 'output'],
               'channel:0-type:effect-id:1': ['effect1', 'channel:0-type:effect-id:0']});
  t.end();
});

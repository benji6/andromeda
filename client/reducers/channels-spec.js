import test from 'tape';
import reducer, {emptyChannel, initialState} from './channels';
import {addChannel,
        addChannelEffect,
        addChannelSource,
        moveChannelEffectDown,
        moveChannelEffectUp,
        removeChannel,
        removeChannelSource,
        removeChannelEffect,
        updateSelectedAddEffect,
        updateSelectedAddSource} from '../actions';

const reducerName = 'channels';

const testState = Object.freeze([
  {
    effects: [
      {id: 1, name: 'effect1'},
      {id: 90, name: 'effect90'},
    ],
    selectedAddEffect: 'pingPongDelay',
    selectedAddSource: 'fm',
    sources: ['sine'],
  },
  {
    effects: [
      {id: 100, name: 'effect100'},
      {id: 42, name: 'effect42'},
      {id: 99, name: 'effect99'},
    ],
    selectedAddEffect: 'pingPongDelay',
    selectedAddSource: 'fm',
    sources: ['sine'],
  },
])

test(`${reducerName} reducer returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), initialState);
  t.deepEqual(reducer(undefined, {}), initialState);
  t.end();
});

test(`${reducerName} reducer addChannel`, t => {
  t.deepEqual(reducer(undefined, addChannel()),
              [...initialState,
               emptyChannel]);
  t.end();
});

test(`${reducerName} reducer addChannelSource`, t => {
  const channelId = 0;
  const source = 'testVal';
  const channel = initialState[channelId];
  const {sources} = channel;
  t.deepEqual(reducer(undefined, addChannelSource({channelId, source})),
              [...initialState.slice(0, channelId),
               {...channel, sources: [...sources, source]},
               ...initialState.slice(channelId + 1)]);
  t.end();
});

test(`${reducerName} reducer addChannelEffect`, t => {
  const channelId = 1;
  const expectedState = [
    {
      effects: [
        {id: 1, name: 'effect1'},
        {id: 90, name: 'effect90'},
      ],
      selectedAddEffect: 'pingPongDelay',
      selectedAddSource: 'fm',
      sources: ['sine'],
    },
    {
      effects: [
        {id: 100, name: 'effect100'},
        {id: 42, name: 'effect42'},
        {id: 99, name: 'effect99'},
        {id: 101, name: 'magic effect'},
      ],
      selectedAddEffect: 'pingPongDelay',
      selectedAddSource: 'fm',
      sources: ['sine'],
    },
  ]
  t.deepEqual(reducer(testState,
                      addChannelEffect({channelId, effect: 'magic effect'})),
              expectedState);
  t.end();
});

test(`${reducerName} reducer moveChannelEffectDown`, t => {
  t.deepEqual(reducer(testState,
                      moveChannelEffectDown({channelId: 1, effectId: 100})),
                      [
                        {
                          effects: [
                            {id: 1, name: 'effect1'},
                            {id: 90, name: 'effect90'},
                          ],
                          selectedAddEffect: 'pingPongDelay',
                          selectedAddSource: 'fm',
                          sources: ['sine'],
                        },
                        {
                          effects: [
                            {id: 42, name: 'effect42'},
                            {id: 100, name: 'effect100'},
                            {id: 99, name: 'effect99'},
                          ],
                          selectedAddEffect: 'pingPongDelay',
                          selectedAddSource: 'fm',
                          sources: ['sine'],
                        },
                      ]);
  t.deepEqual(reducer(testState,
                      moveChannelEffectDown({channelId: 1, effectId: 42})),
                      [
                        {
                          effects: [
                            {id: 1, name: 'effect1'},
                            {id: 90, name: 'effect90'},
                          ],
                          selectedAddEffect: 'pingPongDelay',
                          selectedAddSource: 'fm',
                          sources: ['sine'],
                        },
                        {
                          effects: [
                            {id: 100, name: 'effect100'},
                            {id: 99, name: 'effect99'},
                            {id: 42, name: 'effect42'},
                          ],
                          selectedAddEffect: 'pingPongDelay',
                          selectedAddSource: 'fm',
                          sources: ['sine'],
                        },
                      ]);
  t.end();
});

test(`${reducerName} reducer moveChannelEffectUp`, t => {
  const expectedState = [
    {
      effects: [
        {id: 1, name: 'effect1'},
        {id: 90, name: 'effect90'},
      ],
      selectedAddEffect: 'pingPongDelay',
      selectedAddSource: 'fm',
      sources: ['sine'],
    },
    {
      effects: [
        {id: 42, name: 'effect42'},
        {id: 100, name: 'effect100'},
        {id: 99, name: 'effect99'},
      ],
      selectedAddEffect: 'pingPongDelay',
      selectedAddSource: 'fm',
      sources: ['sine'],
    },
  ]
  t.deepEqual(reducer(testState,
                      moveChannelEffectUp({channelId: 1, effectId: 42})),
              expectedState);
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
  const channel = initialState[channelId];
  const {sources} = channel;
  t.deepEqual(reducer(undefined, removeChannelSource({channelId, sourceId})),
              [...initialState.slice(0, channelId),
               {...channel, sources: [...sources.slice(0, sourceId),
                                      ...sources.slice(sourceId + 1)]},
               ...initialState.slice(channelId + 1)]);
  t.end();
});

test(`${reducerName} reducer removeChannelEffect`, t => {
  const expectedState = [
    {
      effects: [
        {id: 1, name: 'effect1'},
        {id: 90, name: 'effect90'},
      ],
      selectedAddEffect: 'pingPongDelay',
      selectedAddSource: 'fm',
      sources: ['sine'],
    },
    {
      effects: [
        {id: 100, name: 'effect100'},
        {id: 99, name: 'effect99'},
      ],
      selectedAddEffect: 'pingPongDelay',
      selectedAddSource: 'fm',
      sources: ['sine'],
    },
  ]

  t.deepEqual(reducer(testState,
                      removeChannelEffect({channelId: 1, effectId: 42})),
              expectedState);
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
  const channel = initialState[channelId];
  t.deepEqual(reducer(undefined, updateSelectedAddEffect({channelId, selectedAddEffect})),
              [...initialState.slice(0, channelId),
               {...channel, selectedAddEffect},
               ...initialState.slice(channelId + 1)]);
  t.end();
});

import test from 'tape'
import reducer, {initialState} from './channels'
import {
  addChannelSource,
  removeChannelSource,
  updateSelectedAddEffect,
  updateSelectedAddSource
} from '../../actions'

const reducerName = 'channels'

test(`${reducerName} reducer returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), initialState)
  t.deepEqual(reducer(undefined, {}), initialState)
  t.end()
})

test(`${reducerName} reducer addChannelSource`, t => {
  const channelId = 0
  const source = 'testVal'
  t.deepEqual(reducer([{
    effects: [{id: 0, name: 'pingPongDelay'}],
    id: channelId,
    selectedAddEffect: 'pingPongDelay',
    selectedAddSource: 'fm',
    sources: ['sine']
  }], addChannelSource({channelId, source})), [{
    effects: [{id: 0, name: 'pingPongDelay'}],
    id: channelId,
    selectedAddEffect: 'pingPongDelay',
    selectedAddSource: 'fm',
    sources: ['sine', source]
  }])
  t.end()
})

test(`${reducerName} reducer removeChannelSource`, t => {
  const channelId = 0
  const sourceId = 0
  const channel = initialState[channelId]
  const {sources} = channel
  t.deepEqual(reducer(undefined, removeChannelSource({channelId, sourceId})),
              [...initialState.slice(0, channelId),
               {...channel, sources: [...sources.slice(0, sourceId),
                                      ...sources.slice(sourceId + 1)]},
               ...initialState.slice(channelId + 1)])
  t.end()
})

test(`${reducerName} reducer updateSelectedAddSource`, t => {
  const channelId = 3
  const selectedAddSource = 'testVal'
  t.deepEqual(reducer([{
    effects: [{id: 0, name: 'pingPongDelay'}],
    id: 3,
    selectedAddEffect: 'pingPongDelay',
    selectedAddSource: 'fm',
    sources: ['sine']
  }], updateSelectedAddSource({channelId, selectedAddSource})), [{
    effects: [{id: 0, name: 'pingPongDelay'}],
    id: 3,
    selectedAddEffect: 'pingPongDelay',
    selectedAddSource: 'testVal',
    sources: ['sine']
  }])
  t.end()
})

test(`${reducerName} reducer updateSelectedAddEffect`, t => {
  const channelId = 0
  const selectedAddEffect = 'testVal'
  const channel = initialState[channelId]
  t.deepEqual(reducer(undefined, updateSelectedAddEffect({channelId, selectedAddEffect})),
              [...initialState.slice(0, channelId),
               {...channel, selectedAddEffect},
               ...initialState.slice(channelId + 1)])
  t.end()
})

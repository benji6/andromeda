import test from 'tape'
import reducer, {computeInitialState, initialState} from './audioGraph'
import {removeKeysFromAudioGraphContaining} from '../../actions'

const reducerName = 'audioGraph'

test(`${reducerName} computeInitialState`, t => {
  const defaultChannel = {effects: [{id: 0, name: 'none'}, {id: 1, name: 'pingPongDelay'}],
                          selectedAddEffect: 'pingPongDelay',
                          selectedAddSource: 'detuned',
                          sources: ['sine']}

  const channelsState = [{...defaultChannel, sources: ['detuned']},
                         defaultChannel]
  t.deepEqual(computeInitialState(channelsState), {
    'channel:0-type:effect-id:0': ['none', 'output'],
    'channel:0-type:effect-id:1': ['pingPongDelay', 'channel:0-type:effect-id:0'],
    'channel:1-type:effect-id:0': ['none', 'output'],
    'channel:1-type:effect-id:1': ['pingPongDelay', 'channel:1-type:effect-id:0']
  })
  t.end()
})

test(`${reducerName} reducer returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), initialState)
  t.deepEqual(reducer(undefined, {}), initialState)
  t.end()
})

test(`${reducerName} reducer stopNotesWithId`, t => {
  t.deepEqual(reducer({aaa: 'someNote',
                       'someKey-sdfuisofhshfdushu': 'someNote',
                       'someKey-sdfuisofhshfdu': 'someNote'},
                      removeKeysFromAudioGraphContaining('someKey')),
              {aaa: 'someNote'})
  t.end()
})

import test from 'tape'
import reducer from './settings'
import {updateBpm, updateRootNote, updateSelectedScale} from '../actions'

const reducerName = 'settings reducer'

test(`${reducerName} returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), {
    bpm: 140,
    rootNote: 0,
    selectedScale: 'pentatonic',
  })
  t.end()
})

test(`${reducerName} updateBpm`, t => {
  t.deepEqual(reducer({bpm: 140}, updateBpm(180)), {
    bpm: 180,
  })
  t.end()
})

test(`${reducerName} updateRootNote`, t => {
  t.deepEqual(reducer({rootNote: 0}, updateRootNote(3)), {rootNote: 3})
  t.end()
})

test(`${reducerName} updateSelectedScale`, t => {
  t.deepEqual(
    reducer({selectedScale: 'pentatonic'}, updateSelectedScale('wholetone')),
    {selectedScale: 'wholetone'}
  )
  t.end()
})

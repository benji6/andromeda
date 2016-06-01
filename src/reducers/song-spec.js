import test from 'tape'
import reducer from './song'
import {
  songActiveNotesSet,
  songPlayingStart,
  songPlayingStop,
} from '../actions'

const reducerName = 'song reducer'

test(`${reducerName} returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), {
    activeNotes: [],
    playing: false,
  })
  t.end()
})

test(`${reducerName} songActiveNotesSet`, t => {
  t.deepEqual(
    reducer({activeNotes: []}, songActiveNotesSet(['note0', 'note1', 'note2'])),
    {activeNotes: ['note0', 'note1', 'note2']}
  )
  t.end()
})

test(`${reducerName} songPlayingStart`, t => {
  t.deepEqual(
    reducer({playing: false}, songPlayingStart()),
    {playing: true}
  )
  t.end()
})

test(`${reducerName} songPlayingStop`, t => {
  t.deepEqual(
    reducer({activeNotes: [1, 2, 3], playing: true}, songPlayingStop()),
    {activeNotes: [], playing: false}
  )
  t.end()
})

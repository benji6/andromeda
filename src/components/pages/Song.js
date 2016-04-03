import {
  compose,
  curryN,
  map,
  // partial,
  range,
  repeat
} from 'ramda'
import React from 'react'
import {connect} from 'react-redux'
import store from '../../store'
import {
  addNewPattern,
  // setSongActivePosition,
  songCellClick
} from '../../actions'
import {mapIndexed} from '../../utils/helpers'
import ButtonPrimarySmall from '../atoms/ButtonPrimarySmall'
import FullButton from '../atoms/FullButton'
// import PlayButton from '../atoms/PlayButton'
import Pattern from '../organisms/Pattern'
import {stepExists} from '../../reducers/patterns'
import {Plus} from '../atoms/IconButtons'

// const activeNotes = new Set()

// let stopped = true

// const onPlay = dispatch => {
//   const {xLength} = store.getState().song
//   let count = 0
//   stopped = false
//
//   const timeoutCallback = _ => {
//     if (stopped === true) return
//
//     const position = count % xLength
//     dispatch(setSongActivePosition(position))
//     activeNotes.forEach(({id, instrumentObj}) => instrumentObj.inputNoteStop &&
//       instrumentObj.inputNoteStop(id))
//     activeNotes.clear()
//
//     count++
//     setTimeout(timeoutCallback, 60000 / store.getState().bpm)
//   }
//   timeoutCallback()
// }

// const stopVisuals = dispatch => {
//   stopped = true
//   dispatch(setSongActivePosition(null))
// }

// const stopAudio = _ => {
//   activeNotes.forEach(({id, instrumentObj}) => instrumentObj.inputNoteStop &&
//     instrumentObj.inputNoteStop(id))
//   activeNotes.clear()
// }

// const onStop = compose(stopAudio, stopVisuals)

const cellClickHandler = curryN(
  4,
  (dispatch, y, x) => dispatch(songCellClick({x, y}))
)

const connectComponent = connect(({
  activePatternIndex,
  dispatch,
  instrument,
  patterns,
  rootNote,
  scale
}) => ({
  activePatternIndex,
  dispatch,
  instrument,
  patterns,
  rootNote,
  scale
}))

export default connectComponent(({
  activePatternIndex,
  dispatch,
  instrument,
  patterns,
  rootNote,
  scale
}) => {
  const {activePosition, steps, xLength} = store.getState().song
  const emptyPatternData = map(range(0), repeat(xLength, patterns.length))
  const patternData = mapIndexed(
    (x, rowIndex) => map(
      colIndex => ({active: colIndex === activePosition, selected: stepExists(colIndex, rowIndex, steps)}),
      x
    ),
    emptyPatternData
  )

  return <div>
    <Pattern {...{
      onClick: cellClickHandler(dispatch),
      patternData,
      rootNote,
      scale,
      yLabel: x => <ButtonPrimarySmall to={`/controllers/pattern/${x}`}>
        {`Pattern ${x}`}
      </ButtonPrimarySmall>
    }} />{
    // <PlayButton
    //   onPlay={partial(onPlay, [dispatch])}
    //   onStop={partial(onStop, [dispatch])}
    // />
    }
    <div className='text-center'>
      <Plus onClick={compose(dispatch, addNewPattern)} />
      New pattern
    </div>
    <nav>
      <FullButton to='/controllers/song/settings'>Options</FullButton>
    </nav>
  </div>
})

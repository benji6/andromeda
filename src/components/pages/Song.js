import {
  always,
  compose,
  curryN,
  map,
  range,
  repeat
} from 'ramda'
import React from 'react'
import {connect} from 'react-redux'
import store from '../../store'
import {
  addNewPattern,
  deletePattern,
  songCellClick
} from '../../actions'
import {mapIndexed} from '../../utils/helpers'
import ButtonPrimarySmall from '../atoms/ButtonPrimarySmall'
import FullButton from '../atoms/FullButton'
import Pattern from '../organisms/Pattern'
import {stepExists} from '../../reducers/patterns'
import {Cross, Plus} from '../atoms/ButtonIcons'

const cellClickHandler = curryN(
  4,
  (dispatch, y, x) => dispatch(songCellClick({x, y}))
)

const connectComponent = connect(({
  activePatternIndex,
  dispatch,
  instrument,
  patterns,
}) => ({
  activePatternIndex,
  dispatch,
  instrument,
  patterns,
}))

export default connectComponent(({
  dispatch,
  patterns,
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
    {patterns.length
      ? <Pattern {...{
        onClick: cellClickHandler(dispatch),
        patternData,
        yLabel: x => <div className='padding-1'>
          <Cross onClick={compose(dispatch, deletePattern, always(x))} />
          <ButtonPrimarySmall to={`/controllers/pattern/${x}`}>
            {`Pattern ${x}`}
          </ButtonPrimarySmall>
        </div>
      }} />
      : null}
    <div className='text-center padding-1'>
      <Plus onClick={compose(dispatch, addNewPattern)}>New pattern</Plus>
    </div>
    <nav>
      <FullButton to='/controllers/song/settings'>Options</FullButton>
    </nav>
  </div>
})

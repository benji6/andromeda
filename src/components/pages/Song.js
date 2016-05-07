import {
  always,
  compose,
} from 'ramda'
import React from 'react'
import {connect} from 'react-redux'
import {
  addNewPattern,
  deletePattern,
} from '../../actions'
import ButtonPrimarySmall from '../atoms/ButtonPrimarySmall'
import ButtonPrimary from '../atoms/ButtonPrimary'
import {Cross, Plus} from '../atoms/ButtonIcons'
import {mapIndexed} from '../../utils/helpers'

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
  return <div>
    {patterns.length
      ? mapIndexed((_, x) =>
        <div className='text-center padding-0' key={x}>
          <Cross onClick={compose(dispatch, deletePattern, always(x))} />
          <ButtonPrimarySmall to={`/controllers/pattern/${x}`}>
            {`Pattern ${x}`}
          </ButtonPrimarySmall>
        </div>, patterns)
      : null}
    <div className='text-center padding-1'>
      <Plus onClick={compose(dispatch, addNewPattern)}>New pattern</Plus>
    </div>
    <nav>
      <ButtonPrimary to='/controllers/song/settings'>Options</ButtonPrimary>
    </nav>
  </div>
})

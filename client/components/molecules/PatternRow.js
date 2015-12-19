import React from 'react'
import {mapIndexed} from '../../tools/indexedIterators'
import Step from '../atoms/Step'

const selectedClass = ({selected}) => selected === true ? 'selected' : ''
const activeClass = ({active}) => active === true ? 'active' : ''

export default ({cells, onClick, yLabel}) =>
  <div className='flex-row pattern-row'>
    <div className='y-label' key={'flex-row-y-label'}>{yLabel}</div>
    {mapIndexed((cell, i) => <Step
      className={`step ${selectedClass(cell)} ${activeClass(cell)}`}
      key={`flex-row-${i}`}
      onClick={onClick(i)}
    />, cells)}
  </div>

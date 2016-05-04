import React from 'react'
import {mapIndexed} from '../../utils/helpers'
import Step from '../atoms/Step'

const selectedClass = ({selected}) => selected === true ? 'step--selected' : ''

export default ({cells, onClick, yLabel}) =>
  <div className='flex-row pattern-row'>
    <div className='y-label' key={'flex-row-y-label'}>{yLabel}</div>
    {mapIndexed((cell, i) => <Step
      className={`step ${selectedClass(cell)}`}
      key={`flex-row-${i}`}
      onClick={onClick(i)}
    />, cells)}
  </div>

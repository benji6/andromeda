import React from 'react'
import {mapIndexed} from '../../utils/helpers'
import Step from '../atoms/Step'

export default ({cells, onClick, yLabel}) =>
  <div className='flex-row pattern-row'>
    <div className='y-label' key={'flex-row-y-label'}>{yLabel}</div>
    {mapIndexed((cell, i) => <Step
      selected={cell.selected}
      key={`flex-row-${i}`}
      onClick={onClick(i)}
    />, cells)}
  </div>

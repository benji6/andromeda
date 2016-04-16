import React from 'react'
import {mapIndexed} from '../../utils/helpers'

export default ({labels}) => <div className='x-labels flex-row'>
  {mapIndexed((label, i) => <div {...{
    className: 'x-label',
    key: `x-label-${i}`,
  }}>{i ? label : ''}</div>, labels)}
  <div style={{width: '8rem'}} />
</div>

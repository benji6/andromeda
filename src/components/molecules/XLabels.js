import React from 'react'
import {mapIndexed} from '../../utils/helpers'

export default ({labels}) => <div className='XLabels flex-row'>
  {mapIndexed((label, i) => <div {...{
    className: 'XLabel',
    key: `XLabel-${i}`,
  }}>{i ? label : ''}</div>, labels)}
  <div style={{width: '8rem'}} />
</div>

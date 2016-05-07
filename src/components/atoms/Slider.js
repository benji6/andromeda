import React from 'react'

/* eslint-disable */
export default ({output, ...props}) =>
  <div className='slider'>
    <div>
      <output>{props.disabled ? <span>&nbsp;</span> : output}</output>
    </div>
    <input className='slider__input' type='range' {...props} />
  </div>
/* eslint-enable */

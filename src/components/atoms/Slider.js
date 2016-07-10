import React from 'react'

/* eslint-disable */
export default ({output, ...props}) =>
  <div className='Slider'>
    <div>
      <output>{props.disabled ? <span>&nbsp;</span> : output}</output>
    </div>
    <input className='Slider__input' type='range' {...props} />
  </div>
/* eslint-enable */

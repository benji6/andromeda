import React from 'react'

export default ({onPlay, onStop, playing}) =>
<div className='text-center'>
  <button {...{
    className: `button-play${playing ? ' button-play--playing' : ''}`,
    onClick: playing ? onStop : onPlay,
  }} />
</div>

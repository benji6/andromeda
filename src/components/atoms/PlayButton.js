import React from 'react'
import {updatePlaying} from '../../actions'

export default ({onPlay, onStop, dispatch, playing}) =>
<div className='text-center'>
  <button
    className={`play-button${playing ? ' play-button--playing' : ''}`}
    onClick={_ => {
      if (playing) onStop(); else onPlay()
      dispatch(updatePlaying(!playing))
    }}
  />
</div>

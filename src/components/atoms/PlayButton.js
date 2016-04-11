import React from 'react'
import {setPatternPlaying} from '../../actions'

export default ({onPlay, onStop, dispatch, patternId, playing}) =>
<div className='text-center'>
  <button
    className={`play-button${playing ? ' play-button--playing' : ''}`}
    onClick={_ => {
      dispatch(setPatternPlaying({patternId, value: !playing}))
      setTimeout(_ => { if (playing) onStop(); else onPlay() })
    }}
  />
</div>

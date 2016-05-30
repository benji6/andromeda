import React from 'react'
import {setPatternPlaying} from '../../actions'

export default ({onPlay, onStop, dispatch, patternId, playing}) =>
<div className='text-center'>
  <button
    className={`button-play${playing ? ' button-play--playing' : ''}`}
    onClick={_ => {
      dispatch(setPatternPlaying({patternId, value: !playing}))
      setTimeout(_ => { if (playing) onStop(); else onPlay() })
    }}
  />
</div>

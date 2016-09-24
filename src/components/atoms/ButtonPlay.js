import {createElement} from 'react'
import {makeClassName} from '../../utils/dom'

export default ({onPlay, onStop, playing}) => createElement('button', {
  className: makeClassName('ButtonPlay', playing && 'ButtonPlay--playing'),
  onClick: playing ? onStop : onPlay,
})

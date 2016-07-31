import {createElement} from 'react'
import {makeClassName} from '../../utils/helpers'

export default ({onPlay, onStop, playing}) => createElement('button', {
  className: makeClassName('ButtonPlay', [playing, 'ButtonPlay--playing']),
  onClick: playing ? onStop : onPlay,
})

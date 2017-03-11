import {createElement, PropTypes} from 'react'
import {makeClassName} from '../../utils/dom'

const ButtonPlay = ({onPlay, onStop, playing}) => createElement('button', {
  className: makeClassName('ButtonPlay', playing && 'ButtonPlay--playing'),
  onClick: playing ? onStop : onPlay,
})

if (process.env.NODE_ENV !== 'production') {
  ButtonPlay.propTypes = {
    onPlay: PropTypes.func.isRequired,
    onStop: PropTypes.func.isRequired,
    playing: PropTypes.bool.isRequired,
  }
}

export default ButtonPlay

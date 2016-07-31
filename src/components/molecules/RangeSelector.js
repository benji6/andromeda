import {createElement} from 'react'
import Slider from '../atoms/Slider'
import InputLabel from '../atoms/InputLabel'

export default ({text, ...props}) =>
  createElement('label', null,
    createElement(InputLabel, null, text),
    createElement(Slider, {type: 'range', ...props})
  )

import {createElement} from 'react'
import Checkbox from '../atoms/Checkbox'
import InputLabel from '../atoms/InputLabel'

export default ({text, ...props}) =>
  createElement('label', null,
    createElement(InputLabel, null, text),
    createElement(Checkbox, props)
  )

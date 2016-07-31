import {createElement} from 'react'
import Selector from './Selector'
import ButtonSecondary from '../atoms/ButtonSecondary'

export default props => createElement(Selector, props,
  createElement(
    ButtonSecondary,
    {to: `/plugins/instruments/${props.defaultValue}`},
    'edit'
  )
)

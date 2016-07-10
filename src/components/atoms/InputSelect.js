import {createElement} from 'react'
import {mapIndexed} from '../../utils/helpers'

export default ({options, ...props}) => createElement(
  'select',
  {...props, className: 'ButtonPrimary InputSelect'},
  mapIndexed(
    ({text, value}, i) => createElement('option', {key: i, value}, text),
    options
  )
)

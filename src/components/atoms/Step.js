import {createElement} from 'react'
import {makeClassName} from '../../utils/helpers'

export default ({onClick, red, selected}) => createElement('button', {
  className: makeClassName(
    'Step',
    [red, 'Step--red'],
    [selected, 'Step--selected'],
    [red && selected, 'Step--red--selected'],
  ),
  onClick,
})

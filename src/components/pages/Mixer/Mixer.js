import {map, pluck} from 'ramda'
import {createElement} from 'react'
import ButtonPrimary from '../../atoms/ButtonPrimary'
import {makeClassName} from '../../../utils/dom'

const Mixer = ({
  channels,
  lastDirection,
}) => createElement('div', {
  className: makeClassName(
    'Mixer',
    lastDirection === 'left' ? 'slide-in-left' : 'slide-in-right'
  ),
},
  map(
    channel => createElement('div', {key: channel},
      createElement(ButtonPrimary, {to: `/channel/${channel}`},
        `Channel ${channel}`
      )
    ),
    pluck('name', channels)
  )
)

export default Mixer

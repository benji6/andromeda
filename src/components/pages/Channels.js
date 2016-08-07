import {map, pluck} from 'ramda'
import {createElement} from 'react'
import {connect} from 'react-redux'
import ButtonPrimary from '../atoms/ButtonPrimary'
import {Cross, Plus} from '../atoms/ButtonIcons'
import {addChannel, removeChannel} from '../../actions'

const mapStateToProps = ({dispatch, plugins: {channels}}) => ({
  dispatch,
  channels,
})

export default connect(mapStateToProps)(({dispatch, channels}) =>
  createElement('div', {className: 'Channels'},
    map(
      channel => createElement('div', {key: channel},
        createElement(ButtonPrimary, {to: `/channel/${channel}`},
          `Channel ${channel}`
        ),
        createElement(Cross, {onClick: comp(dispatch, removeChannel, K(channel))})
      ),
      pluck('name', channels)
    ),
    createElement('div', null,
      createElement(Plus, {onClick: comp(dispatch, addChannel)}, 'Add new channel')
    )
  ))

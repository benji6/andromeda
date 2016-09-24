import {createElement} from 'react'
import {connect} from 'react-redux'
import LinkExternal from '../atoms/LinkExternal'
import {makeClassName} from '../../utils/dom'

const mapStateToProps = ({nav: {lastDirection}}) => ({lastDirection})

export default connect(mapStateToProps)(({lastDirection}) =>
  createElement('div', {
    className: makeClassName(
      'About',
      lastDirection === 'left' ? 'slide-in-left' : 'slide-in-right'
    ),
  },
    createElement('h1', {className: 'About__Title'}, 'About'),
    createElement('p', null, 'Elemental is a pluggable digital audio workstation in development built on open web technologies'),
    createElement('p', null,
      'All the code is open source and hosted on ',
      createElement(
        LinkExternal,
        {href: 'https://github.com/benji6/elemental'},
        'GitHub'
      )
    ),
    createElement('p', null,
      'If you would like to report a bug or request a feature raise an ',
      createElement(
        LinkExternal,
        {href: 'https://github.com/benji6/elemental/issues'},
        'issue'
      )
    ),
    createElement('p', null,
      'Contributions, issues, feedback and suggestions are all very welcome!'
    )
  ))

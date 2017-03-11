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
    createElement('h1', {className: 'About__Title'}, 'Tips'),
    createElement('p', null, 'For best results use Chrome and on mobile the app is much nicer when added to the home screen and launched from there (tap "Add to Home Screen" in the browser menu)'),
    createElement('h1', {className: 'About__Title'}, 'About'),
    createElement('p', null, 'Andromeda is a pluggable digital audio workstation in development built on open web technologies'),
    createElement('p', null,
      'All the code is open source and hosted on ',
      createElement(
        LinkExternal,
        {href: 'https://github.com/benji6/andromeda'},
        'GitHub'
      )
    ),
    createElement('p', null,
      'If you would like to report a bug or request a feature you can raise an issue ',
      createElement(
        LinkExternal,
        {href: 'https://github.com/benji6/andromeda/issues'},
        'here'
      )
    ),
    createElement('p', null,
      'Contributions, feedback and suggestions are all very welcome!'
    )
  ))

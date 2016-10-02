import {findIndex} from 'ramda'
import {createElement} from 'react'
import {hashHistory, IndexRoute, Router, Route} from 'react-router'
import store from './store'
import {navLastDirectionSet} from './actions'
import nav from './constants/nav'
import App from './components/templates/App'
import About from './components/pages/About'
import Channel from './components/pages/Channel'
import Channels from './components/pages/Channels'
import ControlPadSettings from './components/pages/ControlPadSettings'
import ControlPadPage from './components/pages/ControlPadPage'
import Effect from './components/pages/Effect'
import Instrument from './components/pages/Instrument'
import KeyboardSettings from './components/pages/KeyboardSettings'
import PatternSettings from './components/pages/PatternSettings'
import Pattern from './components/pages/Pattern'
import Settings from './components/pages/Settings'
import Song from './components/pages/Song'

export default createElement(Router, {history: hashHistory},
  createElement(Route, {
    component: App,
    onChange: (prevState, nextState) => {
      const {lastDirection} = store.getState().nav
      const prevIndex = findIndex(([pathname]) => pathname === prevState.location.pathname, nav)
      const nextIndex = findIndex(([pathname]) => pathname === nextState.location.pathname, nav)

      if (nextIndex === prevIndex) return

      const direction = nextIndex > prevIndex ? 'right' : 'left'

      if (direction !== lastDirection) {
        store.dispatch(navLastDirectionSet(direction))
      }
    },
    path: '/',
  },
    createElement(IndexRoute, {component: ControlPadPage}),
    createElement(Route, {component: About, path: '/about'}),
    createElement(Route, {component: Channel, path: '/channel/:channelId'}),
    createElement(Route, {component: Channels, path: '/channels'}),
    createElement(Route, {component: ControlPadPage, path: '/controllers/control-pad'}),
    createElement(Route, {component: ControlPadSettings, path: '/controllers/control-pad/settings'}),
    createElement(Route, {component: KeyboardSettings, path: '/controllers/keyboard/settings'}),
    createElement(Route, {component: Pattern, path: '/controllers/pattern/:patternId'}),
    createElement(Route, {component: PatternSettings, path: '/controllers/pattern/:patternId/settings'}),
    createElement(Route, {component: Song, path: '/controllers/song'}),
    createElement(Route, {component: Effect, path: '/plugins/effects/:name'}),
    createElement(Route, {component: Instrument, path: '/plugins/instruments/:name'}),
    createElement(Route, {component: Settings, path: '/settings'}),
    createElement(Route, {component: ControlPadPage, path: '/*'})
  )
)

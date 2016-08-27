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
    path: '/',
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
  },
    createElement(IndexRoute, {component: ControlPadPage}),
    createElement(Route, {path: '/about', component: About}),
    createElement(Route, {path: '/channel/:channelId', component: Channel}),
    createElement(Route, {path: '/channels', component: Channels}),
    createElement(Route, {path: '/controllers/control-pad', component: ControlPadPage}),
    createElement(Route, {path: '/controllers/control-pad/settings', component: ControlPadSettings}),
    createElement(Route, {path: '/controllers/keyboard/settings', component: KeyboardSettings}),
    createElement(Route, {path: '/controllers/pattern/:patternId', component: Pattern}),
    createElement(Route, {path: '/controllers/pattern/:patternId/settings', component: PatternSettings}),
    createElement(Route, {path: '/controllers/song', component: Song}),
    createElement(Route, {path: '/plugins/effects/:name', component: Effect}),
    createElement(Route, {path: '/plugins/instruments/:name', component: Instrument}),
    createElement(Route, {path: '/settings', component: Settings}),
    createElement(Route, {path: '/*', component: ControlPadPage})
  )
)

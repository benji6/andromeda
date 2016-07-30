import React from 'react'
import {hashHistory, IndexRoute, Router, Route} from 'react-router'
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

export default <Router history={hashHistory}>
  <Route path='/' component={App}>
    <IndexRoute component={ControlPadPage} />
    <Route path='/about' component={About} />
    <Route path='/channel/:channelId' component={Channel} />
    <Route path='/channels' component={Channels} />
    <Route path='/controllers/control-pad' component={ControlPadPage} />
    <Route path='/controllers/control-pad/settings' component={ControlPadSettings} />
    <Route path='/controllers/keyboard/settings' component={KeyboardSettings} />
    <Route path='/controllers/pattern/:patternId' component={Pattern} />
    <Route path='/controllers/pattern/:patternId/settings' component={PatternSettings} />
    <Route path='/controllers/song' component={Song} />
    <Route path='/plugins/effects/:name' component={Effect} />
    <Route path='/plugins/instruments/:name' component={Instrument} />
    <Route path='/settings' component={Settings} />
    <Route path='/*' component={ControlPadPage} />
  </Route>
</Router>

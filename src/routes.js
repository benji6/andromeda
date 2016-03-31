import React from 'react'
import {hashHistory, IndexRoute, Router, Route} from 'react-router'
import App from './components/templates/App'
import Channel from './components/pages/Channel'
import Channels from './components/pages/Channels'
import ControlPadSettings from './components/pages/ControlPadSettings'
import ControlPad from './components/pages/ControlPad'
import Effect from './components/pages/Effect'
import Instrument from './components/pages/Instrument'
import KeyboardSettings from './components/pages/KeyboardSettings'
import PatternEditorSettings from './components/pages/PatternEditorSettings'
import PatternEditor from './components/pages/PatternEditor'
import Settings from './components/pages/Settings'
import Song from './components/pages/Song'

export default <Router history={hashHistory}>
  <Route path='/' component={App}>
    <IndexRoute component={ControlPad} />
    <Route path='/channel/:channelId' component={Channel} />
    <Route path='/channels' component={Channels} />
    <Route path='/controllers/control-pad' component={ControlPad} />
    <Route path='/controllers/control-pad/settings' component={ControlPadSettings} />
    <Route path='/controllers/keyboard/settings' component={KeyboardSettings} />
    <Route path='/controllers/pattern-editor' component={PatternEditor} />
    <Route path='/controllers/song' component={Song} />
    <Route path='/pattern-editor/settings' component={PatternEditorSettings} />
    <Route path='/plugins/effects/:name' component={Effect} />
    <Route path='/plugins/instruments/:name' component={Instrument} />
    <Route path='/settings' component={Settings} />
    <Route path='/*' component={ControlPad} />
  </Route>
</Router>

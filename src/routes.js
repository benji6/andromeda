import React from 'react'
import {hashHistory, IndexRoute, Router, Route} from 'react-router'
import App from './components/templates/App'
import Channel from './components/pages/Channel'
import Channels from './components/pages/Channels'
import Controllers from './components/pages/Controllers'
import ControlPadSettings from './components/pages/ControlPadSettings'
import ControlPadView from './components/pages/ControlPadView'
import Effect from './components/pages/Effect'
import Effects from './components/pages/Effects'
import Instrument from './components/pages/Instrument'
import Instruments from './components/pages/Instruments'
import KeyboardSettings from './components/pages/KeyboardSettings'
import PatternEditorSettings from './components/pages/PatternEditorSettings'
import PatternEditorView from './components/pages/PatternEditorView'
import Plugins from './components/pages/Plugins'
import SettingsView from './components/pages/SettingsView'

export default <Router history={hashHistory}>
  <Route path='/' component={App}>
    <IndexRoute component={ControlPadView} />
    <Route path='/channel/:channelId' component={Channel} />
    <Route path='/channels' component={Channels} />
    <Route path='/control-pad/settings' component={ControlPadSettings} />
    <Route path='/controllers' component={Controllers} />
    <Route path='/controllers/control-pad' component={ControlPadView} />
    <Route path='/controllers/keyboard/settings' component={KeyboardSettings} />
    <Route path='/controllers/pattern-editor' component={PatternEditorView} />
    <Route path='/pattern-editor/settings' component={PatternEditorSettings} />
    <Route path='/plugins' component={Plugins} />
    <Route path='/plugins/effects' component={Effects} />
    <Route path='/plugins/effects/:name' component={Effect} />
    <Route path='/plugins/instruments' component={Instruments} />
    <Route path='/plugins/instruments/:name' component={Instrument} />
    <Route path='/settings' component={SettingsView} />
    <Route path='/*' component={ControlPadView} />
  </Route>
</Router>

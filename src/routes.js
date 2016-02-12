import React from 'react'
import {Router, Route} from 'react-router'
import ChannelsView from './components/pages/ChannelsView'
import ChannelView from './components/pages/ChannelView'
import ControlPadSettings from './components/pages/ControlPadSettings'
import ControlPadView from './components/pages/ControlPadView'
import Instrument from './components/pages/Instrument'
import Instruments from './components/pages/Instruments'
import KeyboardSettings from './components/pages/KeyboardSettings'
import PatternEditorSettings from './components/pages/PatternEditorSettings'
import PatternEditorView from './components/pages/PatternEditorView'
import SettingsView from './components/pages/SettingsView'

export default <Router>
  <Route path='/channel/:channelId' component={ChannelView} />
  <Route path='/channels' component={ChannelsView} />
  <Route path='/control-pad' component={ControlPadView} />
  <Route path='/control-pad/settings' component={ControlPadSettings} />
  <Route path='/instruments' component={Instruments} />
  <Route path='/instruments/:name' component={Instrument} />
  <Route path='/keyboard/settings' component={KeyboardSettings} />
  <Route path='/pattern-editor' component={PatternEditorView} />
  <Route path='/pattern-editor/settings' component={PatternEditorSettings} />
  <Route path='/settings' component={SettingsView} />
  <Route path='/*' component={ControlPadView}/>
</Router>

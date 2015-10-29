import React from 'react';
import ControlPadView from './components/pages/ControlPadView';
import {Router, Route} from 'react-router';
import PatternEditorView from './components/pages/PatternEditorView';
import PatternEditorSettings from './components/pages/PatternEditorSettings';
import SettingsView from './components/pages/SettingsView';
import ControlPadSettings from './components/pages/ControlPadSettings';

export default <Router>
  <Route path="/control-pad" component={ControlPadView} />
  <Route path="/control-pad/settings" component={ControlPadSettings} />
  <Route path="/pattern-editor" component={PatternEditorView} />
  <Route path="/pattern-editor/settings" component={PatternEditorSettings} />
  <Route path="/settings" component={SettingsView} />
  <Route path="/*" component={ControlPadView}/>
</Router>;

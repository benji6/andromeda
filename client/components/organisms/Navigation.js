import React from 'react'; // eslint-disable-line
import {Provider} from 'react-redux';
import render from '../../tools/render';
import PatternEditor from '../templates/PatternEditor';
// import SongEditor from '../templates/SongEditor';
import PerformanceView from '../templates/PerformanceView';
import SettingsView from '../templates/SettingsView';
import store from '../../store';
import HollowButton from '../atoms/HollowButton';

// <button className="button" onClick={() => render(
//   <Provider store={store}>
//     <SongEditor />
//   </Provider>
// )}>Song Editor</button>

export default () =>
  <nav className="navigation">
    <HollowButton onClick={() => render(<PerformanceView />)}
                  text="Control Pad" />
    <HollowButton onClick={() => render(<Provider store={store}>
                                          <PatternEditor />
                                        </Provider>)}
                  text="Pattern Editor" />
    <HollowButton onClick={() => render(<Provider store={store}>
                                          <SettingsView />
                                        </Provider>)}
                  text="Settings" />
  </nav>;

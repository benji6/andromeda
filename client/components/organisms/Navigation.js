import React from 'react'; // eslint-disable-line
import {Provider} from 'react-redux';
import render from '../../tools/render';
import PatternEditor from '../pages/PatternEditor';
// import SongEditor from '../pages/SongEditor';
import PerformanceView from '../pages/PerformanceView';
import SettingsView from '../pages/SettingsView';
import store from '../../store';
import HollowButton from '../atoms/HollowButton';
// <HollowButton onClick={() => render(<Provider store={store}>
//                                       <SongEditor />
//                                     </Provider>)}
//               text="Song Editor" />

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

import React from 'react'; // eslint-disable-line
import {Provider} from 'react-redux';
import render from '../../tools/render';
import PatternEditor from '../pages/PatternEditor';
// import SongEditor from '../pages/SongEditor';
import PerformanceView from '../pages/PerformanceView';
import SettingsView from '../pages/SettingsView';
import store from '../../store';
import HollowButton from '../atoms/HollowButton';
import Menu from './Menu';
// <HollowButton onClick={() => render(<Provider store={store}>
//                                       <SongEditor />
//                                     </Provider>)}
//               text="Song Editor" />

export default () =>
  <Menu components={[
      <HollowButton key="1"
                    onClick={() => render(<PerformanceView />)}
                    text="Control Pad" />,
      <HollowButton key="2"
                    onClick={() => render(<Provider store={store}>
                                            <PatternEditor />
                                          </Provider>)}
                    text="Pattern Editor" />,
      <HollowButton key="3"
                    onClick={() => render(<Provider store={store}>
                                            <SettingsView />
                                          </Provider>)}
                    text="Settings" />,
  ]} />;

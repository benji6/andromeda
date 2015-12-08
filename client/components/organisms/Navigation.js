import React from 'react';
// import SongEditor from '../pages/SongEditor';
import HollowButton from '../atoms/HollowButton';
import Menu from './Menu';

// <HollowButton onClick={() => render(<Provider store={store}>
//                                       <SongEditor />
//                                     </Provider>)}
//               text="Song Editor" />

export default () =>
  <Menu components={[
      <HollowButton key="1"
                    text="Pad"
                    to="/control-pad" />,
      <HollowButton key="2"
                    text="Pattern"
                    to="/pattern-editor" />,
      <HollowButton key="3"
                    text="Channels"
                    to="/channels" />,
      <HollowButton key="4"
                    text="Settings"
                    to="/settings" />,
  ]} />;

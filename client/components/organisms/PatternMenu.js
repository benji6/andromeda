import React from 'react';
import FullButton from '../atoms/FullButton';
import Menu from './Menu';

export default () =>
  <Menu components={[
      <FullButton key="1" to="/pattern-editor/settings" text="Options" />,
  ]} />;

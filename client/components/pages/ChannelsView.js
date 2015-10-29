import {identity} from 'ramda';
import React from 'react';
import {mapIndexed} from '../../tools/indexedIterators';
import {connect} from 'react-redux';
import Navigation from '../organisms/Navigation';
import FullButton from '../atoms/FullButton';

export default connect(identity)(({channels}) =>
  <div>
    <Navigation />
    <div className="flex-column text-center">
      <h1>Channels</h1>
      {mapIndexed((channel, i) =>
        <div key={i}>
          <FullButton text={`Channel ${i}`}
                      to={`/channel/${i}`} />
        </div>, channels)}
    </div>
  </div>);

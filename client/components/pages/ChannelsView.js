import {identity} from 'ramda';
import {mapIndexed} from '../../tools/indexedIterators';
import React from 'react'; // eslint-disable-line
import {connect} from 'react-redux';
import Navigation from '../organisms/Navigation';
import FullButton from '../atoms/FullButton';

export default connect(identity)(({channels}) =>
  <div>
    <Navigation />
    <h1 className="text-center">Channels</h1>
    <div className="flex-column text-center">
      {mapIndexed((channel, i) =>
        <div key={i}>
          <FullButton text={`Channel ${i}`} />
        </div>, channels)}
    </div>
  </div>);

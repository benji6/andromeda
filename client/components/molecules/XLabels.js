import React from 'react';
import {mapIndexed} from '../../tools/indexedIterators';

export default ({labels}) => <div className="x-labels flex-row">
  {mapIndexed((label, i) => <div className="x-label"
                                key={`x-label-${i}`}>{i ? label : ''}</div>, labels)}
</div>;

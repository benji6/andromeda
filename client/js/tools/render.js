import React from 'react';
import {curry, flip} from 'ramda';

export default curry(flip(React.render))(document.querySelector('#app'));

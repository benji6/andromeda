/* global R */
import React from 'react';
const {curry, flip} = R;
export default curry(flip(React.render))(document.querySelector('#app'));

/* global R */
import {render} from 'react-dom';
const {curry, flip} = R;
export default curry(flip(render))(document.querySelector('#app'));

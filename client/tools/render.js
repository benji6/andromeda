import {render} from 'react-dom';
import {curry, flip} from 'ramda';
export default curry(flip(render))(document.querySelector('#app'));

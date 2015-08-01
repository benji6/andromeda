import ReactDOM from 'react-dom';
import {curry, flip} from 'ramda';
export default curry(flip(ReactDOM.render))(document.querySelector('#app'));

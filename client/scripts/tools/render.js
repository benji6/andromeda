/* global R */
import ReactDOM from 'react-dom';
const {curry, flip} = R;
export default curry(flip(ReactDOM.render))(document.querySelector('#app'));

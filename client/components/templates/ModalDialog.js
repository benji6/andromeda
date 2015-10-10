import React from 'react'; // eslint-disable-line
import {Provider} from 'react-redux';
import FullButton from '../atoms/FullButton';
import store from '../../store';
import render from '../../tools/render';
import PerformanceView from '../pages/PerformanceView';

export default ({components}) => {
  return (
    <div className="modal-container">
      <div className="modal-window">
        <div className="modal-contents">
          <div className="text-right">
            {components}
            <FullButton onClick={() => render(
              <Provider store={store}>
                <PerformanceView />
              </Provider>
            )} text="OK" />
          </div>
        </div>
      </div>
    </div>
  );
};

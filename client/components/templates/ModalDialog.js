import React from 'react'; // eslint-disable-line
import FullButton from '../atoms/FullButton';

export default ({components, onClose}) =>
  <div className="modal-container">
    <div className="modal-window">
      <div className="modal-contents">
        <div className="text-right">
          {components}
          <FullButton onClick={onClose} text="OK" />
        </div>
      </div>
    </div>
  </div>;

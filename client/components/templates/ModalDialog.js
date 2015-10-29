import React from 'react';
import FullButton from '../atoms/FullButton';

export default ({components, to}) =>
  <div className="modal-container">
    <div className="modal-window">
      <div className="modal-contents">
        <div className="text-right">
          {components}
          <FullButton text="OK" to={to} />
        </div>
      </div>
    </div>
  </div>;

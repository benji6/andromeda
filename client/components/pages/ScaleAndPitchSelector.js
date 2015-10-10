import {compose, identity, keys, path} from 'ramda';
import React from 'react'; // eslint-disable-line
import {connect} from 'react-redux';
import ArpeggiatorSelector from '../molecules/ArpeggiatorSelector';
import ModalDialog from '../templates/ModalDialog';
import Selector from '../molecules/Selector';
import {updateArpeggiatorIsOn,
        updateSelectedPattern,
        updateSelectedScale} from '../../actions';
import {Provider} from 'react-redux';
import store from '../../store';
import render from '../../tools/render';
import PerformanceView from '../pages/PerformanceView';

const eventValuePath = path(['currentTarget', 'value']);
const eventCheckedPath = path(['currentTarget', 'checked']);

export default connect(identity)(({arpeggiator: {arpeggiatorIsOn, patterns, selectedPattern},
                                   dispatch,
                                   scale: {scaleName, scales}}) =>
  <ModalDialog components={
    <div>
      <Selector defaultValue={scaleName}
                handleChange={compose(dispatch, updateSelectedScale, eventValuePath)}
                label="Scale"
                options={keys(scales)} />
      <ArpeggiatorSelector arpeggiatorIsOn={arpeggiatorIsOn}
                           dispatch={dispatch}
                           patterns={patterns}
                           selectedPattern={selectedPattern}
                           handleArpeggiatorIsOnChange={compose(dispatch, updateArpeggiatorIsOn, eventCheckedPath)}
                           handlePatternSelect={compose(dispatch, updateSelectedPattern, eventValuePath)} />
    </div>
  } onClose={() => render(
      <Provider store={store}>
        <PerformanceView />
      </Provider>
    )} />
  );

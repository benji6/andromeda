import {UPDATE_MICROPHONE_IS_AVAILABLE,
        UPDATE_MICROPHONE_IS_ON} from '../actions';

export const initialState = {isOn: false,
                             isAvailable: true};

export default (state = initialState, {type, value}) => {
  switch (type) {
    case UPDATE_MICROPHONE_IS_ON:
      return {...state, isOn: value};
    case UPDATE_MICROPHONE_IS_AVAILABLE:
      return {...state, isAvailable: value};
    default:
      return state;
  }
};

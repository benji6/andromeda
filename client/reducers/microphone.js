import {UPDATE_MICROPHONE_IS_AVAILABLE,
        UPDATE_MICROPHONE_IS_ON} from '../actions'

export const initialState = {isOn: false,
                             isAvailable: true}

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case UPDATE_MICROPHONE_IS_ON:
      return {...state, isOn: payload}
    case UPDATE_MICROPHONE_IS_AVAILABLE:
      return {...state, isAvailable: payload}
    default:
      return state
  }
}

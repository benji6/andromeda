import {UPDATE_SELECTED_SCALE} from '../actions'

export const initialState = {
  scaleName: 'pentatonic'
}

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case UPDATE_SELECTED_SCALE: return {...state, scaleName: payload}
    default: return state
  }
}

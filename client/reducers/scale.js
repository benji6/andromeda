import {UPDATE_SELECTED_SCALE} from '../actions'

export const initialState = {
  scales: {
    'harmonic minor': [0, 2, 3, 5, 7, 8, 11],
    major: [0, 2, 4, 5, 7, 9, 11],
    minor: [0, 2, 3, 5, 7, 8, 10],
    pentatonic: [0, 3, 5, 7, 10],
    phrygian: [0, 1, 3, 5, 7, 8, 10],
    'phrygian dominant': [0, 1, 4, 5, 7, 8, 10],
    wholetone: [0, 2, 4, 6, 8, 10],
  },
  scaleName: 'pentatonic',
}

export default (state = initialState, {type, payload}) =>
  type === UPDATE_SELECTED_SCALE ? {...state, scaleName: payload} : state

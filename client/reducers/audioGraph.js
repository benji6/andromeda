import {filter, keys, map, zipObj} from 'ramda';
import {MERGE_INTO_AUDIO_GRAPH,
        REMOVE_KEYS_FROM_AUDIO_GRAPH_CONTAINING} from '../actions';

export const initialState = {};

export default (state = initialState, {type, value}) => {
  switch (type) {
    case MERGE_INTO_AUDIO_GRAPH:
      return {...state, ...value};
    case REMOVE_KEYS_FROM_AUDIO_GRAPH_CONTAINING:
      const keysToKeep = filter(key => key.indexOf(value) === -1, keys(state));
      return zipObj(keysToKeep, map(key => state[key], keysToKeep));
    default:
      return state;
  }
};

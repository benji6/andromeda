import {ADD_CHANNEL,
        ADD_CHANNEL_EFFECT,
        ADD_CHANNEL_SOURCE,
        MOVE_CHANNEL_EFFECT_DOWN,
        MOVE_CHANNEL_EFFECT_UP,
        MOVE_CHANNEL_SOURCE_DOWN,
        MOVE_CHANNEL_SOURCE_UP,
        REMOVE_CHANNEL,
        REMOVE_CHANNEL_SOURCE,
        REMOVE_CHANNEL_EFFECT,
        UPDATE_SELECTED_ADD_EFFECT,
        UPDATE_SELECTED_ADD_SOURCE} from '../actions';

export const defaultChannel = {effects: ['pingPongDelay'],
                               selectedAddEffect: 'pingPongDelay',
                               selectedAddSource: 'detuned',
                               sources: ['sine']};

export const initialState = [{...defaultChannel, sources: ['detuned']},
                             defaultChannel];

export default (state = initialState, {type, value}) => {
  switch (type) {
    case ADD_CHANNEL:
      return [...state,
              defaultChannel];
    case ADD_CHANNEL_SOURCE: {
      const {channelId, source} = value;
      const channel = state[channelId];
      const {sources} = channel;
      return [...state.slice(0, channelId),
              {...channel, sources: [...sources, source]},
              ...state.slice(channelId + 1)];
    }
    case ADD_CHANNEL_EFFECT: {
      const {channelId, effect} = value;
      const channel = state[channelId];
      const {effects} = channel;
      return [...state.slice(0, channelId),
              {...channel, effects: [...effects, effect]},
              ...state.slice(channelId + 1)];
    }
    case MOVE_CHANNEL_SOURCE_DOWN: {
      const {channelId, sourceId} = value;
      const channel = state[channelId];
      const {sources} = channel;
      return [...state.slice(0, channelId),
              {...channel, sources: [...sources.slice(0, sourceId),
                                     sources[sourceId + 1],
                                     sources[sourceId],
                                     ...sources.slice(sourceId + 2)]},
              ...state.slice(channelId + 1)];
    }
    case MOVE_CHANNEL_SOURCE_UP: {
      const {channelId, sourceId} = value;
      const channel = state[channelId];
      const {sources} = channel;
      return [...state.slice(0, channelId),
              {...channel, sources: [...sources.slice(0, sourceId - 1),
                                     sources[sourceId],
                                     sources[sourceId - 1],
                                     ...sources.slice(sourceId + 1)]},
              ...state.slice(channelId + 1)];
    }
    case MOVE_CHANNEL_EFFECT_DOWN: {
      const {channelId, effectId} = value;
      const channel = state[channelId];
      const {effects} = channel;
      return [...state.slice(0, channelId),
              {...channel, effects: [...effects.slice(0, effectId),
                                     effects[effectId + 1],
                                     effects[effectId],
                                     ...effects.slice(effectId + 2)]},
              ...state.slice(channelId + 1)];
    }
    case MOVE_CHANNEL_EFFECT_UP: {
      const {channelId, effectId} = value;
      const channel = state[channelId];
      const {effects} = channel;
      return [...state.slice(0, channelId),
              {...channel, effects: [...effects.slice(0, effectId - 1),
                                     effects[effectId],
                                     effects[effectId - 1],
                                     ...effects.slice(effectId + 1)]},
              ...state.slice(channelId + 1)];
    }
    case REMOVE_CHANNEL_SOURCE: {
      const {channelId, sourceId} = value;
      const channel = state[channelId];
      const {selectedAddSource, sources} = channel;
      const source = sources[sourceId];
      return [...state.slice(0, channelId),
              {...channel,
               sources: [...sources.slice(0, sourceId),
                         ...sources.slice(sourceId + 1)],
               selectedAddSource: selectedAddSource || source},
              ...state.slice(channelId + 1)];
    }
    case REMOVE_CHANNEL:
      return [...state.slice(0, value),
              ...state.slice(value + 1)];
    case REMOVE_CHANNEL_EFFECT: {
      const {channelId, effectId} = value;
      const channel = state[channelId];
      const {effects} = channel;
      return [...state.slice(0, channelId),
              {...channel, effects: [...effects.slice(0, effectId),
                                     ...effects.slice(effectId + 1)]},
              ...state.slice(channelId + 1)];
    }
    case UPDATE_SELECTED_ADD_SOURCE: {
      const {channelId, selectedAddSource} = value;
      const channel = state[channelId];
      return [...state.slice(0, channelId),
              {...channel, selectedAddSource},
              ...state.slice(channelId + 1)];
    }
    case UPDATE_SELECTED_ADD_EFFECT: {
      const {channelId, selectedAddEffect} = value;
      const channel = state[channelId];
      return [...state.slice(0, channelId),
              {...channel, selectedAddEffect},
              ...state.slice(channelId + 1)];
    }
    default:
      return state;
  }
};
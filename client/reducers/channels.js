import {MOVE_CHANNEL_SOURCE_DOWN,
        MOVE_CHANNEL_SOURCE_UP,
        MOVE_EFFECT_SOURCE_DOWN,
        MOVE_EFFECT_SOURCE_UP,
        REMOVE_CHANNEL_SOURCE,
        REMOVE_CHANNEL_EFFECT} from '../actions';

export const initialState = [
  {
    sources: [
      'sawtooth',
      'sine',
      'square',
      'triangle',
    ],
    effects: [
      'pingPongDelay',
      'reverb mausoleum',
    ],
  },
  {
    sources: [
      'sine',
    ],
    effects: [
      'pingPongDelay',
    ],
  },
];

export default (state = initialState, {type, value}) => {
  switch (type) {
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
    case MOVE_EFFECT_SOURCE_DOWN: {
      const {channelId, effectId} = value;
      const channel = state[channelId];
      const {effects} = channel;
      return [...state.slice(0, effectId),
              {...channel, effects: [...effects.slice(0, effectId),
                                     effects[effectId + 1],
                                     effects[effectId],
                                     ...effects.slice(effectId + 2)]},
              ...state.slice(channelId + 1)];
    }
    case MOVE_EFFECT_SOURCE_UP: {
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
      const {sources} = channel;
      return [...state.slice(0, channelId),
              {...channel, sources: [...sources.slice(0, sourceId),
                                     ...sources.slice(sourceId + 1)]},
              ...state.slice(channelId + 1)];
    }
    case REMOVE_CHANNEL_EFFECT: {
      const {channelId, effectId} = value;
      const channel = state[channelId];
      const {effects} = channel;
      return [...state.slice(0, channelId),
              {...channel, effects: [...effects.slice(0, effectId),
                                     ...effects.slice(effectId + 1)]},
              ...state.slice(channelId + 1)];
    }
    default:
      return state;
  }
};

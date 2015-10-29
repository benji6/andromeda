import {REMOVE_CHANNEL_SOURCE,
        REMOVE_CHANNEL_EFFECT} from '../actions';

export const initialState = [
  {
    sources: [
      'sine',
      'sawtooth',
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
      const {sources} = channel;
      return [...state.slice(0, channelId),
              {...channel, effects: [...sources.slice(0, effectId),
                                     ...sources.slice(effectId + 1)]},
              ...state.slice(channelId + 1)];
    }
    default:
      return state;
  }
};

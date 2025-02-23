import audioContext from "../audioContext";
import pluginWrapperInstrument from "../utils/pluginWrapperInstrument";
import pluginWrapperEffect from "../utils/pluginWrapperEffect";
import {
  ADD_EFFECT_TO_CHANNEL,
  ADD_INSTRUMENT_TO_CHANNEL,
  INSTANTIATE_EFFECT,
  INSTANTIATE_INSTRUMENT,
  LOAD_PLUGIN_EFFECT,
  LOAD_PLUGIN_INSTRUMENT,
} from "../actions";

const findNameEquals = (x, y) => y.find(({ name }) => x === name);
const findConstructor = (x, y) => findNameEquals(x, y).constructor;

const channel = (a, b) => findNameEquals(a, b.channels);
const effectInstance = (a, b) => findNameEquals(a, b.effectInstances).instance;
const effectInstanceDestination = (x, y) => effectInstance(x, y).destination;
const instrumentInstance = (a, b) =>
  findNameEquals(a, b.instrumentInstances).instance;

const initialState = {
  channels: [{ effects: [], instruments: [], name: 0 }],
  effectInstances: [],
  effectPlugins: [],
  instrumentInstances: [],
  instrumentPlugins: [],
};

const connectToAudioCtx = (x) => (x.connect(audioContext.destination), x);
const disconnect = (x) => (x.disconnect(), x);

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case ADD_EFFECT_TO_CHANNEL: {
      const thisEffectInstance = effectInstance(payload.name, state);
      const { effects } = channel(payload.channel, state);
      if (!effects.length) connectToAudioCtx(thisEffectInstance);
      else {
        thisEffectInstance.connect(
          effectInstanceDestination(effects[effects.length - 1], state),
        );
      }
      for (const name of channel(payload.channel, state).instruments)
        disconnect(instrumentInstance(name, state)).connect(
          thisEffectInstance.destination,
        );
      return {
        ...state,
        channels: state.channels.map((channel, i) => {
          if (i !== payload.channel) return channel;
          return { ...channel, effects: [...channel.effects, payload.name] };
        }),
      };
    }
    case ADD_INSTRUMENT_TO_CHANNEL: {
      const instrument = state.instrumentInstances.find(
        ({ name }) => name === payload.name,
      ).instance;
      instrument.disconnect();
      const effects = channel(payload.channel, state);
      if (!effects.length) connectToAudioCtx(instrument);
      else
        instrument.connect(
          effectInstanceDestination(effects[effects.length - 1], state),
        );
      return {
        ...state,
        channels: state.channels.map((channel, i) => {
          if (i !== payload.channel) return channel;
          return {
            ...channel,
            instruments: [...channel.instruments, payload.name],
          };
        }),
      };
    }
    case INSTANTIATE_EFFECT: {
      const instance = pluginWrapperEffect(
        new (findConstructor(payload.plugin, state.effectPlugins))({
          audioContext,
          bpm: payload.bpm,
        }),
      );
      return {
        ...state,
        effectInstances: [
          ...state.effectInstances,
          { instance, name: payload.name },
        ],
      };
    }
    case INSTANTIATE_INSTRUMENT: {
      const instance = pluginWrapperInstrument(
        new (findConstructor(payload.plugin, state.instrumentPlugins))({
          audioContext,
          bpm: payload.bpm,
        }),
      );
      connectToAudioCtx(instance);
      return {
        ...state,
        instrumentInstances: [
          ...state.instrumentInstances,
          { instance, name: payload.name },
        ],
      };
    }
    case LOAD_PLUGIN_INSTRUMENT:
      return {
        ...state,
        instrumentPlugins: [...state.instrumentPlugins, payload],
      };
    case LOAD_PLUGIN_EFFECT:
      return {
        ...state,
        effectPlugins: [...state.effectPlugins, payload],
      };
    default:
      return state;
  }
};

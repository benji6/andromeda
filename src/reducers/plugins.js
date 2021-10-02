import audioContext from "../audioContext";
import pluginWrapperInstrument from "../utils/pluginWrapperInstrument";
import pluginWrapperEffect from "../utils/pluginWrapperEffect";
import { adjust } from "ramda";
import {
  ADD_EFFECT_TO_CHANNEL,
  ADD_INSTRUMENT_TO_CHANNEL,
  INSTANTIATE_EFFECT,
  INSTANTIATE_INSTRUMENT,
  LOAD_PLUGIN_EFFECT,
  LOAD_PLUGIN_INSTRUMENT,
} from "../actions";
import store from "../store";

const nameEquals = (x) => (y) => x === y.name;
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
          effectInstanceDestination(effects[effects.length - 1], state)
        );
      }
      for (const name of channel(payload.channel, state).instruments)
        disconnect(instrumentInstance(name, state)).connect(
          thisEffectInstance.destination
        );
      return {
        ...state,
        channels: adjust(
          (channel) => ({
            ...channel,
            effects: [...channel.effects, payload.name],
          }),
          state.channels.findIndex(
            (channel) => channel.name === payload.channel
          ),
          state.channels
        ),
      };
    }
    case ADD_INSTRUMENT_TO_CHANNEL: {
      const instrument = state.instrumentInstances.find(
        ({ name }) => name === payload.name
      ).instance;
      instrument.disconnect();
      const effects = channel(payload.channel, state);
      if (!effects.length) connectToAudioCtx(instrument);
      else
        instrument.connect(
          effectInstanceDestination(effects[effects.length - 1], state)
        );
      return {
        ...state,
        channels: adjust(
          (channel) => ({
            ...channel,
            instruments: [...channel.instruments, payload.name],
          }),
          state.channels.findIndex(nameEquals(payload.channel)),
          state.channels
        ),
      };
    }
    case INSTANTIATE_EFFECT: {
      const instance = pluginWrapperEffect(
        new (findConstructor(payload.plugin, state.effectPlugins))({
          audioContext,
          bpm: store.getState().settings.bpm,
        })
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
          bpm: store.getState().settings.bpm,
        })
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

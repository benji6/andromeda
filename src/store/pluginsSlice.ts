import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import audioContext from "../audioContext";
import pluginWrapperInstrument from "../utils/pluginWrapperInstrument";
import pluginWrapperEffect from "../utils/pluginWrapperEffect";

const findNameEquals = (x, y) => y.find(({ name }) => x === name);
const findConstructor = (x, y) => findNameEquals(x, y).constructor;

const initialState = {
  channels: [{ effects: [], instruments: [], name: 0 }],
  effectInstances: [],
  effectPlugins: [],
  instrumentInstances: [],
  instrumentPlugins: [],
};

const connectToAudioCtx = (x) => (x.connect(audioContext.destination), x);
const disconnect = (x) => (x.disconnect(), x);

export default createSlice({
  name: "plugins",
  initialState,
  reducers: {
    addEffectToChannel: (
      state,
      action: PayloadAction<{ name: string; channel: number }>,
    ) => {
      const { name, channel } = action.payload;
      const thisEffectInstance = findNameEquals(
        name,
        state.effectInstances,
      ).instance;
      const channelObj = state.channels[channel];

      // Connect effect to audio context if it's the first one
      if (!channelObj.effects.length) {
        connectToAudioCtx(thisEffectInstance);
      } else {
        const lastEffect = channelObj.effects[channelObj.effects.length - 1];
        const lastEffectInstance = findNameEquals(
          lastEffect,
          state.effectInstances,
        ).instance;
        thisEffectInstance.connect(lastEffectInstance.destination);
      }

      // Reconnect instruments
      for (const instName of channelObj.instruments) {
        const instrument = findNameEquals(
          instName,
          state.instrumentInstances,
        ).instance;
        disconnect(instrument).connect(thisEffectInstance.destination);
      }

      // Add effect to channel
      state.channels[channel].effects.push(name);
    },

    addInstrumentToChannel: (
      state,
      action: PayloadAction<{ name: string; channel: number }>,
    ) => {
      const { name, channel } = action.payload;
      const instrument = findNameEquals(
        name,
        state.instrumentInstances,
      ).instance;

      disconnect(instrument);
      const channelObj = state.channels[channel];

      if (!channelObj.effects.length) {
        connectToAudioCtx(instrument);
      } else {
        const lastEffect = channelObj.effects[channelObj.effects.length - 1];
        const lastEffectInstance = findNameEquals(
          lastEffect,
          state.effectInstances,
        ).instance;
        instrument.connect(lastEffectInstance.destination);
      }

      state.channels[channel].instruments.push(name);
    },

    instantiateEffect: (
      state,
      action: PayloadAction<{ plugin: string; name: string; bpm: number }>,
    ) => {
      const { plugin, name, bpm } = action.payload;
      const Constructor = findConstructor(plugin, state.effectPlugins);
      const instance = pluginWrapperEffect(
        new Constructor({
          audioContext,
          bpm,
        }),
      );

      state.effectInstances.push({ instance, name });
    },

    instantiateInstrument: (
      state,
      action: PayloadAction<{ plugin: string; name: string; bpm: number }>,
    ) => {
      const { plugin, name, bpm } = action.payload;
      const Constructor = findConstructor(plugin, state.instrumentPlugins);
      const instance = pluginWrapperInstrument(
        new Constructor({
          audioContext,
          bpm,
        }),
      );

      connectToAudioCtx(instance);
      state.instrumentInstances.push({ instance, name });
    },

    loadPluginInstrument: (state, action: PayloadAction<any>) => {
      state.instrumentPlugins.push(action.payload);
    },

    loadPluginEffect: (state, action: PayloadAction<any>) => {
      state.effectPlugins.push(action.payload);
    },
  },
  selectors: {
    plugins: (state) => state,
  },
});

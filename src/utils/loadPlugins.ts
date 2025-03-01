import store from "../store";

import Ariadne from "../plugins/instruments/Ariadne";
import Prometheus from "../plugins/instruments/Prometheus";

import Delay from "../plugins/effects/Delay";
import Leveller from "../plugins/effects/Leveller";
import pluginsSlice from "../store/pluginsSlice";

store.dispatch(
  pluginsSlice.actions.loadPluginInstrument({
    constructor: Ariadne,
    name: "Ariadne",
  }),
);
store.dispatch(
  pluginsSlice.actions.loadPluginInstrument({
    constructor: Prometheus,
    name: "Prometheus",
  }),
);

store.dispatch(
  pluginsSlice.actions.loadPluginEffect({ constructor: Delay, name: "Delay" }),
);
store.dispatch(
  pluginsSlice.actions.loadPluginEffect({
    constructor: Leveller,
    name: "Leveller",
  }),
);

const bpm = store.getState().settings.bpm;

store.dispatch(
  pluginsSlice.actions.instantiateInstrument({
    bpm,
    name: "Ariadne",
    plugin: "Ariadne",
  }),
);
store.dispatch(
  pluginsSlice.actions.instantiateInstrument({
    bpm,
    name: "Prometheus",
    plugin: "Prometheus",
  }),
);

store.dispatch(
  pluginsSlice.actions.instantiateEffect({
    bpm,
    name: "Delay",
    plugin: "Delay",
  }),
);
store.dispatch(
  pluginsSlice.actions.instantiateEffect({
    bpm,
    name: "Leveller",
    plugin: "Leveller",
  }),
);

store.dispatch(
  pluginsSlice.actions.addInstrumentToChannel({ channel: 0, name: "Ariadne" }),
);
store.dispatch(
  pluginsSlice.actions.addInstrumentToChannel({
    channel: 0,
    name: "Prometheus",
  }),
);

store.dispatch(
  pluginsSlice.actions.addEffectToChannel({ channel: 0, name: "Leveller" }),
);
store.dispatch(
  pluginsSlice.actions.addEffectToChannel({ channel: 0, name: "Delay" }),
);

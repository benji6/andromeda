import store from "../store";

import Ariadne from "../plugins/instruments/Ariadne";
import Prometheus from "../plugins/instruments/Prometheus";

import Delay from "../plugins/effects/Delay";
import Leveller from "../plugins/effects/Leveller";

import {
  addEffectToChannel,
  addInstrumentToChannel,
  instantiateEffect,
  instantiateInstrument,
  loadPluginEffect,
  loadPluginInstrument,
} from "../actions";

store.dispatch(loadPluginInstrument({ constructor: Ariadne, name: "Ariadne" }));
store.dispatch(
  loadPluginInstrument({ constructor: Prometheus, name: "Prometheus" }),
);

store.dispatch(loadPluginEffect({ constructor: Delay, name: "Delay" }));
store.dispatch(loadPluginEffect({ constructor: Leveller, name: "Leveller" }));

const bpm = store.getState().settings.bpm;

store.dispatch(
  instantiateInstrument({ bpm, name: "Ariadne", plugin: "Ariadne" }),
);
store.dispatch(
  instantiateInstrument({ bpm, name: "Prometheus", plugin: "Prometheus" }),
);

store.dispatch(instantiateEffect({ bpm, name: "Delay", plugin: "Delay" }));
store.dispatch(
  instantiateEffect({ bpm, name: "Leveller", plugin: "Leveller" }),
);

store.dispatch(addInstrumentToChannel({ channel: 0, name: "Ariadne" }));
store.dispatch(addInstrumentToChannel({ channel: 0, name: "Prometheus" }));

store.dispatch(addEffectToChannel({ channel: 0, name: "Leveller" }));
store.dispatch(addEffectToChannel({ channel: 0, name: "Delay" }));

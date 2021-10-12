import store from "../store";

import Ariadne from "../plugins/instruments/Ariadne";
import Microphone from "../plugins/instruments/Microphone";
import Prometheus from "../plugins/instruments/Prometheus";

import Delay from "../plugins/effects/Delay";
import Leveller from "../plugins/effects/Leveller";
import Overdrive from "../plugins/effects/Overdrive";
import Reverb from "../plugins/effects/Reverb";

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
  loadPluginInstrument({ constructor: Microphone, name: "Microphone" })
);
store.dispatch(
  loadPluginInstrument({ constructor: Prometheus, name: "Prometheus" })
);

store.dispatch(loadPluginEffect({ constructor: Delay, name: "Delay" }));
store.dispatch(loadPluginEffect({ constructor: Leveller, name: "Leveller" }));
store.dispatch(loadPluginEffect({ constructor: Overdrive, name: "Overdrive" }));
store.dispatch(loadPluginEffect({ constructor: Reverb, name: "Reverb" }));

const bpm = store.getState().settings.bpm;

store.dispatch(
  instantiateInstrument({ bpm, name: "Ariadne", plugin: "Ariadne" })
);
store.dispatch(
  instantiateInstrument({ bpm, name: "Microphone", plugin: "Microphone" })
);
store.dispatch(
  instantiateInstrument({ bpm, name: "Prometheus", plugin: "Prometheus" })
);

store.dispatch(instantiateEffect({ bpm, name: "Delay", plugin: "Delay" }));
store.dispatch(
  instantiateEffect({ bpm, name: "Leveller", plugin: "Leveller" })
);
store.dispatch(
  instantiateEffect({ bpm, name: "Overdrive", plugin: "Overdrive" })
);
store.dispatch(instantiateEffect({ bpm, name: "Reverb", plugin: "Reverb" }));

store.dispatch(addInstrumentToChannel({ channel: 0, name: "Ariadne" }));
store.dispatch(addInstrumentToChannel({ channel: 0, name: "Microphone" }));
store.dispatch(addInstrumentToChannel({ channel: 0, name: "Prometheus" }));

store.dispatch(addEffectToChannel({ channel: 0, name: "Leveller" }));
store.dispatch(addEffectToChannel({ channel: 0, name: "Delay" }));

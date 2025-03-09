import store from "../store";

import Delay from "../plugins/effects/Delay";
import Leveller from "../plugins/effects/Leveller";
import pluginsSlice from "../store/pluginsSlice";

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
  pluginsSlice.actions.addEffectToChannel({ channel: 0, name: "Leveller" }),
);
store.dispatch(
  pluginsSlice.actions.addEffectToChannel({ channel: 0, name: "Delay" }),
);

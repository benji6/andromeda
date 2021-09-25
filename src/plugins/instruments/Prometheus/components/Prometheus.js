import { createElement } from "react";
import ModuleFilter from "./ModuleFilter";
import ModuleLfo from "./ModuleLfo";
import ModuleMaster from "./ModuleMaster";
import ModuleOscSingle from "./ModuleOscSingle";
import ModuleOscSuper from "./ModuleOscSuper";

const blue = "#ace";
const size5 = "1rem";
const size6 = "1.25rem";

export default ({
  filter,
  lfo,
  master,
  oscillatorSingles,
  oscillatorSupers,
  updateFilter,
  updateLfo,
  updateMaster,
  updateOscSingle,
  updateOscSuper,
}) =>
  createElement(
    "div",
    { style: { color: blue, textAlign: "center" } },
    createElement(
      "h2",
      { style: { fontSize: size6, margin: size5 } },
      "PROMETHEUS"
    ),
    createElement(ModuleMaster, { master, updateMaster }),
    createElement(
      "div",
      null,
      createElement(ModuleFilter, {
        frequency: filter.frequency,
        gain: filter.gain,
        Q: filter.Q,
        type: filter.type,
        updateFilter,
      }),
      createElement(ModuleLfo, { lfo, updateLfo })
    ),
    createElement(
      "div",
      null,
      oscillatorSupers.map(
        ({ detune, gain, id, numberOfOscillators, pan, pitch, spread, type }) =>
          createElement(ModuleOscSuper, {
            detune,
            gain,
            id,
            key: id,
            numberOfOscillators,
            pan,
            pitch,
            spread,
            type,
            updateOsc: updateOscSuper(id),
          })
      )
    ),
    oscillatorSingles.map(({ detune, gain, id, pan, pitch, type }) =>
      createElement(ModuleOscSingle, {
        detune,
        gain,
        id,
        key: id,
        pan,
        pitch,
        type,
        updateOsc: updateOscSingle(id),
      })
    )
  );

import ModuleFilter from "./ModuleFilter";
import ModuleLfo from "./ModuleLfo";
import ModuleMaster from "./ModuleMaster";
import ModuleOscSingle from "./ModuleOscSingle";
import ModuleOscSuper from "./ModuleOscSuper";

const blue = "#ace";
const size5 = "1rem";
const size6 = "1.25rem";

const Prometheus = ({
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
}) => (
  <div style={{ color: blue, textAlign: "center" }}>
    <h2 style={{ fontSize: size6, margin: size5 }}>PROMETHEUS</h2>
    <ModuleMaster master={master} updateMaster={updateMaster} />
    <div>
      <ModuleFilter
        frequency={filter.frequency}
        gain={filter.gain}
        Q={filter.Q}
        type={filter.type}
        updateFilter={updateFilter}
      />
      <ModuleLfo lfo={lfo} updateLfo={updateLfo} />
    </div>
    <div>
      {oscillatorSupers.map(
        ({
          detune,
          gain,
          id,
          numberOfOscillators,
          pan,
          pitch,
          spread,
          type,
        }) => (
          <ModuleOscSuper
            key={id}
            detune={detune}
            gain={gain}
            id={id}
            numberOfOscillators={numberOfOscillators}
            pan={pan}
            pitch={pitch}
            spread={spread}
            type={type}
            updateOsc={updateOscSuper(id)}
          />
        ),
      )}
    </div>
    {oscillatorSingles.map(({ detune, gain, id, pan, pitch, type }) => (
      <ModuleOscSingle
        key={id}
        detune={detune}
        gain={gain}
        id={id}
        pan={pan}
        pitch={pitch}
        type={type}
        updateOsc={updateOscSingle(id)}
      />
    ))}
  </div>
);

export default Prometheus;

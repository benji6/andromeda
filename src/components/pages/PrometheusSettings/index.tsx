import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ButtonPrimary from "../../atoms/ButtonPrimary";
import ModuleMaster from "./ModuleMaster";
import ModuleFilter from "./ModuleFilter";
import ModuleLfo from "./ModuleLfo";
import ModuleOscSuper from "./ModuleOscSuper";
import ModuleOscSingle from "./ModuleOscSingle";
import prometheusSlice from "../../../store/prometheusSlice";

export default function PrometheusSettings() {
  const navigate = useNavigate();

  const oscillatorSingles = useSelector(
    prometheusSlice.selectors.oscillatorSingles,
  );
  const oscillatorSupers = useSelector(
    prometheusSlice.selectors.oscillatorSupers,
  );

  return (
    // TOOD: something about this reused classname...
    <div className="Instrument">
      <div style={{ color: "#ace", textAlign: "center" }}>
        <h2 style={{ fontSize: "1.25rem", margin: "1rem" }}>PROMETHEUS</h2>
        <ModuleMaster />
        <div>
          <ModuleFilter />
          <ModuleLfo />
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
          />
        ))}
      </div>
      <ButtonPrimary onClick={() => navigate(-1)}>OK</ButtonPrimary>
    </div>
  );
}

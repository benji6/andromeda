import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ButtonPrimary from "../atoms/ButtonPrimary";
import ControlModule, { Range, Select } from "../organisms/ControlModule";
import ariadneSlice from "../../store/ariadneSlice";

export default function AriadneSettings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const carrierDetune = useSelector(ariadneSlice.selectors.carrierDetune);
  const carrierOscType = useSelector(ariadneSlice.selectors.carrierOscType);
  const masterGain = useSelector(ariadneSlice.selectors.masterGain);
  const masterPan = useSelector(ariadneSlice.selectors.masterPan);
  const modulatorDetune = useSelector(ariadneSlice.selectors.modulatorDetune);
  const modulatorOscType = useSelector(ariadneSlice.selectors.modulatorOscType);
  const modulatorRatio = useSelector(ariadneSlice.selectors.modulatorRatio);

  return (
    // TOOD: something about this reused classname...
    <div className="Instrument">
      <div style={{ textAlign: "center" }}>
        <h2>Ariadne</h2>
        <ControlModule>
          <Range
            defaultValue={masterGain}
            label="Gain"
            max={1.25}
            onInput={(e) =>
              dispatch(
                ariadneSlice.actions.masterGainSet(
                  Number(e.currentTarget.value),
                ),
              )
            }
          />
          <Range
            defaultValue={masterPan}
            label="Pan"
            min={-1}
            onInput={(e) =>
              dispatch(
                ariadneSlice.actions.masterPanSet(
                  Number(e.currentTarget.value),
                ),
              )
            }
          />
          <Select
            defaultValue={carrierOscType}
            label="Carrier wave"
            onInput={(e) =>
              dispatch(ariadneSlice.actions.carrierOscTypeSet(e.target.value))
            }
          >
            <option value="sawtooth">Sawtooth</option>
            <option value="sine">Sine</option>
            <option value="square">Square</option>
            <option value="triangle">Triangle</option>
          </Select>
          <Select
            defaultValue={modulatorOscType}
            label="Modulator wave"
            onInput={(e) =>
              dispatch(ariadneSlice.actions.carrierOscTypeSet(e.target.value))
            }
          >
            <option value="sawtooth">Sawtooth</option>
            <option value="sine">Sine</option>
            <option value="square">Square</option>
            <option value="triangle">Triangle</option>
          </Select>
          <Range
            defaultValue={carrierDetune}
            label="Carrier detune"
            max={32}
            min={-32}
            onInput={(e) =>
              dispatch(
                ariadneSlice.actions.carrierDetuneSet(
                  Number(e.currentTarget.value),
                ),
              )
            }
          />
          <Range
            defaultValue={modulatorRatio}
            label="Modulator freq"
            max={8}
            min={0.1}
            onInput={(e) =>
              dispatch(
                ariadneSlice.actions.modulatorRatioSet(
                  Number(e.currentTarget.value),
                ),
              )
            }
          />
          <Range
            defaultValue={modulatorDetune}
            label="Modulator detune"
            max={128}
            min={-128}
            onInput={(e) =>
              dispatch(
                ariadneSlice.actions.modulatorDetuneSet(
                  Number(e.currentTarget.value),
                ),
              )
            }
          />
        </ControlModule>
      </div>
      <ButtonPrimary onClick={() => navigate(-1)}>OK</ButtonPrimary>
    </div>
  );
}

import { useDispatch, useSelector } from "react-redux";
import ButtonPrimary from "../atoms/ButtonPrimary";
import InputLabel from "../atoms/InputLabel";
import CheckboxLabelled from "../molecules/CheckboxLabelled";
import RangeLabelled from "../molecules/RangeLabelled";
import InstrumentSelector from "../molecules/InstrumentSelector";
import { capitalizeWords } from "../../utils/helpers";
import controlPadSlice from "../../store/controlPadSlice";
import pluginsSlice from "../../store/pluginsSlice";

export default function ControlPadSettings() {
  const dispatch = useDispatch();
  const instrument = useSelector(controlPadSlice.selectors.instrument);
  const noScale = useSelector(controlPadSlice.selectors.noScale);
  const octave = useSelector(controlPadSlice.selectors.octave);
  const range = useSelector(controlPadSlice.selectors.range);
  const controllableInstrumentInstanceNames = useSelector(
    pluginsSlice.selectors.controllableInstrumentInstanceNames,
  );

  return (
    <div className="ControlPadSettings">
      <h2>Control Pad Settings</h2>
      <InstrumentSelector
        defaultValue={instrument}
        handleChange={(e) =>
          dispatch(controlPadSlice.actions.instrumentSet(e.currentTarget.value))
        }
        label="Instrument"
        options={controllableInstrumentInstanceNames.map((instrument) => ({
          text: capitalizeWords(instrument),
          value: instrument,
        }))}
      />
      <RangeLabelled
        max={2}
        min={-3}
        onChange={(e) =>
          dispatch(
            controlPadSlice.actions.octaveSet(Number(e.currentTarget.value)),
          )
        }
        output={octave}
        value={octave}
      >
        Octave
      </RangeLabelled>
      <RangeLabelled
        max={3}
        min={1}
        onChange={(e) =>
          dispatch(
            controlPadSlice.actions.rangeSet(Number(e.currentTarget.value)),
          )
        }
        output={range}
        value={range}
      >
        Range
      </RangeLabelled>
      <CheckboxLabelled
        checked={noScale}
        onChange={(e) =>
          dispatch(controlPadSlice.actions.noScaleSet(e.currentTarget.checked))
        }
      >
        No Scale
      </CheckboxLabelled>
      <div>
        <InputLabel />
        <ButtonPrimary to="/">OK</ButtonPrimary>
      </div>
    </div>
  );
}

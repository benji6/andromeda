import { useDispatch, useSelector } from "react-redux";
import ButtonPrimary from "../atoms/ButtonPrimary";
import InputLabel from "../atoms/InputLabel";
import CheckboxLabelled from "../molecules/CheckboxLabelled";
import RangeLabelled from "../molecules/RangeLabelled";
import InstrumentSelector from "../molecules/InstrumentSelector";
import { capitalizeWords } from "../../utils/helpers";
import controlPadSlice from "../../store/controlPadSlice";
import pluginsSlice from "../../store/pluginsSlice";
import noteNameFromPitch from "../../audioHelpers/noteNameFromPitch";
import Selector from "../molecules/Selector";
import scales, { ScaleName } from "../../constants/scales";

const isScaleName = (scaleName: string): scaleName is ScaleName =>
  Object.hasOwn(scales, scaleName);

export default function ControlPadSettings() {
  const dispatch = useDispatch();
  const instrument = useSelector(controlPadSlice.selectors.instrument);
  const noScale = useSelector(controlPadSlice.selectors.noScale);
  const octave = useSelector(controlPadSlice.selectors.octave);
  const range = useSelector(controlPadSlice.selectors.range);
  const controllableInstrumentInstanceNames = useSelector(
    pluginsSlice.selectors.controllableInstrumentInstanceNames,
  );
  const rootNote = useSelector(controlPadSlice.selectors.rootNote);
  const selectedScale = useSelector(controlPadSlice.selectors.selectedScale);

  return (
    <div className="ControlPadSettings">
      <h2>Control Pad Settings</h2>
      <InstrumentSelector
        defaultValue={instrument}
        handleChange={(e) => {
          const { value } = e.currentTarget;
          if (value !== "Ariadne" && value !== "Prometheus")
            throw Error("Invalid instrument");
          dispatch(controlPadSlice.actions.instrumentSet(value));
        }}
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
      <RangeLabelled
        max={24}
        min={-36}
        onChange={(e) =>
          dispatch(
            controlPadSlice.actions.rootNoteSet(Number(e.currentTarget.value)),
          )
        }
        output={noteNameFromPitch(rootNote)}
        value={rootNote}
      >
        Root Note
      </RangeLabelled>
      <Selector
        defaultValue={selectedScale}
        handleChange={(e) => {
          const { value } = e.currentTarget;
          if (!isScaleName(value)) throw Error("Invalid scale");
          dispatch(controlPadSlice.actions.selectedScaleSet(value));
        }}
        label="Scale"
        options={Object.keys(scales).map((value) => ({
          text: capitalizeWords(value),
          value,
        }))}
      />
      <div>
        <InputLabel />
        <ButtonPrimary to="/">OK</ButtonPrimary>
      </div>
    </div>
  );
}

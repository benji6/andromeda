import { connect } from "react-redux";
import { controllableInstrumentInstanceNames } from "../../utils/derivedData";
import {
  controlPadInstrumentSet,
  controlPadNoScaleSet,
  controlPadOctaveSet,
  controlPadRangeSet,
} from "../../actions";
import ButtonPrimary from "../atoms/ButtonPrimary";
import InputLabel from "../atoms/InputLabel";
import CheckboxLabelled from "../molecules/CheckboxLabelled";
import RangeLabelled from "../molecules/RangeLabelled";
import InstrumentSelector from "../molecules/InstrumentSelector";
import { capitalizeWords } from "../../utils/helpers";

const mapStateToProps = ({ controlPad, dispatch, plugins }) => ({
  controlPad,
  dispatch,
  plugins,
});

// TODO fix these types
interface Props {
  controlPad: any;
  dispatch: any;
  plugins: any;
}

const ControlPadSettings = ({ controlPad, dispatch, plugins }: Props) => (
  <div className="ControlPadSettings">
    <h2>Control Pad Settings</h2>
    <InstrumentSelector
      defaultValue={controlPad.instrument}
      handleChange={(e) =>
        dispatch(controlPadInstrumentSet(e.currentTarget.value))
      }
      label="Instrument"
      options={controllableInstrumentInstanceNames(plugins).map(
        (instrument) => ({
          text: capitalizeWords(instrument),
          value: instrument,
        }),
      )}
    />
    <RangeLabelled
      max={2}
      min={-3}
      onChange={(e) =>
        dispatch(controlPadOctaveSet(Number(e.currentTarget.value)))
      }
      output={controlPad.octave}
      value={controlPad.octave}
    >
      Octave
    </RangeLabelled>
    <RangeLabelled
      max={3}
      min={1}
      onChange={(e) =>
        dispatch(controlPadRangeSet(Number(e.currentTarget.value)))
      }
      output={controlPad.range}
      value={controlPad.range}
    >
      Range
    </RangeLabelled>
    <CheckboxLabelled
      checked={controlPad.noScale}
      onChange={(e) => dispatch(controlPadNoScaleSet(e.currentTarget.checked))}
    >
      No Scale
    </CheckboxLabelled>
    <div>
      <InputLabel />
      <ButtonPrimary to="/">OK</ButtonPrimary>
    </div>
  </div>
);

export default connect(mapStateToProps)(ControlPadSettings);

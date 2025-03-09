import InstrumentSelector from "../molecules/InstrumentSelector";
import ButtonPrimary from "../atoms/ButtonPrimary";
import InputLabel from "../atoms/InputLabel";
import CheckboxLabelled from "../molecules/CheckboxLabelled";
import RangeLabelled from "../molecules/RangeLabelled";
import { useDispatch, useSelector } from "react-redux";
import keyboardSlice from "../../store/keyboardSlice";

export default function KeyboardSettings() {
  const dispatch = useDispatch();
  const instrument = useSelector(keyboardSlice.selectors.instrument);
  const monophonic = useSelector(keyboardSlice.selectors.monophonic);
  const octave = useSelector(keyboardSlice.selectors.octave);
  const volume = useSelector(keyboardSlice.selectors.volume);

  return (
    <div className="KeyboardSettings">
      <h2>Keyboard Settings</h2>
      <InstrumentSelector
        defaultValue={instrument}
        handleChange={(e) =>
          dispatch(keyboardSlice.actions.instrumentSet(e.currentTarget.value))
        }
        label="Instrument"
      />
      <RangeLabelled
        max={1}
        min={0}
        onChange={(e) =>
          dispatch(
            keyboardSlice.actions.volumeSet(Number(e.currentTarget.value)),
          )
        }
        output={Math.round(volume * 100)}
        step={0.01}
        value={volume}
      >
        Volume
      </RangeLabelled>
      <RangeLabelled
        max={2}
        min={-3}
        onChange={(e) =>
          dispatch(
            keyboardSlice.actions.octaveSet(Number(e.currentTarget.value)),
          )
        }
        output={octave}
        value={octave}
      >
        Octave
      </RangeLabelled>
      <CheckboxLabelled
        checked={monophonic}
        onChange={(e) =>
          dispatch(keyboardSlice.actions.monophonicSet(e.target.checked))
        }
      >
        Monophonic
      </CheckboxLabelled>
      <div>
        <InputLabel />
        <ButtonPrimary to="/settings">OK</ButtonPrimary>
      </div>
    </div>
  );
}

import { createStore, connect } from "st88";
import ControlModule, {
  Range,
  Select,
} from "../../components/organisms/ControlModule";
import { createRoot } from "react-dom/client";

const outputs = new WeakMap();
const stores = new WeakMap();

export default class {
  constructor({ audioContext }) {
    const output = audioContext.createGain();
    const store = createStore({
      carrierDetune: 0,
      carrierOscType: "sine",
      masterGain: 1,
      masterPan: 0,
      modulatorDetune: 0,
      modulatorOscType: "sine",
      modulatorRatio: 2.5,
      output,
    });

    stores.set(this, store);
    outputs.set(this, output);
  }
  connect(destination) {
    outputs.get(this).connect(destination);
  }
  disconnect(destination) {
    outputs.get(this).disconnect(destination);
  }
  noteStart() {}
  noteModify() {}
  noteStop() {}
  render(containerEl) {
    const store = stores.get(this);
    const setPropFromRangeEvent = (key) => (e) =>
      store.dispatch((state) =>
        Object.assign({}, state, { [key]: Number(e.target.value) }),
      );
    const setPropFromSelectEvent = (key) => (e) =>
      store.dispatch((state) =>
        Object.assign({}, state, { [key]: e.target.value }),
      );

    createRoot(containerEl).render(
      connect(store)(
        ({
          carrierDetune,
          carrierOscType,
          masterGain,
          masterPan,
          modulatorDetune,
          modulatorOscType,
          modulatorRatio,
        }) => (
          <div style={{ textAlign: "center" }}>
            <h2>Ariadne</h2>
            <ControlModule>
              <Range
                defaultValue={masterGain}
                label="Gain"
                max={1.25}
                onInput={setPropFromRangeEvent("masterGain")}
              />
              <Range
                defaultValue={masterPan}
                label="Pan"
                min={-1}
                onInput={setPropFromRangeEvent("masterPan")}
              />
              <Select
                defaultValue={carrierOscType}
                label="Carrier wave"
                onInput={setPropFromSelectEvent("carrierOscType")}
              >
                <option value="sawtooth">Sawtooth</option>
                <option value="sine">Sine</option>
                <option value="square">Square</option>
                <option value="triangle">Triangle</option>
              </Select>
              <Select
                defaultValue={modulatorOscType}
                label="Modulator wave"
                onInput={setPropFromSelectEvent("modulatorOscType")}
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
                onInput={setPropFromRangeEvent("carrierDetune")}
              />
              <Range
                defaultValue={modulatorRatio}
                label="Modulator freq"
                max={8}
                min={0.1}
                onInput={setPropFromRangeEvent("modulatorRatio")}
              />
              <Range
                defaultValue={modulatorDetune}
                label="Modulator detune"
                max={128}
                min={-128}
                onInput={setPropFromRangeEvent("modulatorDetune")}
              />
            </ControlModule>
          </div>
        ),
      ),
    );
  }
}

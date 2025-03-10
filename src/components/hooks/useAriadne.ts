import {
  createNode,
  gain,
  oscillator,
  OUTPUT,
  stereoPanner,
} from "virtual-audio-graph";
import { Note } from "../../types";
import { useSelector } from "react-redux";
import ariadneSlice from "../../store/ariadneSlice";
import { ariadneActiveNotesSelector } from "../../store/selectors";

const oscBank = createNode(
  ({
    carrierDetune,
    carrierOscType,
    gain: gainValue,
    frequency,
    masterGain,
    masterPan,
    modulatorDetune,
    modulatorOscType,
    modulatorRatio,
  }: {
    carrierDetune: number;
    carrierOscType: OscillatorType;
    gain: number;
    frequency: number;
    masterGain: number;
    masterPan: number;
    modulatorDetune: number;
    modulatorOscType: OscillatorType;
    modulatorRatio: number;
  }) => ({
    0: gain(["masterPan"], { gain: gainValue / 2 }),
    1: oscillator(0, {
      detune: carrierDetune,
      frequency,
      type: carrierOscType,
    }),
    2: gain({ destination: "frequency", key: 1 }, { gain: 1024 }),
    3: oscillator(2, {
      detune: modulatorDetune,
      frequency: frequency * modulatorRatio,
      type: modulatorOscType,
    }),
    masterGain: gain([OUTPUT], { gain: masterGain }),
    masterPan: stereoPanner(["masterGain"], { pan: masterPan }),
  }),
);

const ariadne = createNode(
  ({
    carrierDetune,
    carrierOscType,
    masterGain,
    masterPan,
    modulatorDetune,
    modulatorOscType,
    modulatorRatio,
    notes,
  }: {
    carrierDetune: number;
    carrierOscType: OscillatorType;
    masterGain: number;
    masterPan: number;
    modulatorDetune: number;
    modulatorOscType: OscillatorType;
    modulatorRatio: number;
    notes: Note[];
  }) =>
    notes.reduce(
      (acc, { frequency, gain, id }) =>
        Object.assign({}, acc, {
          [id]: oscBank(OUTPUT, {
            carrierDetune,
            carrierOscType,
            frequency,
            gain,
            masterGain,
            masterPan,
            modulatorDetune,
            modulatorOscType,
            modulatorRatio,
          }),
        }),
      {},
    ),
);

export default function useAriadne() {
  const ariadneActiveNotes = useSelector(ariadneActiveNotesSelector);

  const carrierDetune = useSelector(ariadneSlice.selectors.carrierDetune);
  const carrierOscType = useSelector(ariadneSlice.selectors.carrierOscType);
  const masterGain = useSelector(ariadneSlice.selectors.masterGain);
  const masterPan = useSelector(ariadneSlice.selectors.masterPan);
  const modulatorDetune = useSelector(ariadneSlice.selectors.modulatorDetune);
  const modulatorOscType = useSelector(ariadneSlice.selectors.modulatorOscType);
  const modulatorRatio = useSelector(ariadneSlice.selectors.modulatorRatio);

  if (!ariadneActiveNotes.length) return;

  return ariadne(0, {
    carrierDetune,
    carrierOscType,
    masterGain,
    masterPan,
    modulatorDetune,
    modulatorOscType,
    modulatorRatio,
    notes: ariadneActiveNotes,
  });
}

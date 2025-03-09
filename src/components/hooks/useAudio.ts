import { useSelector } from "react-redux";
import createVirtualAudioGraph, {
  createNode,
  dynamicsCompressor,
  gain as gainNode,
  oscillator,
  OUTPUT,
  stereoPanner,
} from "virtual-audio-graph";
import controlPadSlice from "../../store/controlPadSlice";
import audioContext from "../../audioContext";
import { Note } from "../../types";

// TODO: this needs to connect to the effects chain
const virtualAudioGraph = createVirtualAudioGraph({ audioContext });

const oscBank = createNode(
  ({
    carrierDetune,
    carrierOscType,
    gain,
    frequency,
    masterGain,
    masterPan,
    modulatorDetune,
    modulatorOscType,
    modulatorRatio,
    startTime,
    stopTime,
  }) => ({
    0: gainNode(["masterPan"], { gain: gain / 2 }),
    1: oscillator(0, {
      detune: carrierDetune,
      frequency,
      startTime,
      stopTime,
      type: carrierOscType,
    }),
    2: gainNode({ destination: "frequency", key: 1 }, { gain: 1024 }),
    3: oscillator(2, {
      detune: modulatorDetune,
      frequency: frequency * modulatorRatio,
      startTime,
      stopTime,
      type: modulatorOscType,
    }),
    masterGain: gainNode([OUTPUT], { gain: masterGain }),
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
    carrierOscType: string;
    masterGain: number;
    masterPan: number;
    modulatorDetune: number;
    modulatorOscType: string;
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

const leveller = createNode(
  ({
    attack,
    gain,
    knee,
    pan,
    ratio,
    release,
    threshold,
  }: {
    attack: number;
    gain: number;
    knee: number;
    pan: number;
    ratio: number;
    release: number;
    threshold: number;
  }) => ({
    0: gainNode(OUTPUT, { gain }),
    1: stereoPanner(0, { pan }),
    2: dynamicsCompressor(
      1,
      { attack, knee, ratio, release, threshold },
      "input",
    ),
  }),
);

export default function useAudio() {
  // TODO implement keyboard input
  const currentNote = useSelector(controlPadSlice.selectors.currentNote);
  const instrument = useSelector(controlPadSlice.selectors.instrument);

  // TODO implement other instruments
  if (instrument !== "Ariadne") return;

  if (!currentNote) {
    virtualAudioGraph.update({});
    return;
  }

  virtualAudioGraph.update({
    0: leveller(OUTPUT, {
      attack: 0,
      gain: 1,
      knee: 30,
      pan: 0,
      ratio: 12,
      release: 0.25,
      threshold: -50,
    }),
    1: ariadne(
      0,
      // TODO store these values in redux and update them here
      {
        carrierDetune: 0,
        carrierOscType: "sine",
        masterGain: 1,
        masterPan: 0,
        modulatorDetune: 0,
        modulatorOscType: "sine",
        modulatorRatio: 2.5,
        notes: currentNote ? [currentNote] : [],
      },
    ),
  });
}

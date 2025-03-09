import { useSelector } from "react-redux";
import createVirtualAudioGraph, {
  biquadFilter,
  createNode,
  delay,
  dynamicsCompressor,
  gain as gainNode,
  INPUT,
  oscillator,
  OUTPUT,
  stereoPanner,
} from "virtual-audio-graph";
import controlPadSlice from "../../store/controlPadSlice";
import audioContext from "../../audioContext";
import { Note } from "../../types";
import ariadneSlice from "../../store/ariadneSlice";

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
      INPUT,
    ),
  }),
);

const pingPongDelay = createNode(
  ({
    delayTime,
    dryLevel,
    feedback,
    highCut,
    lowCut,
    maxDelayTime,
    pingPong,
    wetLevel,
  }: {
    delayTime: number;
    dryLevel: number;
    feedback: number;
    highCut: number;
    lowCut: number;
    maxDelayTime: number;
    pingPong: boolean;
    wetLevel: number;
  }) => ({
    0: gainNode(OUTPUT, { gain: wetLevel }),
    1: stereoPanner(0, { pan: -1 }),
    2: stereoPanner(0, { pan: 1 }),
    3: delay([2, 8], { delayTime, maxDelayTime }),
    4: gainNode(3, { gain: feedback }),
    5: delay(pingPong ? [1, 3] : [0, 8], { delayTime, maxDelayTime }),
    6: biquadFilter(5, { frequency: highCut }),
    7: biquadFilter(6, { frequency: lowCut, type: "highpass" }),
    8: gainNode(7, { gain: feedback }),
    9: gainNode(OUTPUT, { gain: dryLevel }),
    input: gainNode([8, 9], { gain: 1 }, INPUT),
  }),
);

export default function useAudio() {
  // TODO implement keyboard input
  const currentNote = useSelector(controlPadSlice.selectors.currentNote);
  const instrument = useSelector(controlPadSlice.selectors.instrument);
  const carrierDetune = useSelector(ariadneSlice.selectors.carrierDetune);
  const carrierOscType = useSelector(ariadneSlice.selectors.carrierOscType);
  const masterGain = useSelector(ariadneSlice.selectors.masterGain);
  const masterPan = useSelector(ariadneSlice.selectors.masterPan);
  const modulatorDetune = useSelector(ariadneSlice.selectors.modulatorDetune);
  const modulatorOscType = useSelector(ariadneSlice.selectors.modulatorOscType);
  const modulatorRatio = useSelector(ariadneSlice.selectors.modulatorRatio);

  // TODO implement other instruments
  if (instrument !== "Ariadne") return;

  const effectsGraph = {
    0: pingPongDelay(OUTPUT, {
      delayTime: 1 / 3,
      dryLevel: 0.9,
      feedback: 0.25,
      highCut: 16000,
      lowCut: 50,
      maxDelayTime: 1.2,
      pingPong: true,
      wetLevel: 0.6,
    }),
    1: leveller(0, {
      attack: 0,
      gain: 1,
      knee: 30,
      pan: 0,
      ratio: 12,
      release: 0.25,
      threshold: -50,
    }),
  };

  if (currentNote) {
    effectsGraph[2] = ariadne(0, {
      carrierDetune,
      carrierOscType,
      masterGain,
      masterPan,
      modulatorDetune,
      modulatorOscType,
      modulatorRatio,
      notes: [currentNote],
    });
  }
  virtualAudioGraph.update(effectsGraph);
}

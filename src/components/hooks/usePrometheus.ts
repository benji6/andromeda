import {
  biquadFilter,
  createNode,
  gain as gainNode,
  oscillator,
  OUTPUT,
  stereoPanner,
} from "virtual-audio-graph";
import pitchToFrequency from "../../audioHelpers/pitchToFrequency";
import { useSelector } from "react-redux";
import prometheusSlice, { PrometheusState } from "../../store/prometheusSlice";
import { prometheusActiveNotesSelector } from "../../store/selectors";
import { Note } from "../../types";
import { IVirtualAudioNodeGraph } from "virtual-audio-graph/dist/types";

const frequencyToPitch = (frequency: number) => Math.log2(frequency / 440) * 12;

const lfoNode = createNode(
  ({
    frequency,
    gain,
    type,
  }: {
    frequency: number;
    gain: number;
    type: OscillatorType;
  }) => ({
    0: gainNode(OUTPUT, { gain }),
    1: oscillator(0, { frequency, type }),
  }),
);

const osc = createNode(
  ({
    detune = 0,
    frequency,
    gain,
    pan,
    pitch,
    type,
  }: {
    detune: number;
    frequency: number;
    gain: number;
    pan: number;
    pitch: number;
    type: OscillatorType;
  }) => ({
    0: gainNode(OUTPUT, { gain }),
    1: stereoPanner(0, { pan }),
    2: oscillator(1, {
      detune,
      frequency: pitchToFrequency(frequencyToPitch(frequency) + pitch),
      type,
    }),
  }),
);

const prometheus = createNode(
  ({
    filter,
    lfo,
    master,
    oscillatorSingles,
    oscillatorSupers,
    notes,
  }: PrometheusState & { notes: Note[] }) =>
    notes.reduce(
      (acc: IVirtualAudioNodeGraph, { frequency, gain, id }) => {
        const noteGainId = `noteGain-${id}`;
        acc[noteGainId] = gainNode("filter", { gain });

        for (let i = 0; i < oscillatorSingles.length; i++) {
          const oscillatorSingle = oscillatorSingles[i];
          acc[`oscSingle-${oscillatorSingle.id}-${id}`] = osc(
            noteGainId,
            Object.assign({}, oscillatorSingle, {
              frequency,
            }),
          );
        }

        for (let i = 0; i < oscillatorSupers.length; i++) {
          const oscillatorSuper = oscillatorSupers[i];
          const { numberOfOscillators, type } = oscillatorSuper;
          for (let j = 0; j < numberOfOscillators; j++) {
            acc[`oscSuper-${oscillatorSuper.id}-${j}-${id}`] = osc(noteGainId, {
              detune:
                oscillatorSuper.detune +
                (j - Math.floor(numberOfOscillators / 2)) *
                  oscillatorSuper.spread,
              frequency,
              gain: oscillatorSuper.gain,
              pan: oscillatorSuper.pan,
              pitch: oscillatorSuper.pitch,
              type:
                type === "random"
                  ? (["sawtooth", "sine", "square", "triangle"] as const)[
                      Math.floor(Math.random() * 4)
                    ]
                  : type,
            });
          }
        }

        return acc;
      },
      {
        filter: biquadFilter("masterPan", filter),
        lfo: lfoNode({ destination: "frequency", key: "filter" }, lfo),
        masterGain: gainNode(OUTPUT, { gain: master.gain }),
        masterPan: stereoPanner("masterGain", { pan: master.pan }),
      },
    ),
);

export default function usePrometheus() {
  const prometheusActiveNotes = useSelector(prometheusActiveNotesSelector);

  const filter = useSelector(prometheusSlice.selectors.filter);
  const lfo = useSelector(prometheusSlice.selectors.lfo);
  const master = useSelector(prometheusSlice.selectors.master);
  const oscillatorSingles = useSelector(
    prometheusSlice.selectors.oscillatorSingles,
  );
  const oscillatorSupers = useSelector(
    prometheusSlice.selectors.oscillatorSupers,
  );

  if (!prometheusActiveNotes.length) return;

  return prometheus(0, {
    filter,
    lfo,
    master,
    oscillatorSingles,
    oscillatorSupers,
    notes: prometheusActiveNotes,
  });
}

import { createSelector } from "@reduxjs/toolkit";
import ariadneAudioGraphSelector from "./ariadneAudioGraphSelector";
import prometheusAudioGraphSelector from "./prometheusAudioGraphSelector";
import {
  createNode,
  gain,
  OUTPUT,
  stereoPanner,
  dynamicsCompressor,
  INPUT,
  delay,
  biquadFilter,
} from "virtual-audio-graph";
import { IVirtualAudioNodeGraph } from "virtual-audio-graph/dist/types";

const leveller = createNode(
  ({
    attack,
    gain: gainValue,
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
    0: gain(OUTPUT, { gain: gainValue }),
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
    0: gain(OUTPUT, { gain: wetLevel }),
    1: stereoPanner(0, { pan: -1 }),
    2: stereoPanner(0, { pan: 1 }),
    3: delay([2, 8], { delayTime, maxDelayTime }),
    4: gain(3, { gain: feedback }),
    5: delay(pingPong ? [1, 3] : [0, 8], { delayTime, maxDelayTime }),
    6: biquadFilter(5, { frequency: highCut }),
    7: biquadFilter(6, { frequency: lowCut, type: "highpass" }),
    8: gain(7, { gain: feedback }),
    9: gain(OUTPUT, { gain: dryLevel }),
    input: gain([8, 9], { gain: 1 }, INPUT),
  }),
);

export default createSelector(
  ariadneAudioGraphSelector,
  prometheusAudioGraphSelector,
  (ariadneAudioGraph, prometheusAudioGraph) => {
    const audioGraph: IVirtualAudioNodeGraph = {
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
    if (ariadneAudioGraph) audioGraph[2] = ariadneAudioGraph;
    if (prometheusAudioGraph) audioGraph[3] = prometheusAudioGraph;

    return audioGraph;
  },
);

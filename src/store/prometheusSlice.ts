import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PrometheusState {
  filter: {
    frequency: number;
    gain: number;
    Q: number;
    type: BiquadFilterType;
  };
  lfo: {
    frequency: number;
    gain: number;
    type: OscillatorType;
  };
  master: {
    gain: number;
    pan: number;
  };
  oscillatorSingles: {
    detune: number;
    gain: number;
    id: number;
    pan: number;
    pitch: number;
    type: OscillatorType;
  }[];
  oscillatorSupers: {
    detune: number;
    gain: number;
    id: number;
    numberOfOscillators: number;
    pan: number;
    pitch: number;
    spread: number;
    type: OscillatorType;
  }[];
}

const initialState: PrometheusState = {
  filter: {
    frequency: 1300,
    gain: -12,
    Q: 5,
    type: "lowpass",
  },
  lfo: {
    frequency: 0.3,
    gain: 400,
    type: "triangle",
  },
  master: {
    gain: 0.75,
    pan: 0,
  },
  oscillatorSingles: [
    { detune: 13, gain: 0.5, id: 0, pan: 0.4, pitch: -12, type: "triangle" },
    { detune: -7, gain: 0.8, id: 1, pan: 0.1, pitch: -12, type: "square" },
    { detune: 10, gain: 0.2, id: 2, pan: -0.4, pitch: 0, type: "square" },
  ],
  oscillatorSupers: [
    {
      detune: -3,
      gain: 0.35,
      id: 0,
      numberOfOscillators: 5,
      pan: -0.3,
      pitch: 0,
      spread: 6,
      type: "sawtooth",
    },
  ],
};

export default createSlice({
  name: "prometheus",
  initialState,
  reducers: {
    masterGainSet: (state, action: PayloadAction<number>) => {
      state.master.gain = action.payload;
    },
    masterPanSet: (state, action: PayloadAction<number>) => {
      state.master.pan = action.payload;
    },
    filterFrequencySet: (state, action: PayloadAction<number>) => {
      state.filter.frequency = action.payload;
    },
    filterGainSet: (state, action: PayloadAction<number>) => {
      state.filter.gain = action.payload;
    },
    filterQSet: (state, action: PayloadAction<number>) => {
      state.filter.Q = action.payload;
    },
    filterTypeSet: (state, action: PayloadAction<BiquadFilterType>) => {
      state.filter.type = action.payload;
    },
    lfoFrequencySet: (state, action: PayloadAction<number>) => {
      state.lfo.frequency = action.payload;
    },
    lfoGainSet: (state, action: PayloadAction<number>) => {
      state.lfo.gain = action.payload;
    },
    lfoTypeSet: (state, action: PayloadAction<OscillatorType>) => {
      state.lfo.type = action.payload;
    },
    oscillatorSinglesPatch: (
      state,
      action: PayloadAction<
        Partial<PrometheusState["oscillatorSingles"][number]> & { id: number }
      >,
    ) => {
      state.oscillatorSingles[action.payload.id] = {
        ...state.oscillatorSingles[action.payload.id],
        ...action.payload,
      };
    },
    oscillatorSupersPatch: (
      state,
      action: PayloadAction<
        Partial<PrometheusState["oscillatorSupers"][number]> & { id: number }
      >,
    ) => {
      state.oscillatorSupers[action.payload.id] = {
        ...state.oscillatorSupers[action.payload.id],
        ...action.payload,
      };
    },
  },
  selectors: {
    filter: (state) => state.filter,
    lfo: (state) => state.lfo,
    master: (state) => state.master,
    oscillatorSingles: (state) => state.oscillatorSingles,
    oscillatorSupers: (state) => state.oscillatorSupers,
  },
});

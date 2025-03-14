import createVirtualAudioGraph from "virtual-audio-graph";
import { useSelector } from "react-redux";
import audioGraphSelector from "../../store/audioGraphSelector";

const virtualAudioGraph = createVirtualAudioGraph();

export default function useAudio() {
  const audioGraph = useSelector(audioGraphSelector);
  virtualAudioGraph.update(audioGraph);
}

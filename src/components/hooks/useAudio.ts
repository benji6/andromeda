import { useSelector } from "react-redux";
import controlPadSlice from "../../store/controlPadSlice";

export default function useAudio() {
  const currentNote = useSelector(controlPadSlice.selectors.currentNote);
  // TODO: Implement audio logic
  console.log(currentNote);
}

import Router from "./Router";
import useAudio from "./hooks/useAudio";
import usePressedKeyCodes from "./hooks/usePressedKeyCodes";

export default function App() {
  useAudio();
  usePressedKeyCodes();
  return <Router />;
}

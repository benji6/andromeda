import Router from "./Router";
import useAudio from "./hooks/useAudio";

export default function App() {
  useAudio();
  return <Router />;
}

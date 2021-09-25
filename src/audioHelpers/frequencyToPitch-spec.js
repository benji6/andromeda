import test from "tape";
import pitchToFrequency from "./frequencyToPitch";

test("pitchToFrequency", (t) => {
  t.equals(pitchToFrequency(220), -12);
  t.equals(pitchToFrequency(415.3046975799451), -1.0000000000000013);
  t.equals(pitchToFrequency(440), 0);
  t.equals(pitchToFrequency(466.1637615180899), 1.0000000000000009);
  t.equals(pitchToFrequency(493.8833012561241), 2.0000000000000004);
  t.equals(pitchToFrequency(880), 12);
  t.end();
});

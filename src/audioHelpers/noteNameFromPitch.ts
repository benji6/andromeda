const { floor } = Math;
const alphabeticalComponents = [
  "A",
  "A#/Bb",
  "B",
  "C",
  "C#/Db",
  "D",
  "D#/Eb",
  "E",
  "F",
  "F#/Gb",
  "G",
  "G#/Ab",
] as const;

const { length } = alphabeticalComponents;

export default (pitch: number) => {
  const octave = floor(pitch / length) + 4;
  return (
    alphabeticalComponents[((pitch % length) + length) % length] +
    String(octave)
  );
};

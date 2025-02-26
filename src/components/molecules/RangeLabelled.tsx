interface Props {
  children?: string;
  max?: number;
  min?: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  output?: number | string;
  step?: number;
  value: number;
}

const RangeLabelled = ({
  children,
  max,
  min,
  onChange,
  output,
  step,
  value,
}: Props) => {
  if (output === undefined) output = value;
  return (
    <label className="RangeLabelled">
      <div className="RangeLabelled__LabelContainer">
        {children}
        <output>{output}</output>
      </div>
      <input
        className="RangeLabelled__Input"
        max={max}
        min={min}
        onChange={onChange}
        step={step}
        type="range"
        value={value}
      />
    </label>
  );
};

export default RangeLabelled;

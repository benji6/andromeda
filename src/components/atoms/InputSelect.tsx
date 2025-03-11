interface Props {
  disabled?: boolean;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { text: string; value: string }[];
  value: string;
}

const InputSelect = ({ disabled, onChange, options, value }: Props) => (
  <select
    className="ButtonPrimary InputSelect"
    disabled={disabled}
    onChange={onChange}
    value={value}
  >
    {options.map(({ text, value }, i) => (
      <option key={i} value={value}>
        {text}
      </option>
    ))}
  </select>
);

export default InputSelect;

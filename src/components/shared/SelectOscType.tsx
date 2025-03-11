import { Select } from "../organisms/ControlModule";

interface Props {
  defaultValue: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function SelectOscType({ defaultValue, onChange }: Props) {
  return (
    <Select defaultValue={defaultValue} label="Type" onChange={onChange}>
      <option value="sawtooth">Sawtooth</option>
      <option value="sine">Sine</option>
      <option value="square">Square</option>
      <option value="triangle">Triangle</option>
    </Select>
  );
}

import InputLabel from "../atoms/InputLabel";

interface Props {
  checked: boolean;
  children?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxLabelled = ({ checked, onChange, children }: Props) => (
  <label>
    <InputLabel>{children}</InputLabel>
    <div className="CheckboxLabelled__Checkbox">
      <input defaultChecked={checked} onChange={onChange} type="checkbox" />
    </div>
  </label>
);

export default CheckboxLabelled;

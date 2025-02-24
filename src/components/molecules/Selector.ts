import { createElement } from "react";
import { capitalizeFirst } from "../../utils/helpers";
import InputLabel from "../atoms/InputLabel";
import InputSelect from "../atoms/InputSelect";

interface Props {
  defaultValue: string;
  disabled: boolean;
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  label: string;
  options: { text: string; value: string }[];
}

export default function Selector({
  defaultValue,
  disabled,
  handleChange,
  label,
  options,
}: Props) {
  return createElement(
    "label",
    { className: "Selector" },
    createElement(InputLabel, null, capitalizeFirst(label)),
    createElement(InputSelect, {
      disabled,
      onChange: handleChange,
      options,
      value: defaultValue,
    }),
  );
}

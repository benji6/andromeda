import { createElement } from "react";

interface Props {
  disabled: boolean;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { text: string; value: string }[];
  value: string;
}

const InputSelect = ({ disabled, onChange, options, value }: Props) =>
  createElement(
    "select",
    {
      className: "ButtonPrimary InputSelect",
      disabled,
      onChange,
      value,
    },
    options.map(({ text, value }, i) =>
      createElement("option", { key: i, value }, text),
    ),
  );

export default InputSelect;

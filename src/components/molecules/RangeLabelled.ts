import { createElement } from "react";

interface Props {
  children: string;
  max?: number;
  min?: number;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
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
  return createElement(
    "label",
    { className: "RangeLabelled" },
    createElement(
      "div",
      { className: "RangeLabelled__LabelContainer" },
      children,
      createElement("output", null, output),
    ),
    createElement("input", {
      className: "RangeLabelled__Input",
      max,
      min,
      onChange,
      step,
      type: "range",
      value,
    }),
  );
};

export default RangeLabelled;

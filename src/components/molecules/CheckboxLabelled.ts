import { createElement } from "react";
import InputLabel from "../atoms/InputLabel";

interface Props {
  checked: boolean;
  children: string;
  onChange: () => void;
}

const CheckboxLabelled = ({ checked, onChange, children }: Props) =>
  createElement(
    "label",
    null,
    createElement(InputLabel, null, children),
    createElement(
      "div",
      { className: "CheckboxLabelled__Checkbox" },
      createElement("input", {
        defaultChecked: checked,
        onChange,
        type: "checkbox",
      }),
    ),
  );

export default CheckboxLabelled;

import capitalize from "capitalize";
import { createElement } from "react";
import InputLabel from "../atoms/InputLabel";
import InputSelect from "../atoms/InputSelect";

export default ({ defaultValue, disabled, handleChange, label, options }) =>
  createElement(
    "label",
    { className: "Selector" },
    createElement(InputLabel, null, capitalize(label)),
    createElement(InputSelect, {
      disabled,
      onChange: handleChange,
      options,
      value: defaultValue,
    })
  );

import { createElement } from "react";
import { capitalizeFirst } from "../../utils/helpers";
import InputLabel from "../atoms/InputLabel";
import InputSelect from "../atoms/InputSelect";

export default ({ defaultValue, disabled, handleChange, label, options }) =>
  createElement(
    "label",
    { className: "Selector" },
    createElement(InputLabel, null, capitalizeFirst(label)),
    createElement(InputSelect, {
      disabled,
      onChange: handleChange,
      options,
      value: defaultValue,
    })
  );

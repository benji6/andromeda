import { PropTypes } from "prop-types";
import { createElement } from "react";

const RangeLabelled = ({
  children,
  max,
  min,
  onChange,
  output,
  step,
  value,
}) => {
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

RangeLabelled.propTypes = {
  children: PropTypes.string.isRequired,
  max: PropTypes.number,
  min: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  output: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  step: PropTypes.number,
  value: PropTypes.number.isRequired,
};

export default RangeLabelled;

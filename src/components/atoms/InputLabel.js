import { PropTypes } from "prop-types";
import { createElement } from "react";

const InputLabel = ({ children }) =>
  createElement("span", { className: "InputLabel" }, children);

InputLabel.propTypes = {
  children: PropTypes.string,
};

export default InputLabel;

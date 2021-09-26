import { PropTypes } from "prop-types";
import { createElement } from "react";

const ButtonIcon = ({ children, modifier, onClick, text }) =>
  createElement(
    "button",
    { className: `ButtonIcon ButtonIcon--${modifier}`, onClick },
    text,
    " ",
    createElement("span", { className: "ButtonIcon__Label" }, children)
  );

ButtonIcon.propTypes = {
  children: PropTypes.string,
  modifier: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

export const Cross = (props) =>
  createElement(ButtonIcon, { ...props, modifier: "red-hover", text: "x" });
export const Plus = (props) =>
  createElement(ButtonIcon, { ...props, modifier: "green-hover", text: "+" });

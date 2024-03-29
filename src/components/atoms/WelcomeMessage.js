import { PropTypes } from "prop-types";
import { createElement } from "react";

const WelcomeMessage = ({ children }) =>
  createElement("div", {
    children,
    className: "WelcomeMessage fade-out",
  });

WelcomeMessage.propTypes = {
  children: PropTypes.string.isRequired,
};

export default WelcomeMessage;

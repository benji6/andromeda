import { PropTypes } from "prop-types";
import { createElement } from "react";
import { NavLink } from "react-router-dom";

const HollowButton = ({ children, to }) =>
  createElement(
    NavLink,
    {
      activeClassName: "HollowButton--active",
      className: "HollowButton",
      to,
    },
    children,
  );

HollowButton.propTypes = {
  children: PropTypes.string,
  to: PropTypes.string,
};

export default HollowButton;

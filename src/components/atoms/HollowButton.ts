import { createElement } from "react";
import { NavLink } from "react-router-dom";

interface Props {
  children: string;
  to: string;
}

const HollowButton = ({ children, to }: Props) =>
  createElement(
    NavLink,
    {
      activeClassName: "HollowButton--active",
      className: "HollowButton",
      to,
    },
    children,
  );

export default HollowButton;

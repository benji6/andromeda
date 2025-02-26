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
      className: ({ isActive }) =>
        `HollowButton${isActive ? " HollowButton--active" : ""}`,
      to,
    },
    children,
  );

export default HollowButton;

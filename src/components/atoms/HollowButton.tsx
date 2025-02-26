import { NavLink } from "react-router-dom";

interface Props {
  children: string;
  to: string;
}

const HollowButton = ({ children, to }: Props) => (
  <NavLink
    className={({ isActive }) =>
      `HollowButton${isActive ? " HollowButton--active" : ""}`
    }
    to={to}
  >
    {children}
  </NavLink>
);

export default HollowButton;

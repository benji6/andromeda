import * as React from "react";
import HollowButton from "../atoms/HollowButton";
import nav from "../../constants/nav";

export default function Navigator() {
  return (
    <nav className="Navigation">
      {nav.map(([to, txt]) => (
        <HollowButton to={to} key={to}>
          {txt}
        </HollowButton>
      ))}
    </nav>
  );
}

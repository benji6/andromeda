import HollowButton from "../atoms/HollowButton";
import { NAV } from "../../constants";

export default function Navigator() {
  return (
    <nav className="Navigation">
      {NAV.map(([to, txt]) => (
        <HollowButton to={to} key={to}>
          {txt}
        </HollowButton>
      ))}
    </nav>
  );
}

import { createElement } from "react";
import HollowButton from "../atoms/HollowButton";
import nav from "../../constants/nav";

export default () =>
  createElement(
    "nav",
    { className: "Navigation" },
    ...nav.map(([to, txt]) => createElement(HollowButton, { to }, txt)),
  );

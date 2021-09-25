import { createElement } from "react";
import Navigation from "../organisms/Navigation";
import { version } from "../../../package";
import WelcomeMessage from "../atoms/WelcomeMessage";

export default ({ children }) =>
  createElement(
    "div",
    null,
    createElement(WelcomeMessage, null, `v${version}`),
    createElement(Navigation),
    children
  );

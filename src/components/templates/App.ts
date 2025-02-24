import { createElement } from "react";
import Navigation from "../organisms/Navigation";

export default ({ children }) =>
  createElement("div", null, createElement(Navigation), children);

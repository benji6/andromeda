import { createElement } from "react";
import { Link } from "react-router-dom";

interface Props {
  children?: string;
  to: string;
}

const ButtonSecondary = ({ children, to }: Props) =>
  createElement(Link, { className: "ButtonSecondary", to }, children);

export default ButtonSecondary;

import { createElement } from "react";
import { Link } from "react-router-dom";
import { makeClassName } from "../../utils/dom";

interface Props {
  children: string;
  onClick: () => void;
  small: boolean;
  to: string;
}

const ButtonPrimary = ({ children, onClick, small, to }: Props) => {
  const className = makeClassName(
    "ButtonPrimary",
    small && "ButtonPrimary--small",
  );
  return to
    ? createElement(Link, { className, to }, children)
    : createElement("a", { className, href: "#", onClick }, children);
};

export default ButtonPrimary;

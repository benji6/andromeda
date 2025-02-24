import { createElement } from "react";

interface Props {
  children: string;
  href: string;
}

const LinkExternal = ({ children, href }: Props) =>
  createElement("a", {
    children,
    className: "LinkExternal",
    href,
    rel: "noopener",
    target: "_blank",
  });

export default LinkExternal;

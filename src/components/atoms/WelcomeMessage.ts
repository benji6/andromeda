import { createElement } from "react";

interface Props {
  children: string;
}

const WelcomeMessage = ({ children }: Props) =>
  createElement("div", {
    children,
    className: "WelcomeMessage fade-out",
  });

export default WelcomeMessage;

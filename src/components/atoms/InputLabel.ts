import { createElement } from "react";

interface Props {
  children: string;
}

const InputLabel = ({ children }: Props) =>
  createElement("span", { className: "InputLabel" }, children);

export default InputLabel;

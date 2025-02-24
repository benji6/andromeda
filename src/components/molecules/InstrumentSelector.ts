import { ChangeEvent, createElement } from "react";
import Selector from "./Selector";
import ButtonSecondary from "../atoms/ButtonSecondary";

interface Props {
  defaultValue: string;
  disabled: boolean;
  handleChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  label: string;
  options: { text: string; value: string }[];
}

export default function InstrumentSelector(props: Props) {
  return createElement(
    "div",
    null,
    createElement(Selector, props),
    createElement(
      ButtonSecondary,
      { to: `/plugins/instruments/${props.defaultValue}` },
      "edit",
    ),
  );
}

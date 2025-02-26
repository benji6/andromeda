import { ChangeEvent } from "react";
import Selector from "./Selector";
import ButtonSecondary from "../atoms/ButtonSecondary";

interface Props {
  defaultValue: string;
  disabled?: boolean;
  handleChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  label: string;
  options: { text: string; value: string }[];
}

export default function InstrumentSelector(props: Props) {
  return (
    <div>
      <Selector {...props} />
      <ButtonSecondary to={`/plugins/instruments/${props.defaultValue}`}>
        edit
      </ButtonSecondary>
    </div>
  );
}

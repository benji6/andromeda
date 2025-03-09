import { ChangeEvent } from "react";
import Selector from "./Selector";
import ButtonSecondary from "../atoms/ButtonSecondary";
import { INSTRUMENTS } from "../../constants";

interface Props {
  defaultValue: string;
  disabled?: boolean;
  handleChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  label: string;
}

export default function InstrumentSelector(props: Props) {
  return (
    <div>
      <Selector
        {...props}
        options={INSTRUMENTS.map((instrument) => ({
          text: instrument,
          value: instrument,
        }))}
      />
      <ButtonSecondary to={`/plugins/instruments/${props.defaultValue}`}>
        edit
      </ButtonSecondary>
    </div>
  );
}

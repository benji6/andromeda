import {
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";

const Input = ({ children, label }: { children: ReactNode; label: string }) => (
  <label className="ControlModule__Input">
    <span className="ControlModule__Input__Label">{label}</span>
    {children}
  </label>
);

export const CheckBox = (
  props: InputHTMLAttributes<HTMLInputElement> & { label: string },
) => (
  <Input label={props.label}>
    <input type="checkbox" {...props} />
  </Input>
);

interface RangeProps extends InputHTMLAttributes<HTMLInputElement> {
  displayValue?: string;
  label: string;
}

export const Range = (props: RangeProps) => {
  const max = props.max ?? 1;
  const min = props.min ?? 0;
  const step = props.step ?? (Number(max) - Number(min)) / 1000;
  const displayValue =
    props.displayValue === undefined
      ? Number(props.defaultValue).toFixed(2)
      : props.displayValue;

  const inputProps = {
    className: "ControlModule__Range",
    max,
    min,
    step,
    type: "range",
    ...props,
  };

  delete inputProps.displayValue;

  return (
    <Input label={props.label}>
      <input {...inputProps} />
      <div className="ControlModule__Output">{displayValue}</div>
    </Input>
  );
};

export const Select = (
  props: SelectHTMLAttributes<HTMLSelectElement> & { label: string },
) => (
  <Input label={props.label}>
    <select className="ControlModule__Select" {...props} />
  </Input>
);

const ControlModule = (props: HTMLAttributes<HTMLDivElement>) => (
  <div className="ControlModule" {...props}>
    {props.title && <h3 className="ControlModule__Title">{props.title}</h3>}
    <div className="ControlModule__Container">{props.children}</div>
  </div>
);

export default ControlModule;

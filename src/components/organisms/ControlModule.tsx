import * as React from "react";

const Input = ({ children, label }) => (
  <label className="ControlModule__Input">
    <span className="ControlModule__Input__Label">{label}</span>
    {children}
  </label>
);

export const CheckBox = (props) => (
  <Input label={props.label}>
    <input type="checkbox" {...props} />
  </Input>
);

export const Range = (props) => {
  const max = props.max === undefined ? 1 : props.max;
  const min = props.min === undefined ? 0 : props.min;
  const step = props.step === undefined ? (max - min) / 1000 : props.step;
  const displayValue =
    props.displayValue === undefined
      ? props.defaultValue.toFixed(2)
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

export const Select = (props) => (
  <Input label={props.label}>
    <select className="ControlModule__Select" {...props} />
  </Input>
);

const ControlModule = (props) => (
  <div className="ControlModule" {...props}>
    {props.title && <h3 className="ControlModule__Title">{props.title}</h3>}
    <div className="ControlModule__Container">{props.children}</div>
  </div>
);

export default ControlModule;

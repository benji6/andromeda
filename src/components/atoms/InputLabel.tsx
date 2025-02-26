interface Props {
  children?: string;
}

const InputLabel = ({ children }: Props) => (
  <span className="InputLabel">{children}</span>
);

export default InputLabel;

import { Link } from "react-router-dom";

interface Props {
  children?: string;
  to: string;
}

const ButtonSecondary = ({ children, to }: Props) => (
  <Link className="ButtonSecondary" to={to}>
    {children}
  </Link>
);

export default ButtonSecondary;

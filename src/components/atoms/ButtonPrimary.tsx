import { Link } from "react-router-dom";
import { makeClassName } from "../../utils/dom";

interface Props {
  children?: string;
  onClick?: () => void;
  small?: boolean;
  to?: string;
}

const ButtonPrimary = ({ children, onClick, small, to }: Props) => {
  const className = makeClassName(
    "ButtonPrimary",
    small && "ButtonPrimary--small",
  );
  return to ? (
    <Link className={className} to={to}>
      {children}
    </Link>
  ) : (
    <a className={className} href="#" onClick={onClick}>
      {children}
    </a>
  );
};

export default ButtonPrimary;

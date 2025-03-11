import { useSelector } from "react-redux";
import LinkExternal from "../../atoms/LinkExternal";
import navSlice from "../../../store/navSlice";

export default function About() {
  const lastDirection = useSelector(navSlice.selectors.lastDirection);
  return (
    <div className={`About slide-in-${lastDirection}`}>
      <h1 className="About__Title">About</h1>
      <p>
        Andromeda is a pluggable digital audio workstation built on open web
        technologies.
      </p>
      <p>
        All the code is open source and hosted on{" "}
        <LinkExternal href="https://github.com/benji6/andromeda">
          GitHub
        </LinkExternal>
        .
      </p>
      <p>
        If you would like to report a bug or request a feature you can raise an
        issue{" "}
        <LinkExternal href="https://github.com/benji6/andromeda/issues">
          here
        </LinkExternal>
        .
      </p>
      <p>Contributions, feedback and suggestions are all very welcome!</p>
    </div>
  );
}

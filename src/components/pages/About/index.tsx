import { connect } from "react-redux";
import { makeClassName } from "../../../utils/dom";
import LinkExternal from "../../atoms/LinkExternal";

const mapStateToProps = ({ nav: { lastDirection } }) => ({ lastDirection });

const About = ({ lastDirection }) => (
  <div
    className={makeClassName(
      "About",
      lastDirection === "left" ? "slide-in-left" : "slide-in-right",
    )}
  >
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

export default connect(mapStateToProps)(About);

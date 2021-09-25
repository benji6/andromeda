import { createElement } from "react";
import { connect } from "react-redux";
import { makeClassName } from "../../../utils/dom";
import LinkExternal from "../../atoms/LinkExternal";

const mapStateToProps = ({ nav: { lastDirection } }) => ({ lastDirection });

export default connect(mapStateToProps)(({ lastDirection }) =>
  createElement(
    "div",
    {
      className: makeClassName(
        "About",
        lastDirection === "left" ? "slide-in-left" : "slide-in-right"
      ),
    },
    createElement("h1", { className: "About__Title" }, "About"),
    createElement(
      "p",
      null,
      "Andromeda is a pluggable digital audio workstation built on open web technologies."
    ),
    createElement(
      "p",
      null,
      "All the code is open source and hosted on ",
      createElement(
        LinkExternal,
        { href: "https://github.com/benji6/andromeda" },
        "GitHub"
      ),
      "."
    ),
    createElement(
      "p",
      null,
      "If you would like to report a bug or request a feature you can raise an issue ",
      createElement(
        LinkExternal,
        { href: "https://github.com/benji6/andromeda/issues" },
        "here"
      ),
      "."
    ),
    createElement(
      "p",
      null,
      "Contributions, feedback and suggestions are all very welcome!"
    )
  )
);

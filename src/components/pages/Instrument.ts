import { createElement } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { instrumentInstance } from "../../utils/derivedData";
import PluginMount from "../atoms/PluginMount";
import ButtonPrimary from "../atoms/ButtonPrimary";

const mapStateToProps = ({ plugins }, { params }) => ({ params, plugins });

const Instrument = ({ params, plugins }) => {
  const navigate = useNavigate();
  return createElement(
    "div",
    { className: "Instrument" },
    createElement(PluginMount, {
      instance: instrumentInstance(params.name, plugins),
    }),
    createElement(ButtonPrimary, { onClick: () => navigate(-1) }, "OK"),
  );
};

// TODO fix any
export default connect(mapStateToProps)(Instrument);

import { createElement } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { effectInstance } from "../../utils/derivedData";
import ButtonPrimary from "../atoms/ButtonPrimary";
import PluginMount from "../atoms/PluginMount";

const mapStateToProps = ({ plugins }, { params }) => ({ params, plugins });

// TODO fix these types
interface Props {
  params: { name: string };
  plugins: any;
  router: any;
}

const Effect = ({ params, plugins, router }: Props) =>
  createElement(
    "div",
    { className: "Effect" },
    createElement(PluginMount, {
      instance: effectInstance(params.name, plugins),
    }),
    createElement(ButtonPrimary, { onClick: router.goBack }, "OK"),
  );

// TODO fix any
export default connect(mapStateToProps)(withRouter(Effect as any));

import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { instrumentInstance } from "../../utils/derivedData";
import PluginMount from "../atoms/PluginMount";
import ButtonPrimary from "../atoms/ButtonPrimary";

const mapStateToProps = ({ plugins }, { params }) => ({ params, plugins });

const Instrument = ({ params, plugins }) => {
  const navigate = useNavigate();
  return (
    <div className="Instrument">
      <PluginMount instance={instrumentInstance(params.name, plugins)} />
      <ButtonPrimary onClick={() => navigate(-1)}>OK</ButtonPrimary>
    </div>
  );
};

// TODO fix any
export default connect(mapStateToProps)(Instrument);

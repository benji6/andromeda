import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { instrumentInstance } from "../../utils/derivedData";
import PluginMount from "../atoms/PluginMount";
import ButtonPrimary from "../atoms/ButtonPrimary";

const mapStateToProps = ({ plugins }) => ({ plugins });

const Instrument = ({ plugins }) => {
  const navigate = useNavigate();
  const params = useParams();

  return (
    <div className="Instrument">
      <PluginMount instance={instrumentInstance(params.name, plugins)} />
      <ButtonPrimary onClick={() => navigate(-1)}>OK</ButtonPrimary>
    </div>
  );
};

export default connect(mapStateToProps)(Instrument);

import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { effectInstance } from "../../utils/derivedData";
import ButtonPrimary from "../atoms/ButtonPrimary";
import PluginMount from "../atoms/PluginMount";

const mapStateToProps = ({ plugins }): Props => ({
  plugins,
});

// TODO fix these types
interface Props {
  plugins: any;
}

const Effect = ({ plugins }: Props) => {
  const navigate = useNavigate();
  const params = useParams();

  return (
    <div className="Effect">
      <PluginMount instance={effectInstance(params.name, plugins)} />
      <ButtonPrimary onClick={() => navigate(-1)}>OK</ButtonPrimary>
    </div>
  );
};

export default connect(mapStateToProps)(Effect);

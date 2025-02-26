import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
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

const Effect = ({ params, plugins }: Props) => {
  const navigate = useNavigate();
  return (
    <div className="Effect">
      <PluginMount instance={effectInstance(params.name, plugins)} />
      <ButtonPrimary onClick={() => navigate(-1)}>OK</ButtonPrimary>
    </div>
  );
};

// TODO fix any
export default connect(mapStateToProps)(Effect as any);

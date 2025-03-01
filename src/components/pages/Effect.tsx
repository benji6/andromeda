import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { effectInstance } from "../../utils/derivedData";
import ButtonPrimary from "../atoms/ButtonPrimary";
import PluginMount from "../atoms/PluginMount";
import pluginsSlice from "../../store/pluginsSlice";

export default function Effect() {
  const navigate = useNavigate();
  const params = useParams();
  const plugins = useSelector(pluginsSlice.selectors.plugins);

  return (
    <div className="Effect">
      <PluginMount instance={effectInstance(params.name, plugins)} />
      <ButtonPrimary onClick={() => navigate(-1)}>OK</ButtonPrimary>
    </div>
  );
}

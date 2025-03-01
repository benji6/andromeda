import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { instrumentInstance } from "../../utils/derivedData";
import PluginMount from "../atoms/PluginMount";
import ButtonPrimary from "../atoms/ButtonPrimary";
import pluginsSlice from "../../store/pluginsSlice";

export default function Instrument() {
  const navigate = useNavigate();
  const params = useParams();
  const plugins = useSelector(pluginsSlice.selectors.plugins);

  return (
    <div className="Instrument">
      <PluginMount instance={instrumentInstance(params.name, plugins)} />
      <ButtonPrimary onClick={() => navigate(-1)}>OK</ButtonPrimary>
    </div>
  );
}

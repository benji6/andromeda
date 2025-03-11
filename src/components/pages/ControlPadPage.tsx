import { useSelector } from "react-redux";
import ControlPad from "../organisms/ControlPad";
import ButtonPrimary from "../atoms/ButtonPrimary";
import controlPadSlice from "../../store/controlPadSlice";
import screenSlice from "../../store/screenSlice";
import navSlice from "../../store/navSlice";

export default function ControlPadPage() {
  const hasBeenTouched = useSelector(controlPadSlice.selectors.hasBeenTouched);
  const sideLength = useSelector(screenSlice.selectors.sideLength);
  const lastDirection = useSelector(navSlice.selectors.lastDirection);

  return (
    <div className={`ControlPadPage slide-in-${lastDirection}`}>
      <div>
        <ControlPad hasBeenTouched={hasBeenTouched} sideLength={sideLength} />
      </div>
      <ButtonPrimary to="/controllers/control-pad/settings">
        Options
      </ButtonPrimary>
    </div>
  );
}

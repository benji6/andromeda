import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import keyboardSlice from "../../store/keyboardSlice";

export default function usePressedKeyCodes() {
  const dispatch = useDispatch();
  const pressedKeyCodes = useSelector(keyboardSlice.selectors.pressedKeyCodes);

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      const { keyCode } = e;
      if (keyCode === 191) e.preventDefault();
      if (pressedKeyCodes.includes(keyCode)) return;
      dispatch(keyboardSlice.actions.pressedKeyCodesAdd(keyCode));
    };
    const keyUpHandler = ({ keyCode }: KeyboardEvent) => {
      dispatch(keyboardSlice.actions.pressedKeyCodesRemove(keyCode));
    };
    document.addEventListener("keyup", keyUpHandler);
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
    };
  }, [pressedKeyCodes]);
}

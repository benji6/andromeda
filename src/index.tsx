import "./constants/colors.css";
import "./constants/timings.css";
import "./utils/keyframes.css";
import "./utils/globals.css";

import "./components/atoms/ButtonPrimary.css";
import "./components/atoms/ButtonSecondary.css";
import "./components/atoms/HollowButton.css";
import "./components/atoms/InputLabel.css";
import "./components/atoms/InputSelect.css";
import "./components/atoms/LinkExternal.css";
import "./components/molecules/CheckboxLabelled.css";
import "./components/molecules/RangeLabelled.css";
import "./components/organisms/ControlModule.css";
import "./components/organisms/ControlPad/style.css";
import "./components/organisms/Navigation.css";
import "./components/organisms/spinner.css";
import "./components/organisms/table-center.css";
import "./components/pages/About/style.css";
import "./components/pages/ControlPadPage.css";
import "./components/pages/ControlPadSettings.css";
import "./components/pages/Effect.css";
import "./components/pages/Instrument.css";
import "./components/pages/KeyboardSettings.css";
import "./components/pages/Settings/style.css";

import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./keyboard";
import store from "./store";
import "./utils/loadPlugins";
import screenSlice from "./store/screenSlice";
import App from "./components/App";

const resizeHandler = () =>
  requestAnimationFrame(() =>
    store.dispatch(
      screenSlice.actions.screenResize({
        sideLength: innerWidth < innerHeight ? innerWidth : innerHeight * 0.8,
        width: innerWidth,
      }),
    ),
  );

resizeHandler();

addEventListener("resize", resizeHandler);

createRoot(document.getElementById("app")).render(
  <Provider store={store}>
    <App />
  </Provider>,
);

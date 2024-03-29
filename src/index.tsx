import "./constants/colors.css";
import "./constants/timings.css";
import "./utils/keyframes.css";
import "./utils/globals.css";

import "./components/atoms/ButtonIcon.css";
import "./components/atoms/ButtonPrimary.css";
import "./components/atoms/ButtonSecondary.css";
import "./components/atoms/HollowButton.css";
import "./components/atoms/InputLabel.css";
import "./components/atoms/InputSelect.css";
import "./components/atoms/LinkExternal.css";
import "./components/atoms/WelcomeMessage.css";
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

import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./keyboard";
import store from "./store";
import Router from "./Router";
import "./utils/loadPlugins";
import { screenResize } from "./actions";

const resizeHandler = () =>
  requestAnimationFrame(() =>
    store.dispatch(
      screenResize({
        height: innerHeight,
        sideLength: innerWidth < innerHeight ? innerWidth : innerHeight * 0.8,
        width: innerWidth,
      })
    )
  );

resizeHandler();

addEventListener("resize", resizeHandler);

ReactDOM.render(
  <Provider store={store}>
    <Router />
  </Provider>,
  document.getElementById("app")
);

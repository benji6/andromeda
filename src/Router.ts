import { createElement } from "react";
import { hashHistory, IndexRoute, Router, Route } from "react-router";
import store from "./store";
import { navLastDirectionSet } from "./actions";
import nav from "./constants/nav";
import App from "./components/templates/App";
import About from "./components/pages/About";
import ControlPadPage from "./components/pages/ControlPadPage";
import ControlPadSettings from "./components/pages/ControlPadSettings";
import Effect from "./components/pages/Effect";
import Instrument from "./components/pages/Instrument";
import KeyboardSettings from "./components/pages/KeyboardSettings";
import Settings from "./components/pages/Settings";

export default () =>
  createElement(
    Router,
    { history: hashHistory },
    createElement(
      Route,
      {
        component: App,
        onChange: (prevState, nextState) => {
          const { lastDirection } = store.getState().nav;
          const prevIndex = nav.findIndex(
            ([pathname]) => pathname === prevState.location.pathname
          );
          const nextIndex = nav.findIndex(
            ([pathname]) => pathname === nextState.location.pathname
          );

          if (nextIndex === prevIndex) return;

          const direction = nextIndex > prevIndex ? "right" : "left";

          if (direction !== lastDirection) {
            store.dispatch(navLastDirectionSet(direction));
          }
        },
        path: "/",
      },
      createElement(IndexRoute, { component: ControlPadPage }),
      createElement(Route, { component: About, path: "/about" }),
      createElement(Route, {
        component: ControlPadPage,
        path: "/controllers/control-pad",
      }),
      createElement(Route, {
        component: ControlPadSettings,
        path: "/controllers/control-pad/settings",
      }),
      createElement(Route, {
        component: Effect,
        path: "/plugins/effects/:name",
      }),
      createElement(Route, {
        component: Instrument,
        path: "/plugins/instruments/:name",
      }),
      createElement(Route, {
        component: KeyboardSettings,
        path: "/controllers/keyboard/settings",
      }),
      createElement(Route, { component: Settings, path: "/settings" }),
      createElement(Route, { component: ControlPadPage, path: "/*" })
    )
  );

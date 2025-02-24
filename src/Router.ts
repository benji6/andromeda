import { createElement } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
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

const handleRouteChange = (prevLocation, location) => {
  const { lastDirection } = store.getState().nav;
  const prevIndex = nav.findIndex(
    ([pathname]) => pathname === prevLocation.pathname,
  );
  const nextIndex = nav.findIndex(
    ([pathname]) => pathname === location.pathname,
  );

  if (nextIndex === prevIndex) return;

  const direction = nextIndex > prevIndex ? "right" : "left";

  if (direction !== lastDirection) {
    store.dispatch(navLastDirectionSet(direction));
  }
};

export default () =>
  createElement(
    BrowserRouter,
    null,
    createElement(
      App,
      null,
      createElement(
        Switch,
        null,
        createElement(Route, {
          exact: true,
          path: "/",
          render: (props) => {
            handleRouteChange(props.location, props.location);
            return createElement(ControlPadPage, props);
          },
        }),
        createElement(Route, {
          path: "/about",
          render: (props) => {
            handleRouteChange(props.location, props.location);
            return createElement(About, props);
          },
        }),
        createElement(Route, {
          path: "/controllers/control-pad/settings",
          render: (props) => {
            handleRouteChange(props.location, props.location);
            return createElement(ControlPadSettings, props);
          },
        }),
        createElement(Route, {
          path: "/controllers/control-pad",
          render: (props) => {
            handleRouteChange(props.location, props.location);
            return createElement(ControlPadPage, props);
          },
        }),
        createElement(Route, {
          path: "/plugins/effects/:name",
          render: (props) => {
            handleRouteChange(props.location, props.location);
            // TODO fix any
            return createElement(Effect, props as any);
          },
        }),
        createElement(Route, {
          path: "/plugins/instruments/:name",
          render: (props) => {
            handleRouteChange(props.location, props.location);
            // TODO fix any
            return createElement(Instrument, props as any);
          },
        }),
        createElement(Route, {
          path: "/controllers/keyboard/settings",
          render: (props) => {
            handleRouteChange(props.location, props.location);
            return createElement(KeyboardSettings, props);
          },
        }),
        createElement(Route, {
          path: "/settings",
          render: (props) => {
            handleRouteChange(props.location, props.location);
            return createElement(Settings, props);
          },
        }),
        createElement(Route, {
          path: "/*",
          render: (props) => {
            handleRouteChange(props.location, props.location);
            return createElement(ControlPadPage, props);
          },
        }),
      ),
    ),
  );

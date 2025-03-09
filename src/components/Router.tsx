import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import store from "../store";
import { NAV } from "../constants";
import App from "./templates/App";
import About from "./pages/About";
import ControlPadPage from "./pages/ControlPadPage";
import ControlPadSettings from "./pages/ControlPadSettings";
import Effect from "./pages/Effect";
import Instrument from "./pages/Instrument";
import KeyboardSettings from "./pages/KeyboardSettings";
import Settings from "./pages/Settings";
import RedirectHome from "./shared/RedirectHome";
import navSlice from "../store/navSlice";
import AriadneSettings from "./pages/AriadneSettings";

const handleRouteChange = (prevLocation, location) => {
  const { lastDirection } = store.getState().nav;
  const prevIndex = NAV.findIndex(
    ([pathname]) => pathname === prevLocation.pathname,
  );
  const nextIndex = NAV.findIndex(
    ([pathname]) => pathname === location.pathname,
  );

  if (nextIndex === prevIndex) return;

  const direction = nextIndex > prevIndex ? "right" : "left";

  if (direction !== lastDirection) {
    store.dispatch(navSlice.actions.lastDirectionSet(direction));
  }
};

const RouteChangeHandler = ({ children }) => {
  const location = useLocation();
  useEffect(() => {
    handleRouteChange(location, location);
  }, [location]);

  return children;
};

const Router = () => (
  <BrowserRouter>
    <RouteChangeHandler>
      <App>
        <Routes>
          <Route path="/" element={<ControlPadPage />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/controllers/control-pad/settings"
            element={<ControlPadSettings />}
          />
          <Route path="/plugins/effects/:name" element={<Effect />} />
          <Route
            path="/plugins/instruments/ariadne"
            element={<AriadneSettings />}
          />
          <Route path="/plugins/instruments/:name" element={<Instrument />} />
          <Route
            path="/controllers/keyboard/settings"
            element={<KeyboardSettings />}
          />
          <Route path="/settings" element={<Settings />} />
          <Route path="/*" element={<RedirectHome />} />
        </Routes>
      </App>
    </RouteChangeHandler>
  </BrowserRouter>
);

export default Router;

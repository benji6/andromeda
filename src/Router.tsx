import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
          <Route path="/controllers/control-pad" element={<ControlPadPage />} />
          <Route path="/plugins/effects/:name" element={<Effect />} />
          <Route path="/plugins/instruments/:name" element={<Instrument />} />
          <Route
            path="/controllers/keyboard/settings"
            element={<KeyboardSettings />}
          />
          <Route path="/settings" element={<Settings />} />
          <Route path="/*" element={<ControlPadPage />} />
        </Routes>
      </App>
    </RouteChangeHandler>
  </BrowserRouter>
);

export default Router;

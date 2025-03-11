import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import store from "../store";
import { NAV } from "../constants";
import About from "./pages/About";
import ControlPadPage from "./pages/ControlPadPage";
import ControlPadSettings from "./pages/ControlPadSettings";
import KeyboardSettings from "./pages/KeyboardSettings";
import Settings from "./pages/Settings";
import RedirectHome from "./shared/RedirectHome";
import navSlice from "../store/navSlice";
import AriadneSettings from "./pages/AriadneSettings";
import PrometheusSettings from "./pages/PrometheusSettings";
import Navigation from "./organisms/Navigation";
import { useSelector } from "react-redux";

const RouteChangeHandler = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [lastPathname, setLastPathname] = useState(location.pathname);
  const lastDirection = useSelector(navSlice.selectors.lastDirection);

  useEffect(() => {
    const prevIndex = NAV.findIndex(([pathname]) => pathname === lastPathname);
    const nextIndex = NAV.findIndex(
      ([pathname]) => pathname === location.pathname,
    );

    if (nextIndex === prevIndex) return;

    const direction = nextIndex > prevIndex ? "right" : "left";

    if (direction !== lastDirection)
      store.dispatch(navSlice.actions.lastDirectionSet(direction));

    setLastPathname(location.pathname);
  }, [lastDirection, lastPathname, location]);

  return children;
};

const Router = () => (
  <BrowserRouter>
    <RouteChangeHandler>
      <div>
        <Navigation />
        <Routes>
          <Route path="/" element={<ControlPadPage />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/controllers/control-pad/settings"
            element={<ControlPadSettings />}
          />
          <Route
            path="/plugins/instruments/ariadne"
            element={<AriadneSettings />}
          />
          <Route
            path="/plugins/instruments/prometheus"
            element={<PrometheusSettings />}
          />
          <Route
            path="/controllers/keyboard/settings"
            element={<KeyboardSettings />}
          />
          <Route path="/settings" element={<Settings />} />
          <Route path="/*" element={<RedirectHome />} />
        </Routes>
      </div>
    </RouteChangeHandler>
  </BrowserRouter>
);

export default Router;

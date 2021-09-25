import { createElement } from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import "./keyboard";
import store, { rehydratePromise } from "./store";
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

rehydratePromise
  .catch((err) => console.error("rehydration error", err))
  .then(() =>
    render(
      createElement(Provider, { store }, Router),
      document.getElementById("app")
    )
  );

import { applyMiddleware, createStore } from "redux";
import bpm from "./middlewareRedux/bpm";
import { combineReducers } from "redux";
import controlPad from "./reducers/controlPad";
import keyboard from "./reducers/keyboard";
import nav from "./reducers/nav";
import plugins from "./reducers/plugins";
import screen from "./reducers/screen";
import settings from "./reducers/settings";

const reducer = combineReducers({
  controlPad,
  keyboard,
  nav,
  plugins,
  screen,
  settings,
});

// TODO: Use redux toolkit and fix types
export default createStore(reducer, applyMiddleware(bpm) as any);

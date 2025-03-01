import { createStore } from "redux";
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

// TODO: Use redux toolkit
export default createStore(reducer);

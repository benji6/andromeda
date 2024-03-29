import { combineReducers } from "redux";
import controlPad from "../reducers/controlPad";
import keyboard from "../reducers/keyboard";
import nav from "../reducers/nav";
import plugins from "../reducers/plugins";
import screen from "../reducers/screen";
import settings from "../reducers/settings";

export default combineReducers({
  controlPad,
  keyboard,
  nav,
  plugins,
  screen,
  settings,
});

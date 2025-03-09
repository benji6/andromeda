import { configureStore } from "@reduxjs/toolkit";
import ariadneSlice from "./ariadneSlice";
import controlPadSlice from "./controlPadSlice";
import keyboardSlice from "./keyboardSlice";
import navSlice from "./navSlice";
import pluginsSlice from "./pluginsSlice";
import prometheusSlice from "./prometheusSlice";
import screenSlice from "./screenSlice";
import settingsSlice from "./settingsSlice";

export default configureStore({
  reducer: {
    ariadne: ariadneSlice.reducer,
    controlPad: controlPadSlice.reducer,
    keyboard: keyboardSlice.reducer,
    nav: navSlice.reducer,
    plugins: pluginsSlice.reducer,
    prometheus: prometheusSlice.reducer,
    screen: screenSlice.reducer,
    settings: settingsSlice.reducer,
  },
});

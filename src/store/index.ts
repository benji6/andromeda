import { configureStore } from "@reduxjs/toolkit";
import controlPadSlice from "./controlPadSlice";
import keyboardSlice from "./keyboardSlice";
import navSlice from "./navSlice";
import pluginsSlice from "./pluginsSlice";
import screenSlice from "./screenSlice";
import settingsSlice from "./settingsSlice";

const store = configureStore({
  reducer: {
    controlPad: controlPadSlice.reducer,
    keyboard: keyboardSlice.reducer,
    nav: navSlice.reducer,
    plugins: pluginsSlice.reducer,
    screen: screenSlice.reducer,
    settings: settingsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;

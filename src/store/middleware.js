import { applyMiddleware } from "redux";
import bpm from "../middlewareRedux/bpm";

export default applyMiddleware(bpm);

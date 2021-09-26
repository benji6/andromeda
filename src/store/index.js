import { createStore } from "redux";
import reducer from "./reducer";
import enhancer from "./enhancer";

export default createStore(reducer, enhancer);

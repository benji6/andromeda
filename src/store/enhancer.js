import { compose } from "redux";
import middleware from "./middleware";

export default compose(
  middleware,
  process.env.NODE_ENV !== "production" && window.devToolsExtension
    ? window.devToolsExtension()
    : (x) => x
);

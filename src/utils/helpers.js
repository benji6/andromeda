import { curry, find } from "ramda";

export const findById = curry((id, xs) => find((x) => x.id === id, xs));
export const noop = () => {};

import { clamp, filter, join, path } from "ramda";

const validRatio = clamp(0, 1 - Number.EPSILON);

export const eventCheckedPath = path(["currentTarget", "checked"]);
export const eventRatiosAndCoords = (e) => {
  const { top, right, bottom, left } = e.target.getBoundingClientRect();
  const [width, height] = [right - left, bottom - top];
  const { clientX, clientY } = (e.changedTouches && e.changedTouches[0]) || e;
  const [x, y] = [clientX - left, clientY - top];
  return {
    x,
    xRatio: validRatio(x / width),
    y,
    yRatio: validRatio(y / height),
  };
};
export const eventValuePath = path(["currentTarget", "value"]);
export const makeClassName = (...xs) => join(" ", filter(Boolean, xs));

const validRatio = (n: number) => Math.max(0, Math.min(1 - Number.EPSILON, n));

export const eventRatiosAndCoords = (
  e,
): { x: number; xRatio: number; y: number; yRatio: number } => {
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

export const makeClassName = (...xs: string[]) => xs.filter(Boolean).join(" ");

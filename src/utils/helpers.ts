export const noop = () => {};

export const capitalizeFirst = (string: string) =>
  string[0].toUpperCase() + string.slice(1);

export const capitalizeWords = (string: string) =>
  string.split(" ").map(capitalizeFirst).join(" ");

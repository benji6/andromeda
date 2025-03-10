export const instrumentInstance = (name, plugins) =>
  plugins.instrumentInstances.find((x) => name === x.name)?.instance;

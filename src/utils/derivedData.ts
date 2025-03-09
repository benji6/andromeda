export const effectInstance = (name, plugins) =>
  plugins.effectInstances.find((x) => name === x.name).instance;
export const instrumentInstance = (name, plugins) =>
  plugins.instrumentInstances.find((x) => name === x.name)?.instance;

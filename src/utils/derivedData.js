import { noop } from "./helpers";

export const effectInstance = (name, plugins) =>
  plugins.effectInstances.find((x) => name === x.name).instance;
export const instrumentInstance = (name, plugins) =>
  plugins.instrumentInstances.find((x) => name === x.name).instance;
export const controllableInstrumentInstanceNames = ({ instrumentInstances }) =>
  instrumentInstances
    .filter(({ instance }) => instance.noteStart !== noop)
    .map(({ name }) => name);

import { BPM_SET } from "../actions";

export default (store) => (next) => (action) => {
  if (action.type === BPM_SET) {
    const {
      plugins: { effectInstances, instrumentInstances },
    } = store.getState();
    for (const { instance } of effectInstances) instance.setBpm(action.payload);
    for (const { instance } of instrumentInstances)
      instance.setBpm(action.payload);
  }
  next(action);
};

import { noop } from "./helpers";

export default (plugin) => ({
  connect: plugin.connect.bind(plugin),
  destination: plugin.destination,
  disconnect: plugin.disconnect.bind(plugin),
  render: plugin.render.bind(plugin),
  setBpm: plugin.setBpm ? plugin.setBpm.bind(plugin) : noop,
});

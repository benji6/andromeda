export default (plugin) => ({
  connect: plugin.connect.bind(plugin),
  destination: plugin.destination,
  disconnect: plugin.disconnect.bind(plugin),
  render: plugin.render.bind(plugin),
});

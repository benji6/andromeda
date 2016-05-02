const noop = _ => {}

export default plugin => ({
  connect: plugin.connect.bind(plugin),
  disconnect: plugin.disconnect.bind(plugin),
  noteModify: plugin.noteModify ? plugin.noteModify.bind(plugin) : noop,
  noteStart: plugin.noteStart ? plugin.noteStart.bind(plugin) : noop,
  noteStop: plugin.noteStop ? plugin.noteStop.bind(plugin) : noop,
  render: plugin.render.bind(plugin),
})

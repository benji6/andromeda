import {forEach} from 'ramda'
const noop = _ => {}

export default plugin => {
  const noteStart = plugin.noteStart ? plugin.noteStart.bind(plugin) : noop
  return {
    connect: plugin.connect.bind(plugin),
    disconnect: plugin.disconnect.bind(plugin),
    noteModify: plugin.noteModify ? plugin.noteModify.bind(plugin) : noop,
    notesStart: plugin.notesStart ? plugin.notesStart.bind(plugin) : forEach(noteStart),
    noteStart,
    noteStop: plugin.noteStop ? plugin.noteStop.bind(plugin) : noop,
    render: plugin.render.bind(plugin),
  }
}

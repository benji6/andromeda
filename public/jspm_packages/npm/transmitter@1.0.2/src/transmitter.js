/* */ 
function transmitter() {
  const subscriptions = []

  const unsubscribe = (onChange) => {
    const id = subscriptions.indexOf(onChange)
    if (id >= 0) subscriptions.splice(id, 1)
  }

  const subscribe = (onChange) => {
    subscriptions.push(onChange)
    const dispose = () => unsubscribe(onChange)
    return { dispose }
  }

  const push = (value) => {
    subscriptions.forEach(subscription => subscription(value))
  }

  return { subscribe, push, unsubscribe }
}

module.exports = transmitter

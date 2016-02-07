export default class {
  constructor ({audioContext}) {
    this.destination = audioContext.createGain()
  }
  connect (destination) {
    this.destination.connect(destination)
  }
  disconnect (destination) {
    this.destination.disconnect()
  }
}

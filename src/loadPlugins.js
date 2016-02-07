import store from './store'
import Prometheus from './plugins/instruments/Prometheus'
import Osc from './plugins/instruments/Osc'
import Delay from './plugins/effects/Delay'
import Gain from './plugins/effects/Gain'
import {
  instantiateInstrument,
  loadPluginEffect,
  loadPluginInstrument
} from './actions'

store.dispatch(loadPluginInstrument({constructor: Prometheus, name: 'prometheus'}))
store.dispatch(loadPluginInstrument({constructor: Osc, name: 'osc'}))
store.dispatch(loadPluginEffect({constructor: Delay, name: 'delay'}))
store.dispatch(loadPluginEffect({constructor: Gain, name: 'gain'}))
store.dispatch(instantiateInstrument({name: 'prometheus', plugin: 'prometheus'}))

// // adds effect to bottom of chain
// // disconnects if from audioContext.destination
// dispatch(addEffect({channel: 0, name: 'delay-x', plugin: 'delay'}))
//
// // if connected to destination it disconnects and adds to first effect in channel
// dispatch(addInstrumentToChannel({channel: 0, instrument: 'prometheus-x'}))

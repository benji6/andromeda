import store from './store'
import Prometheus from './plugins/instruments/Prometheus'
import Osc from './plugins/instruments/Osc'
import Delay from './plugins/effects/Delay'
import Gain from './plugins/effects/Gain'
import {
  addInstrumentToChannel,
  instantiateEffect,
  instantiateInstrument,
  loadPluginEffect,
  loadPluginInstrument
} from './actions'

store.dispatch(loadPluginInstrument({constructor: Prometheus, name: 'prometheus'}))
store.dispatch(loadPluginInstrument({constructor: Osc, name: 'osc'}))
store.dispatch(loadPluginEffect({constructor: Delay, name: 'delay'}))
store.dispatch(loadPluginEffect({constructor: Gain, name: 'gain'}))
store.dispatch(instantiateInstrument({name: 'Prometheus', plugin: 'prometheus'}))
store.dispatch(instantiateInstrument({name: 'Osc', plugin: 'osc'}))

store.dispatch(instantiateEffect({channel: 0, name: 'delay', plugin: 'delay'}))

store.dispatch(addInstrumentToChannel({channel: 0, name: 'Prometheus'}))

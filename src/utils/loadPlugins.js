import store from '../store'
import Ariadne from '../plugins/instruments/Ariadne'
import Fate from '../plugins/instruments/Fate'
import Prometheus from '../plugins/instruments/Prometheus'
import Delay from '../plugins/effects/Delay'
import Gain from '../plugins/effects/Gain'
import Reverb from '../plugins/effects/Reverb'
import {
  addEffectToChannel,
  addInstrumentToChannel,
  instantiateEffect,
  instantiateInstrument,
  loadPluginEffect,
  loadPluginInstrument
} from '../actions'

store.dispatch(loadPluginInstrument({constructor: Ariadne, name: 'Ariadne'}))
store.dispatch(loadPluginInstrument({constructor: Fate, name: 'Fate'}))
store.dispatch(loadPluginInstrument({constructor: Prometheus, name: 'Prometheus'}))

store.dispatch(loadPluginEffect({constructor: Delay, name: 'Delay'}))
store.dispatch(loadPluginEffect({constructor: Gain, name: 'Gain'}))
store.dispatch(loadPluginEffect({constructor: Reverb, name: 'Reverb'}))

store.dispatch(instantiateInstrument({name: 'Ariadne', plugin: 'Ariadne'}))
store.dispatch(instantiateInstrument({name: 'Fate', plugin: 'Fate'}))
store.dispatch(instantiateInstrument({name: 'Prometheus', plugin: 'Prometheus'}))

store.dispatch(instantiateEffect({name: 'Delay', plugin: 'Delay'}))
store.dispatch(instantiateEffect({name: 'Gain', plugin: 'Gain'}))
store.dispatch(instantiateEffect({name: 'Reverb', plugin: 'Reverb'}))

store.dispatch(addInstrumentToChannel({channel: 0, name: 'Ariadne'}))
store.dispatch(addInstrumentToChannel({channel: 0, name: 'Fate'}))
store.dispatch(addInstrumentToChannel({channel: 0, name: 'Prometheus'}))

store.dispatch(addEffectToChannel({channel: 0, name: 'Delay'}))

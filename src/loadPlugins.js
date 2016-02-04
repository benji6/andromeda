import Prometheus from './plugins/Prometheus'
import audioContext from './audioContext'
import {dispatch} from './store'
import {addInstrument} from './actions'

dispatch(addInstrument(new Prometheus({audioContext}), 'prometheus'))

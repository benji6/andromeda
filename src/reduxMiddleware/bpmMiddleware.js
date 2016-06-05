import {forEach} from 'ramda'
import {BPM_SET} from '../actions'

export default store => next => action => {
  if (action.type === BPM_SET) {
    const {plugins: {effectInstances, instrumentInstances}} = store.getState()
    forEach(x => x.instance.setBpm(action.payload), effectInstances)
    forEach(x => x.instance.setBpm(action.payload), instrumentInstances)
  }
  next(action)
}

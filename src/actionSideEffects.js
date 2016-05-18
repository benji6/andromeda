import {forEach} from 'ramda'
import {BPM_SET} from './actions'

export default store => next => action => {
  switch (action.type) {
    case BPM_SET:
      const {plugins: {effectInstances, instrumentInstances}} = store.getState()
      forEach(x => x.instance.setBpm(action.payload), effectInstances)
      forEach(x => x.instance.setBpm(action.payload), instrumentInstances)
  }
  next(action)
}

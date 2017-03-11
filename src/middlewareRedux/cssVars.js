import {REHYDRATE} from 'redux-persist/constants'
import {ROOT_HUE_SET} from '../actions'
import {setCssVar} from '../vars/cssVars'

export default store => {
  setCssVar('--root-hue', store.getState().settings.rootHue)
  return next => action => {
    switch (action.type) {
      case REHYDRATE:
        if (action.payload.settings && action.payload.settings.rootHue) {
          setCssVar('--root-hue', action.payload.settings.rootHue)
        }
        break
      case ROOT_HUE_SET:
        setCssVar('--root-hue', action.payload)
        break
    }
    next(action)
  }
}

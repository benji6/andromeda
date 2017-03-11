import {compose, identity} from 'ramda'
import middleware from './middleware'

export default compose(
  middleware,
  process.env.NODE_ENV !== 'production' && typeof window !== 'undefined' && window.devToolsExtension
    ? window.devToolsExtension()
    : identity
)

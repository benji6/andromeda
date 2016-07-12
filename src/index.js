import {createElement} from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import './keyboard'
import UpgradeBrowser from './components/pages/UpgradeBrowser'
import store from './store'
import routes from './routes'
import './utils/loadPlugins'
import {appInitialize} from './actions'

render(
  navigator.serviceWorker && window.fetch
    ? (
      store.dispatch(appInitialize()),
      createElement(Provider, {store}, routes)
    )
    : createElement(UpgradeBrowser),
  document.getElementById('app')
)

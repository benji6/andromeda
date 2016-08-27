import {createElement} from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import './keyboard'
import UpgradeBrowser from './components/pages/UpgradeBrowser'
import store from './store'
import Router from './Router'
import './utils/loadPlugins'
import {appInitialize} from './actions'

render(
  navigator.serviceWorker && window.fetch
    ? (
      store.dispatch(appInitialize()),
      createElement(Provider, {store}, Router)
    )
    : createElement(UpgradeBrowser),
  document.getElementById('app')
)

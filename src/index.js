import {createElement} from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import './keyboard'
import UpgradeBrowser from './components/pages/UpgradeBrowser'
import store from './store'
import routes from './routes'
import './utils/loadPlugins'

render(
  navigator.serviceWorker && window.fetch
    ? createElement(Provider, {store}, routes)
    : createElement(UpgradeBrowser),
  document.getElementById('app')
)

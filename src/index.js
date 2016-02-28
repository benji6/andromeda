import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import './keyboard'
import UpgradeBrowser from './components/pages/UpgradeBrowser'
import store from './store'
import routes from './routes'
import './utils/loadPlugins'

if (navigator.serviceWorker) {
  render(
    <Provider store={store}>{routes}</Provider>,
    document.getElementById('app')
  )
} else {
  render(
    <UpgradeBrowser />,
    document.getElementById('app')
  )
}

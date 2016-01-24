import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import './customVirtualNodes/defineNodes'
import './keyboard'
import UpgradeBrowserView from './components/pages/UpgradeBrowserView'
import store from './store'
import routes from './routes'
import './updateAudioGraph'

if (navigator.serviceWorker) {
  render(
    <Provider store={store}>{routes}</Provider>,
    document.getElementById('app')
  )
} else {
  render(
    <UpgradeBrowserView />,
    document.getElementById('app')
  )
}

import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import './customVirtualNodes/defineNodes'
import './keyboard'
import UpgradeBrowserView from './components/pages/UpgradeBrowserView'
import store from './store'
import routes from './routes'
import './updateAudioGraph'

const app = <Provider store={store}>{routes}</Provider>

if (navigator.serviceWorker) render(app, document.querySelector('#app'))
else render(<UpgradeBrowserView />)

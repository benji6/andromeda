import {createElement} from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import './keyboard'
import UpgradeBrowser from './components/pages/UpgradeBrowser'
import store from './store'
import Router from './Router'
import './utils/loadPlugins'
import {
  appInitialize,
  screenResize,
} from './actions'

const resizeHandler = () => requestAnimationFrame(() => store.dispatch(screenResize({
  height: innerHeight,
  sideLength: innerWidth < innerHeight ? innerWidth : innerHeight * 0.8,
  width: innerWidth,
})))

resizeHandler()

addEventListener('resize', resizeHandler)

render(
  navigator.serviceWorker && window.fetch
    ? (
      store.dispatch(appInitialize()),
      createElement(Provider, {store}, Router)
    )
    : createElement(UpgradeBrowser),
  document.getElementById('app')
)

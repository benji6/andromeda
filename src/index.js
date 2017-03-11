import {createElement} from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import sixflix from 'sixflix'
import './keyboard'
import UpgradeBrowser from './components/pages/UpgradeBrowser'
import store, {rehydratePromise} from './store'
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

rehydratePromise
  .catch(err => console.error('rehydration error', err)) // eslint-disable-line
  .then(() => render(
    sixflix()
      ? (
        store.dispatch(appInitialize()),
        createElement(Provider, {store}, Router)
      )
      : createElement(UpgradeBrowser),
    document.getElementById('app')
  ))

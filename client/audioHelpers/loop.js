/* global Rx */
import {compose, forEach} from 'ramda'
import store from '../store'
import {addAudioGraphSource} from '../actions'

const arpStop$ = new Rx.Subject()
arpStop$.subscribe()

module.exports = (audioGraphFragments) => {
  // Rx.Observable.interval(noteDuration())
  //   .transduce(compose(map(() => console.log('something', virtualAudioGraph.currentTime))))
  //   .takeUntil(arpStop$)
  //   .subscribe()
  forEach(compose(store.dispatch, addAudioGraphSource), audioGraphFragments)
}

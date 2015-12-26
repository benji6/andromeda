import {Subject} from 'rx'
import {compose, forEach} from 'ramda'
import store from '../store'
import {addAudioGraphSource} from '../actions'

const arpStop$ = new Subject()
arpStop$.subscribe()

module.exports = (audioGraphFragments) => {
  // Observable.interval(noteDuration())
  //   .transduce(compose(map(() => console.log('something', virtualAudioGraph.currentTime))))
  //   .takeUntil(arpStop$)
  //   .subscribe()
  forEach(compose(store.dispatch, addAudioGraphSource), audioGraphFragments)
}

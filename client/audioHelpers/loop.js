import {map, take} from 'imlazy'
import {Subject} from 'rx'
import {compose} from 'ramda'
import store from '../store'
import {addAudioGraphSource} from '../actions'

const arpStop$ = new Subject()
arpStop$.subscribe()

module.exports = (audioGraphFragments) => {
  // Observable.interval(noteDuration())
  //   .transduce(compose(map(() => console.log('something', virtualAudioGraph.currentTime))))
  //   .takeUntil(arpStop$)
  //   .subscribe()
  [...take(16, map(compose(store.dispatch, addAudioGraphSource), audioGraphFragments))]
}

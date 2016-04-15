import {compose, concat, nth, reverse} from 'ramda'
import {cycle} from '../utils/lazyIterables'

export default {
  random: xs => ({[Symbol.iterator]: function * () {
    while (true) yield nth(Math.floor(Math.random() * xs.length), xs)
  }}),
  up: cycle,
  down: compose(cycle, reverse),
  'up and down': xs => cycle(concat(xs, reverse(xs)))
}

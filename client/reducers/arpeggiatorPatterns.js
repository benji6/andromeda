import {makeCircular} from 'imlazy'
import {compose, concat, nth, reverse} from 'ramda'

export const initialState = {
  random: xs => ({[Symbol.iterator]: function * () {
    while (true) yield nth(Math.floor(Math.random() * xs.length), xs)
  }}),
  up: makeCircular,
  down: compose(makeCircular, reverse),
  'up and down': xs => makeCircular(concat(xs, reverse(xs)))
}

export default (state = initialState, action) => state

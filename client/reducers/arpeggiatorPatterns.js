import {makeCircular, iterate} from 'imlazy'
import {compose, concat, nth, reverse} from 'ramda'

export const initialState = {
  random: xs => iterate(_ => nth(Math.random() * (xs.length - 1), xs)),
  up: makeCircular,
  down: compose(makeCircular, reverse),
  'up and down': xs => makeCircular(concat(xs, reverse(xs)))
}

export default (state = initialState, action) => state

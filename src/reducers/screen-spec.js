import test from 'tape'
import reducer from './screen'
import {screenResize} from '../actions'

const reducerName = 'screen reducer'

test(`${reducerName} returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), {
    sideLength: 0,
    width: 0,
  })
  t.end()
})

test(`${reducerName} screenResize`, t => {
  t.deepEqual(
    reducer({sideLength: 10, width: 5}, screenResize({sideLength: 100, width: 50})),
    {sideLength: 100, width: 50}
  )
  t.end()
})

import {map, dropWhile, filter, head, isEmpty, takeWhile} from 'imlazy'
import {compose, gte, lt, prop} from 'ramda'
import audioContext from '../audioContext'

const lookAhead = 0.05

const startTimePath = prop('startTime')
const stopTimePath = prop('stopTime')
const startTimeLTTime = t => compose(gte(t + lookAhead), startTimePath)
const filterStopTimeLTTime = t => filter(compose(lt(t), stopTimePath))

export default class {
  constructor ({iterable, onStart, onStop}) {
    this.iterable = iterable
    this.onStart = onStart
    this.onStop = onStop
  }
  _timeoutPeriod () {
    return (startTimePath(head(this.iterable)) -
      audioContext.currentTime -
      lookAhead) * 1000
  }
  _schedule () {
    !isEmpty(this.iterable) &&
      window.setTimeout(::this.start, this._timeoutPeriod())
  }
  start () {
    const {currentTime} = audioContext
    const startTimeLTCurrentTime = startTimeLTTime(currentTime)
    const filterStopTimeLTCurrentTime = filterStopTimeLTTime(currentTime);
    [...compose(
      map(::this.onStart),
      filterStopTimeLTCurrentTime,
      takeWhile(startTimeLTCurrentTime)
    )(this.iterable)]

    this.iterable = dropWhile(startTimeLTCurrentTime, this.iterable)
    this._schedule()
    return this
  }
}

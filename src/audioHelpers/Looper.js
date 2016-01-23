import {
  map,
  concat,
  dropWhile,
  filter,
  head,
  isEmpty,
  reject,
  takeWhile
} from 'imlazy'
import {compose, gte, prop} from 'ramda'
import audioContext from '../audioContext'

const lookAhead = 0.05

const startTimePath = prop('startTime')
const stopTimePath = prop('stopTime')
const mapStopTimePath = map(stopTimePath)
const startTimeLTTime = t => compose(gte(t), startTimePath)
const stopTimeLTTime = t => compose(gte(t), stopTimePath)

export default class {
  constructor ({iterable, onStart, onStop}) {
    this._notStarted = iterable
    this._startedAndNotStopped = []
    this.onStart = onStart
    this.onStop = onStop
  }
  _nextStartTime () {
    return isEmpty(this._notStarted)
      ? Infinity
      : startTimePath(head(this._notStarted))
  }
  _nextStopTime () {
    return isEmpty(this._startedAndNotStopped)
      ? Infinity
      : Math.min(...mapStopTimePath(this._startedAndNotStopped))
  }
  _timeoutPeriod () {
    const nextStartTime = this._nextStartTime()
    const nextStopTime = this._nextStopTime()
    if (nextStopTime < nextStartTime) {
      return (nextStopTime - audioContext.currentTime) * 1000
    }
    return (nextStartTime - audioContext.currentTime - lookAhead) * 1000
  }
  _schedule () {
    if (isEmpty(this._notStarted) && isEmpty(this._startedAndNotStopped)) return
    this._timeoutId = window.setTimeout(::this.start, this._timeoutPeriod())
  }
  start () {
    const {currentTime} = audioContext
    const startTimeLTNextMoment = startTimeLTTime(currentTime + lookAhead)
    const stopTimeLTCurrentTime = stopTimeLTTime(currentTime)
    const rejectStopTimeLTCurrentTime = reject(stopTimeLTCurrentTime)

    ;[...compose(
      map(::this.onStop),
      filter(stopTimeLTCurrentTime)
    )(this._startedAndNotStopped)]

    const toStart = compose(
      rejectStopTimeLTCurrentTime,
      takeWhile(startTimeLTNextMoment)
    )(this._notStarted)

    ;[...map(::this.onStart, toStart)]

    this._notStarted = dropWhile(startTimeLTNextMoment, this._notStarted)
    this._startedAndNotStopped = compose(
      concat(toStart),
      rejectStopTimeLTCurrentTime,
    )(this._startedAndNotStopped)
    this._schedule()
    return this
  }
  stop () {
    window.clearTimeout(this._timeoutId)
    return this
  }
}

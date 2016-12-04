import {createElement} from 'react'
import Steps from './Steps'
import Marker from './Marker'
import ButtonPlay from '../../atoms/ButtonPlay'
import {Plus} from '../../atoms/ButtonIcons'
import {makeClassName} from '../../../utils/dom'
import {patternXLength} from '../../../constants/misc'
import audioContext from '../../../audioContext'
import {songMarkerPositionSet} from '../../../actions'
import store from '../../../store'

let animationFrameRequest

const visualLoop = () => {
  const state = store.getState()
  const {playStartTime, xLength} = state.song
  const {settings: {noteDuration}} = state
  const patternDuration = xLength * patternXLength * noteDuration
  animationFrameRequest = requestAnimationFrame(visualLoop)
  store.dispatch(songMarkerPositionSet((audioContext.currentTime - playStartTime) / patternDuration % 1))
}

export default ({
  height,
  isEmpty,
  isPlaying,
  lastDirection,
  markerPosition,
  patternBeatAdd,
  patternData,
  patternDelete,
  patternIds,
  patternNames,
  patternSynthAdd,
  songPlayingStart,
  songPlayingStop,
  songStepsAdd,
  songStepsRemove,
  width,
}) => {
  const xLength = patternData[0].length + 2
  const markerLeft = 1 / xLength

  return createElement('div', {className: makeClassName(
    'Song',
    lastDirection === 'left' ? 'slide-in-left' : 'slide-in-right'
  )},
    createElement(Steps, {
      height,
      isEmpty,
      onClick: (x, y) => {
        if (y === 0) return
        const patternId = patternIds[y - 1]
        if (x === 0) return location.href = `#/controllers/pattern/${patternId}`
        if (x === patternData[0].length + 1) return patternDelete(patternId)
        if (patternData[y - 1][x - 1].selected) songStepsRemove({patternId, x: x - 1})
        else songStepsAdd({patternId, x: x - 1})
      },
      patternData,
      width,
      yLabel: i => patternNames[i],
    }),
    createElement(Marker, {
      height,
      markerPosition: markerPosition * (1 - 2 * markerLeft) + markerLeft,
      width,
    }),
    createElement('div', {className: 'Song__Controls'},
      createElement(ButtonPlay, {
        onPlay: () => {
          songPlayingStart(audioContext.currentTime)
          setTimeout(visualLoop)
        },
        onStop: () => {
          cancelAnimationFrame(animationFrameRequest)
          songPlayingStop()
        },
        playing: isPlaying,
      }),
      createElement(Plus, {onClick: patternSynthAdd}, 'SYNTH PATTERN'),
      createElement(Plus, {onClick: patternBeatAdd}, 'BEAT PATTERN'),
    )
  )
}

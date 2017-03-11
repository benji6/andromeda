import {concat, map, range} from 'ramda'
import {connect} from 'react-redux'
import {defaultMemoize} from 'reselect'
import {beatStepExists, synthStepExists} from '../../../reducers/song'
import {
  patternBeatAdd,
  patternBeatDelete,
  patternSynthAdd,
  patternSynthDelete,
  songPlayingStart,
  songPlayingStop,
  songStepsAdd,
  songStepsRemove,
} from '../../../actions'
import Song from './Song'

const patternInfos = defaultMemoize((patternsBeat, patternsSynth) => concat(
  map(({id}) => ({
    href: `#/controllers/pattern-beat/${id}`,
    id,
    name: `Beat ${id}`,
    type: 'beat',
  }), patternsBeat),
  map(({id}) => ({
    href: `#/controllers/pattern-synth/${id}`,
    id,
    name: `Synth ${id}`,
    type: 'synth',
  }), patternsSynth)
))

const patternSteps = (xLength, steps, stepExists) => ({id}) => map(
  colIndex => ({selected: stepExists(colIndex, id, steps)}),
  range(0, xLength)
)

const patternData = defaultMemoize((xLength, patternsBeat, patternsSynth, steps) => concat(
  map(patternSteps(xLength, steps, beatStepExists), patternsBeat),
  map(patternSteps(xLength, steps, synthStepExists), patternsSynth),
))

const mapStateToProps = ({
  nav: {lastDirection},
  patternsBeat,
  patternsSynth,
  screen: {height, width},
  song: {
    isPlaying,
    markerPosition,
    steps,
    xLength,
  },
}) => ({
  height: height * 0.69,
  isEmpty: !patternsBeat.length && !patternsSynth.length,
  isPlaying,
  lastDirection,
  markerPosition,
  patternData: patternData(xLength, patternsBeat, patternsSynth, steps),
  patternInfos: patternInfos(patternsBeat, patternsSynth),
  width,
})

const mapDispatchToProps = {
  patternBeatAdd,
  patternBeatDelete,
  patternSynthAdd,
  patternSynthDelete,
  songPlayingStart,
  songPlayingStop,
  songStepsAdd,
  songStepsRemove,
}

export default connect(mapStateToProps, mapDispatchToProps)(Song)

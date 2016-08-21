import {createElement} from 'react'
import {connect} from 'react-redux'
import {
  patternBeatAdd,
  patternSynthAdd,
  patternDelete,
  songPlayingStart,
  songPlayingStop,
} from '../../actions'
import ButtonPlay from '../atoms/ButtonPlay'
import ButtonPrimary from '../atoms/ButtonPrimary'
import {Cross, Plus} from '../atoms/ButtonIcons'
import {mapIndexed} from '../../utils/helpers'
import PatternSvg from '../organisms/PatternSvg'

const mapStateToProps = ({
  activePatternIndex,
  dispatch,
  instrument,
  patterns,
  song: {playing},
}) => ({
  activePatternIndex,
  dispatch,
  instrument,
  patterns,
  playing,
})

const mapDispatchToProps = {
  patternBeatAdd,
  patternSynthAdd,
  patternDelete,
  songPlayingStart,
  songPlayingStop,
}

export default connect(mapStateToProps, mapDispatchToProps)(({
  patternBeatAdd,
  patternSynthAdd,
  patternDelete,
  patterns,
  playing,
  songPlayingStart,
  songPlayingStop,
}) =>
  createElement('div', {className: 'Song'},
    Boolean(patterns.length) && mapIndexed(({beatPattern}, i) =>
      createElement('div', {className: 'Song__Pattern', key: i},
        createElement(Cross, {onClick: () => patternDelete(i)}),
        createElement(ButtonPrimary, {
          red: beatPattern,
          small: true,
          to: `/controllers/pattern/${i}`,
        }, `${i} - ${beatPattern ? 'Beat' : 'Synth'}`),
        createElement(PatternSvg, {
          ...patterns[i],
          red: beatPattern,
          to: `/controllers/pattern/${i}`,
        })
      ), patterns),
    createElement(Plus, {onClick: patternSynthAdd}, 'NEW SYNTH PATTERN'),
    createElement(Plus, {onClick: patternBeatAdd}, 'NEW BEAT PATTERN'),
    createElement(ButtonPlay, {
      onPlay: songPlayingStart,
      onStop: songPlayingStop,
      playing,
    })
  )
)

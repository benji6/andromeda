import React from 'react'
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
  <div className='Song'>
    {Boolean(patterns.length) && mapIndexed(({beatPattern}, i) =>
        <div {...{
          className: 'Song__Pattern',
          key: i,
        }}>
          <Cross onClick={() => patternDelete(i)} />
          <ButtonPrimary {...{
            red: beatPattern,
            small: true,
            to: `/controllers/pattern/${i}`,
          }}>
            {`${i} - ${beatPattern ? 'Beat' : 'Synth'}`}
          </ButtonPrimary>
          <PatternSvg {...patterns[i]} red={beatPattern} to={`/controllers/pattern/${i}`} />
        </div>, patterns)}
    <Plus {...{onClick: patternSynthAdd}}>NEW SYNTH PATTERN</Plus>
    <Plus {...{onClick: patternBeatAdd}}>NEW BEAT PATTERN</Plus>
    <ButtonPlay {...{
      onPlay: songPlayingStart,
      onStop: songPlayingStop,
      playing,
    }}/>
  </div>
)

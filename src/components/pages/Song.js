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
import ButtonPrimarySmall from '../atoms/ButtonPrimarySmall'
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
  <div>
    {patterns.length
      ? mapIndexed((_, i) =>
        <div className='Song__Pattern' key={i}>
          <Cross onClick={() => patternDelete(i)} />
          <ButtonPrimarySmall to={`/controllers/pattern/${i}`}>
            {`Pattern ${i}`}
          </ButtonPrimarySmall>
          <PatternSvg {...patterns[i]} to={`/controllers/pattern/${i}`} />
        </div>, patterns)
      : null}
    <div className='Song__AddContainer'>
      <Plus {...{onClick: patternSynthAdd}}>NEW SYNTH PATTERN</Plus>
      <Plus {...{onClick: patternBeatAdd, style: {display: 'none'}}}>NEW BEAT PATTERN</Plus>
    </div>
    <ButtonPlay {...{
      onPlay: songPlayingStart,
      onStop: songPlayingStop,
      playing,
    }}/>
  </div>
)

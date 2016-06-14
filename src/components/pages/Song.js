import React from 'react'
import {connect} from 'react-redux'
import {
  addNewPattern,
  deletePattern,
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
  addNewPattern,
  deletePattern,
  songPlayingStart,
  songPlayingStop,
}

export default connect(mapStateToProps, mapDispatchToProps)(({
  addNewPattern,
  deletePattern,
  patterns,
  playing,
  songPlayingStart,
  songPlayingStop,
}) =>
  <div>
    {patterns.length
      ? mapIndexed((_, i) =>
        <div className='Song__Pattern' key={i}>
          <Cross onClick={() => deletePattern(i)} />
          <ButtonPrimarySmall to={`/controllers/pattern/${i}`}>
            {`Pattern ${i}`}
          </ButtonPrimarySmall>
          <PatternSvg {...patterns[i]} to={`/controllers/pattern/${i}`} />
        </div>, patterns)
      : null}
    <div className='text-center padding-1'>
      <Plus {...{onClick: addNewPattern}}>New pattern</Plus>
    </div>
    <ButtonPlay {...{
      onPlay: songPlayingStart,
      onStop: songPlayingStop,
      playing,
    }}/>
  </div>
)

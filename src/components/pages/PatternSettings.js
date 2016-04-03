import capitalize from 'capitalize'
import {compose, map} from 'ramda'
import React from 'react'
import {connect} from 'react-redux'
import {controllableInstrumentInstanceNames} from '../../utils/derivedData'
import {eventValuePath} from '../../utils/helpers'
import {
  setPatternYLength,
  updatePatternInstrument,
  updatePatternOctave,
  updatePatternVolume,
  updatePatternXLength
} from '../../actions'
import InstrumentSelector from '../molecules/InstrumentSelector'
import RangeSelector from '../molecules/RangeSelector'
import FullButton from '../atoms/FullButton'

const connectComponent = connect(({
  activePatternIndex,
  dispatch,
  patterns,
  plugins
}, {params: {patternId}}) => {
  const activePattern = patterns[patternId]
  const {instrument, octave, xLength, yLength, volume} = activePattern
  return {
    dispatch,
    instrument,
    octave,
    patternId,
    plugins,
    volume,
    xLength,
    yLength
  }
})

export default connectComponent(({
  dispatch,
  instrument,
  octave,
  patternId,
  plugins,
  volume,
  xLength,
  yLength
}) =>
  <div className='flex-column text-center'>
    <h2 className='text-center'>Pattern {patternId} Settings</h2>
    <InstrumentSelector defaultValue={instrument}
      handleChange={(compose(
        dispatch,
        updatePatternInstrument,
        eventValuePath
      ))}
      label='Instrument'
      options={map(
        instr => ({text: capitalize.words(instr), value: instr}),
        controllableInstrumentInstanceNames(plugins)
      )}
    />
    <RangeSelector
      key='2'
      max='1'
      min='0'
      onChange={compose(
        dispatch,
        updatePatternVolume,
        Number,
        eventValuePath
      )}
      output={Math.round(volume * 100)}
      step='0.01'
      text='Volume'
      value={volume}
    />
    <RangeSelector
      key='3'
      max='16'
      min='1'
      onChange={compose(
        dispatch,
        updatePatternXLength,
        Number,
        eventValuePath
      )}
      output={String(xLength)}
      text='Length'
      value={xLength}
    />
    <RangeSelector
      key='4'
      max='16'
      min='1'
      onChange={compose(
        dispatch,
        setPatternYLength,
        Number,
        eventValuePath
      )}
      output={String(yLength)}
      text='Height'
      value={yLength}
    />
    <RangeSelector
      key='5'
      max='2'
      min='-3'
      onChange={compose(
        dispatch,
        updatePatternOctave,
        Number,
        eventValuePath
      )}
      output={octave}
      text='Octave'
      value={octave}
    />
    <div>
      <span className='inline-label-text'></span>
      <FullButton to={`/controllers/pattern/${patternId}`}>OK</FullButton>
    </div>
  </div>)

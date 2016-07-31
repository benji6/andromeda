import capitalize from 'capitalize'
import {map} from 'ramda'
import {createElement} from 'react'
import {connect} from 'react-redux'
import {controllableInstrumentInstanceNames} from '../../utils/derivedData'
import {
  patternInstrumentSet,
  patternVolumeSet,
  patternXLengthSet,
} from '../../actions'
import InstrumentSelector from '../molecules/InstrumentSelector'
import RangeSelector from '../molecules/RangeSelector'
import ButtonPrimary from '../atoms/ButtonPrimary'
import InputLabel from '../atoms/InputLabel'

const connectComponent = connect(({
  activePatternIndex,
  dispatch,
  patterns,
  plugins,
}, {params: {patternId}}) => {
  const activePattern = patterns[patternId]
  const {instrument, xLength, volume} = activePattern
  return {
    dispatch,
    instrument,
    patternId: Number(patternId),
    plugins,
    volume,
    xLength,
  }
})

export default connectComponent(({
  dispatch,
  instrument,
  patternId,
  plugins,
  volume,
  xLength,
}) =>
  createElement('div', {className: 'PatternSettings'},
    createElement('h2', null, `Pattern ${patternId} Settings`),
    createElement(InstrumentSelector, {
      defaultValue: instrument,
      handleChange: e => dispatch(patternInstrumentSet({
        patternId,
        value: e.target.value,
      })),
      label: 'Instrument',
      options: map(
        instr => ({text: capitalize.words(instr), value: instr}),
        controllableInstrumentInstanceNames(plugins)
      ),
    }),
    createElement(RangeSelector, {
      max: 1,
      min: 0,
      onChange: e => dispatch(patternVolumeSet({
        patternId,
        value: Number(e.target.value),
      })),
      output: Math.round(volume * 100),
      step: 0.01,
      text: 'Volume',
      value: volume,
    }),
    createElement(RangeSelector, {
      max: '16',
      min: '1',
      onChange: e => dispatch(patternXLengthSet({
        patternId,
        value: Number(e.target.value),
      })),
      output: String(xLength),
      text: 'Length',
      value: xLength,
    }),
    createElement('div', null,
      createElement(InputLabel),
      createElement(
        ButtonPrimary,
        {to: `/controllers/pattern/${patternId}`},
        'OK'
      )
    )
  ))

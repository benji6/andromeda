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

const mapDispatchToProps = {
  patternInstrumentSet,
  patternVolumeSet,
  patternXLengthSet,
}

const mapStateToProps = ({
  activePatternIndex,
  dispatch,
  patterns,
  plugins,
}, {params: {patternId}}) => {
  const {beatPattern, instrument, xLength, volume} = patterns[patternId]
  return {
    beatPattern,
    dispatch,
    instrument,
    patternId: Number(patternId),
    plugins,
    volume,
    xLength,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(({
  beatPattern,
  instrument,
  patternId,
  patternInstrumentSet,
  patternVolumeSet,
  patternXLengthSet,
  plugins,
  volume,
  xLength,
}) =>
  createElement('div', {className: 'PatternSettings'},
    createElement('h2', null, `Pattern ${patternId} Settings`),
    !beatPattern && createElement(InstrumentSelector, {
      defaultValue: instrument,
      handleChange: e => patternInstrumentSet({
        patternId,
        value: e.target.value,
      }),
      label: 'Instrument',
      options: map(
        instr => ({text: capitalize.words(instr), value: instr}),
        controllableInstrumentInstanceNames(plugins)
      ),
    }),
    createElement(RangeSelector, {
      max: 1,
      min: 0,
      onChange: e => patternVolumeSet({
        patternId,
        value: Number(e.target.value),
      }),
      output: Math.round(volume * 100),
      step: 0.01,
      text: 'Volume',
      value: volume,
    }),
    createElement(RangeSelector, {
      max: '16',
      min: '1',
      onChange: e => patternXLengthSet({
        patternId,
        value: Number(e.target.value),
      }),
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

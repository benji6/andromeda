import capitalize from 'capitalize'
import {map} from 'ramda'
import {createElement} from 'react'
import {connect} from 'react-redux'
import {controllableInstrumentInstanceNames} from '../../utils/derivedData'
import {findById} from '../../utils/helpers'
import {
  patternInstrumentSet,
  patternVolumeSet,
} from '../../actions'
import InstrumentSelector from '../molecules/InstrumentSelector'
import RangeLabelled from '../molecules/RangeLabelled'
import ButtonPrimary from '../atoms/ButtonPrimary'
import InputLabel from '../atoms/InputLabel'

const mapDispatchToProps = {
  patternInstrumentSet,
  patternVolumeSet,
}

const mapStateToProps = ({
  activePatternIndex,
  dispatch,
  patterns,
  plugins,
}, {params: {patternId}}) => {
  const {beatPattern, instrument, volume} = findById(Number(patternId), patterns)
  return {
    beatPattern,
    dispatch,
    instrument,
    patternId: Number(patternId),
    plugins,
    volume,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(({
  beatPattern,
  instrument,
  patternId,
  patternInstrumentSet,
  patternVolumeSet,
  plugins,
  volume,
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
    createElement(RangeLabelled, {
      max: 1,
      min: 0,
      onChange: e => patternVolumeSet({
        patternId,
        value: Number(e.target.value),
      }),
      output: Math.round(volume * 100),
      step: 0.01,
      value: volume,
    }, 'Volume'),
    createElement('div', null,
      createElement(InputLabel),
      createElement(
        ButtonPrimary,
        {to: `/controllers/pattern/${patternId}`},
        'OK'
      )
    )
  ))

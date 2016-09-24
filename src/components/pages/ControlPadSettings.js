import capitalize from 'capitalize'
import {map} from 'ramda'
import {createElement} from 'react'
import {connect} from 'react-redux'
import {controllableInstrumentInstanceNames} from '../../utils/derivedData'
import {eventValuePath, eventCheckedPath} from '../../utils/dom'
import {
  controlPadInstrumentSet,
  controlPadNoScaleSet,
  controlPadOctaveSet,
  controlPadPortamentoSet,
  controlPadRangeSet,
} from '../../actions'
import ButtonPrimary from '../atoms/ButtonPrimary'
import InputLabel from '../atoms/InputLabel'
import CheckboxSelector from '../molecules/CheckboxSelector'
import RangeSelector from '../molecules/RangeSelector'
import InstrumentSelector from '../molecules/InstrumentSelector'

const mapStateToProps = ({
  controlPad,
  dispatch,
  plugins,
}) => ({
  controlPad,
  dispatch,
  plugins,
})

export default connect(mapStateToProps)(({
  controlPad,
  dispatch,
  plugins,
}) =>
  createElement('div', {className: 'ControlPadSettings'},
    createElement('h2', null, 'Control Pad Settings'),
    createElement(InstrumentSelector, {
      defaultValue: controlPad.instrument,
      handleChange: comp(dispatch, controlPadInstrumentSet, eventValuePath),
      label: 'Instrument',
      options: map(instrument => ({
        text: capitalize.words(instrument),
        value: instrument,
      }), controllableInstrumentInstanceNames(plugins)),
    }),
    createElement(RangeSelector, {
      max: 2,
      min: -3,
      onChange: comp(dispatch, controlPadOctaveSet, Number, eventValuePath),
      output: controlPad.octave,
      text: 'Octave',
      value: controlPad.octave,
    }),
    createElement(RangeSelector, {
      max: 3,
      min: 1,
      onChange: comp(dispatch, controlPadRangeSet, Number, eventValuePath),
      output: controlPad.range,
      text: 'Range',
      value: controlPad.range,
    }),
    createElement(CheckboxSelector, {
      checked: controlPad.portamento,
      onChange: comp(dispatch, controlPadPortamentoSet, eventCheckedPath),
      text: 'Portamento',
    }),
    createElement(CheckboxSelector, {
      checked: controlPad.noScale,
      onChange: comp(dispatch, controlPadNoScaleSet, eventCheckedPath),
      text: 'No Scale',
    }),
    createElement('div', null,
      createElement(InputLabel),
      createElement(ButtonPrimary, {to: '/controllers/control-pad'}, 'OK')
    )
  ))

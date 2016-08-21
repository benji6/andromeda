import capitalize from 'capitalize'
import {map} from 'ramda'
import {createElement} from 'react'
import {connect} from 'react-redux'
import {controllableInstrumentInstanceNames} from '../../utils/derivedData'
import {eventValuePath} from '../../utils/helpers'
import InstrumentSelector from '../molecules/InstrumentSelector'
import {
  keyboardMonophonicSet,
  keyboardInstrumentSet,
  keyboardOctaveSet,
  keyboardVolumeSet,
} from '../../actions'
import ButtonPrimary from '../atoms/ButtonPrimary'
import InputLabel from '../atoms/InputLabel'
import CheckboxSelector from '../molecules/CheckboxSelector'
import RangeSelector from '../molecules/RangeSelector'

const mapStateToProps = ({keyboard, dispatch, plugins}) => ({keyboard, dispatch, plugins})

export default connect(mapStateToProps)(({keyboard, dispatch, plugins}) =>
  createElement('div', {className: 'KeyboardSettings'},
    createElement('h2', null, 'Keyboard Settings'),
    createElement(InstrumentSelector, {
      defaultValue: keyboard.instrument,
      handleChange: comp(
        dispatch,
        keyboardInstrumentSet,
        eventValuePath
      ),
      label: 'Instrument',
      options: map(
        instrument => ({text: capitalize.words(instrument), value: instrument}),
        controllableInstrumentInstanceNames(plugins)
      ),
    }),
    createElement(RangeSelector, {
      max: 1,
      min: 0,
      onChange: comp(dispatch, keyboardVolumeSet, Number, eventValuePath),
      output: Math.round(keyboard.volume * 100),
      step: 0.01,
      text: 'Volume',
      value: keyboard.volume,
    }),
    createElement(RangeSelector, {
      max: 2,
      min: -3,
      onChange: comp(dispatch, keyboardOctaveSet, Number, eventValuePath),
      output: keyboard.octave,
      text: 'Octave',
      value: keyboard.octave,
    }),
    createElement(CheckboxSelector, {
      checked: keyboard.monophonic,
      onChange: e => dispatch(keyboardMonophonicSet(e.target.checked)),
      text: 'Monophonic',
    }),
    createElement('div', null,
      createElement(InputLabel),
      createElement(ButtonPrimary, {to: '/settings'}, 'OK')
    )
  ))

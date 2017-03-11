import capitalize from 'capitalize'
import {map} from 'ramda'
import {createElement, PropTypes} from 'react'
import {controllableInstrumentInstanceNames} from '../../../utils/derivedData'
import InstrumentSelector from '../../molecules/InstrumentSelector'
import ButtonPrimary from '../../atoms/ButtonPrimary'
import InputLabel from '../../atoms/InputLabel'

const PatternSynthSettings = ({
  instrument,
  patternId,
  patternSynthInstrumentSet,
  plugins,
  router,
}) => createElement('div', {className: 'PatternSettings'},
  createElement('h2', null, `Pattern ${patternId} Settings`),
  createElement(InstrumentSelector, {
    defaultValue: instrument,
    handleChange: e => patternSynthInstrumentSet({
      patternId,
      value: e.target.value,
    }),
    label: 'Instrument',
    options: map(
      instr => ({text: capitalize.words(instr), value: instr}),
      controllableInstrumentInstanceNames(plugins)
    ),
  }),
  createElement('div', null,
    createElement(InputLabel),
    createElement(ButtonPrimary, {onClick: router.goBack}, 'OK')
  )
)

PatternSynthSettings.propTypes = {
  instrument: PropTypes.string.isRequired,
  patternId: PropTypes.number.isRequired,
  patternSynthInstrumentSet: PropTypes.func.isRequired,
  plugins: PropTypes.object.isRequired,
}

export default PatternSynthSettings

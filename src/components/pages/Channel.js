import {difference, map, pluck, prop, tail} from 'ramda'
import React from 'react'
import {connect} from 'react-redux'
import {
  addEffectToChannel,
  addInstrumentToChannel,
  removeEffectFromChannel,
  removeInstrumentFromChannel
} from '../../actions'
import ButtonPrimarySmall from '../atoms/ButtonPrimarySmall'
import ButtonPrimary from '../atoms/ButtonPrimary'
import {Cross, Plus} from '../atoms/ButtonIcons'
import InputSelect from '../atoms/InputSelect'
import {mapIndexed} from '../../utils/helpers'

let selectedAddEffect = null
let selectedAddSource = null

const connectComponent = connect(({
  dispatch,
  plugins: {channels, effectInstances, instrumentInstances}
}, {params}) => ({
  channelId: Number(params.channelId),
  channels,
  dispatch,
  effectInstances,
  instrumentInstances
}))

export default connectComponent(({
  channelId,
  channels,
  dispatch,
  effectInstances,
  instrumentInstances
}) => {
  const sources = prop('instruments', channels[channelId])
  const effects = prop('effects', channels[channelId])
  const addSources = difference(pluck('name', instrumentInstances), sources)
  const addEffects = difference(pluck('name', effectInstances), effects)
  selectedAddSource = addSources[0]
  selectedAddEffect = addEffects[0]

  return <div>
    <h1 className='text-center'>{`Channel ${channelId}`}</h1>
      <h2 className='text-center'>Effects</h2>
      {mapIndexed(
        (name, i) => <div key={i} className='text-center'>
          <ButtonPrimary to={`/plugins/effects/${name}`}>
            {name}
          </ButtonPrimary>
          <Cross onClick={_ => dispatch(removeEffectFromChannel({
            channel: channelId,
            name
          }))}/>
        </div>,
        effects
      )}
      {Boolean(addEffects.length) && <p className='text-center'>Add effect</p>}
      {Boolean(addEffects.length) && <div className='text-center'>
        <InputSelect
          defaultValue={selectedAddEffect}
          onChange={e => selectedAddEffect = e.target.value}
          options={map(text => ({text, value: text}), addEffects)}
        />
        <Plus onClick={_ => dispatch(addEffectToChannel({
          channel: channelId,
          name: selectedAddEffect
        }))}/>
      </div>}
      <h2 className='text-center'>Sources</h2>
      <div className='margin-bottom text-center'>
        {map(
          name => <div className='inline-block margin-horizontal-small' key={name}>
            <ButtonPrimarySmall to={`/plugins/instruments/${name}`}>
              {name}
            </ButtonPrimarySmall>
            <Cross onClick={_ => dispatch(removeInstrumentFromChannel({
              channel: channelId,
              name
            }))}/>
          </div>,
          sources
        )}
      </div>
      {Boolean(addSources.length) && <p className='text-center'>Add source</p>}
      {Boolean(addSources.length) && <div className='text-center'>
        <InputSelect
          defaultValue={selectedAddSource}
          onChange={e => selectedAddSource = e.target.value}
          options={map(text => ({text, value: text}), addSources)}
        />
        <Plus onClick={_ => {
          dispatch(addInstrumentToChannel({
            channel: channelId,
            name: selectedAddSource
          }))
          selectedAddSource = tail(addSources)[0]
        }}/>
      </div>}
    </div>
})

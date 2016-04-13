import {difference, head, isEmpty, map, nth, pluck, prop, tail} from 'ramda'
import React from 'react'
import {connect} from 'react-redux'
import {
  addEffectToChannel,
  addInstrumentToChannel,
  removeEffectFromChannel,
  removeInstrumentFromChannel
} from '../../actions'
import ButtonPrimarySmall from '../atoms/ButtonPrimarySmall'
import FullButton from '../atoms/FullButton'
import {Cross, Plus} from '../atoms/ButtonIcons'
import FullSelect from '../atoms/FullSelect'
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
  const sources = prop('instruments', nth(channelId, channels))
  const effects = prop('effects', nth(channelId, channels))
  const addSources = difference(pluck('name', instrumentInstances), sources)
  const addEffects = difference(pluck('name', effectInstances), effects)
  selectedAddSource = head(addSources)
  selectedAddEffect = head(addEffects)

  return <div>
    <h1 className='text-center'>{`Channel ${channelId}`}</h1>
      <h2 className='text-center'>Effects</h2>
      {mapIndexed(
        (name, i) => <div key={i} className='text-center'>
          <FullButton to={`/plugins/effects/${name}`}>
            {name}
          </FullButton>
          <Cross onClick={_ => dispatch(removeEffectFromChannel({
            channel: channelId,
            name
          }))}/>
        </div>,
        effects
      )}
      {!isEmpty(addEffects) && <p className='text-center'>Add effect</p>}
      {!isEmpty(addEffects) && <div className='text-center'>
        <FullSelect
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
      {!isEmpty(addSources) && <p className='text-center'>Add source</p>}
      {!isEmpty(addSources) && <div className='text-center'>
        <FullSelect
          defaultValue={selectedAddSource}
          onChange={e => selectedAddSource = e.target.value}
          options={map(text => ({text, value: text}), addSources)}
        />
        <Plus onClick={_ => {
          dispatch(addInstrumentToChannel({
            channel: channelId,
            name: selectedAddSource
          }))
          selectedAddSource = head(tail(addSources))
        }}/>
      </div>}
    </div>
})

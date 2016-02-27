import {difference, head, isEmpty, map, nth, pluck, prop, tail} from 'ramda'
import React from 'react'
import {
  addEffectToChannel,
  addInstrumentToChannel,
  removeEffectFromChannel,
  removeInstrumentFromChannel
} from '../../actions'
import {rawConnect} from '../../utils/helpers'
import FullButton from '../atoms/FullButton'
import {Cross, Plus} from '../atoms/IconButtons'
import FullSelect from '../atoms/FullSelect'
import {mapIndexed} from '../../utils/helpers'

let selectedAddEffect = null
let selectedAddSource = null

export default rawConnect(({
  dispatch,
  params,
  plugins: {channels, effectInstances, instrumentInstances}
}) => {
  const channelId = Number(params.channelId)
  const sources = prop('instruments', nth(params.channelId, channels))
  const effects = prop('effects', nth(params.channelId, channels))
  const addSources = difference(pluck('name', instrumentInstances), sources)
  const addEffects = pluck('name', effectInstances)
  selectedAddSource = selectedAddSource || head(addSources)
  selectedAddEffect = selectedAddEffect || head(addEffects)

  return <div className='flex-column text-center justify-center'>
    <h1>{`Channel ${channelId}`}</h1>
    <h2>Sources</h2>
        {map(
          name => <div className='text-center' key={name}>
            <FullButton to={`/plugins/instruments/${name}`}>
              {name}
            </FullButton>
            <Cross onClick={_ => dispatch(removeInstrumentFromChannel({
              channel: channelId,
              name
            }))}/>
          </div>,
        sources
      )}
    {!isEmpty(addSources) && <p>Add source</p>}
    {!isEmpty(addSources) && <div>
      <FullSelect
        defaultValue={selectedAddSource}
        onChange={e => selectedAddSource = e.target.value}
        options={map(text => ({text, value: text}), addSources)}
      />
      <Plus onClick={e => {
        dispatch(addInstrumentToChannel({
          channel: channelId,
          name: selectedAddSource
        }))
        selectedAddSource = head(tail(addSources))
      }}/>
    </div>}
    <h2>Effects</h2>
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
      <p>Add effect</p>
      <div>
        <FullSelect
          defaultValue={selectedAddEffect}
          onChange={e => selectedAddEffect = e.target.value}
          options={map(text => ({text, value: text}), addEffects)}
        />
        <Plus onClick={e => dispatch(addEffectToChannel({
          channel: channelId,
          name: selectedAddEffect
        }))}/>
      </div>
  </div>
})

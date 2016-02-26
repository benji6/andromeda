import {difference, head, isEmpty, map, nth, pluck, prop, tail} from 'ramda'
import React from 'react'
import {addInstrumentToChannel} from '../../actions'
import {rawConnect} from '../../utils/helpers'
import FullButton from '../atoms/FullButton'
import {Plus} from '../atoms/IconButtons'
import FullSelect from '../atoms/FullSelect'

let selectedAddSource = null

export default rawConnect(({
  dispatch,
  params,
  plugins: {channels, instrumentInstances}
}) => {
  const channelId = Number(params.channelId)
  const sources = prop('instruments', nth(params.channelId, channels))
  const addSources = difference(pluck('name', instrumentInstances), sources)
  selectedAddSource = selectedAddSource || head(addSources)
  return <div className='flex-column text-center justify-center'>
    <h1>{`Channel ${channelId}`}</h1>
    <h2>Sources</h2>
        {map(
          x => <div className='text-center' key={x}>
            <FullButton to={`/plugins/instruments/${x}`}>
              {x}
            </FullButton>
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
        {map(
          x => <div key={x} className='text-center'>
            <FullButton to={`/plugins/effects/${x}`}>
              {x}
            </FullButton>
          </div>,
          prop('effects', nth(params.channelId, channels))
        )}
  </div>
})

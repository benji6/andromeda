import capitalize from 'capitalize'
import {
  always,
  compose,
  equals,
  identity,
  map,
  difference,
  reject,
} from 'ramda'
import React from 'react'
import {connect} from 'react-redux'
import {mapIndexed} from '../../tools/indexedIterators'
import Navigation from '../organisms/Navigation'
import FullSelect from '../atoms/FullSelect'
import {Cross, Down, Plus, Up} from '../atoms/IconButtons'
import {addChannelEffect,
        addChannelSource,
        moveChannelEffectDown,
        moveChannelEffectUp,
        removeChannelSource,
        removeChannelEffect,
        updateSelectedAddEffect,
        updateSelectedAddSource} from '../../actions'
import {eventValuePath} from '../../tools/paths'

export default connect(identity)(({audioGraphAndChannels: {channels},
                                   dispatch,
                                   instruments,
                                   params,
                                   ...props}) => {
  const channelId = Number(params.channelId)
  const appEffects = props.effects
  const {effects,
         selectedAddEffect,
         selectedAddSource,
         sources} = channels[channelId]
  const availableSources = difference(instruments, sources)
  return <div>
    <Navigation />
    <div className="flex-column text-center justify-center">
      <h1>{`Channel ${channelId}`}</h1>
      <h2>Sources</h2>
      <table className="table-center">
        <tbody>
          {mapIndexed((source, sourceId) =>
            <tr key={sourceId}>
              <td>{capitalize.words(source)}</td>
              <td><Cross onClick={compose(dispatch,
                                          removeChannelSource,
                                          always({channelId, sourceId}))} /></td>
            </tr>, sources)}
            {availableSources.length ?
            <tr key={sources.length}>
              <td>
              <FullSelect defaultValue={selectedAddSource}
                          onChange={compose(dispatch,
                                            updateSelectedAddSource,
                                            value => ({channelId, selectedAddSource: value}),
                                            eventValuePath)}
                          options={map(value => ({text: capitalize.words(value),
                                                  value}), availableSources)} />
              </td>
            <td><Plus onClick={() => {
              compose(dispatch,
                      addChannelSource,
                      always({channelId,
                              source: selectedAddSource}))()
              compose(dispatch,
                      updateSelectedAddSource,
                      always({channelId,
                              selectedAddSource: reject(equals(selectedAddSource),
                                                        availableSources)[0]}))()
            }} /></td>
          </tr> :
          null}
        </tbody>
      </table>
      <h2>Effects</h2>
      <table className="table-center">
        <tbody>
          {mapIndexed(({name, id}, i) =>
            <tr key={id}>
              <td>{capitalize.words(name)}</td>
              <td><Cross onClick={compose(dispatch,
                                          removeChannelEffect,
                                          always({channelId, effectId: id}))} /></td>
              <td>{i ? <Up onClick={compose(dispatch,
                                             moveChannelEffectUp,
                                             always({channelId, effectId: id}))} /> : ''}</td>
              <td>{i === effects.length - 1 ? '' : <Down onClick={compose(dispatch,
                                                                   moveChannelEffectDown,
                                                                   always({channelId, effectId: id}))} />}</td>
            </tr>, effects)}
          <tr key={effects.length}>
            <td><FullSelect defaultValue={selectedAddEffect}
                            onChange={compose(dispatch,
                                              updateSelectedAddEffect,
                                              value => ({channelId, selectedAddEffect: value}),
                                              eventValuePath)}
                            options={map(value => ({text: capitalize.words(value),
                                                    value}), appEffects)} /></td>
            <td><Plus onClick={compose(dispatch,
                                       addChannelEffect,
                                       always({channelId,
                                               effect: selectedAddEffect,
                                               effects}))} /></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
})

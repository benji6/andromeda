import capitalize from 'capitalize';
import {compose, identity, map, difference} from 'ramda';
import React from 'react';
import {connect} from 'react-redux';
import {mapIndexed} from '../../tools/indexedIterators';
import Navigation from '../organisms/Navigation';
import FullSelect from '../atoms/FullSelect';
import Cross from '../atoms/icon-buttons/Cross';
import Down from '../atoms/icon-buttons/Down';
import Plus from '../atoms/icon-buttons/Plus';
import Up from '../atoms/icon-buttons/Up';
import {moveChannelSourceDown,
        moveChannelSourceUp,
        moveEffectSourceDown,
        moveEffectSourceUp,
        removeChannelSource,
        removeChannelEffect,
        updateSelectedAddEffect,
        updateSelectedAddSource} from '../../actions';

const targetValue = e => e.target.value;

export default connect(identity)(({channels,
                                   dispatch,
                                   effect,
                                   instrument: {instruments},
                                   params: {channelId}}) => {
  const appEffects = effect.effects;
  const {effects,
         selectedAddEffect,
         selectedAddSource,
         sources} = channels[channelId];
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
              <td><Cross onClick={() => compose(dispatch, removeChannelSource)({channelId, sourceId})} /></td>
              <td>{sourceId ? <Up onClick={() => compose(dispatch, moveChannelSourceUp)({channelId, sourceId})} /> : ''}</td>
              <td>{sourceId === sources.length - 1 ? '' : <Down onClick={() => compose(dispatch, moveChannelSourceDown)({channelId, sourceId})} />}</td>
            </tr>, sources)}
          <tr key={sources.length}>
            <td><FullSelect defaultValue={selectedAddSource}
                            onChange={compose(dispatch,
                                              updateSelectedAddSource,
                                              value => ({channelId, selectedAddSource: value}),
                                              targetValue)}
                            options={map(value => ({text: capitalize.words(value),
                                                    value}), difference(instruments, sources))} /></td>
            <td><Plus onClick={() => console.log('add source')} /></td>
          </tr>
        </tbody>
      </table>
      <h2>Effects</h2>
      <table className="table-center">
        <tbody>
          {mapIndexed((mapEffect, effectId) =>
            <tr key={effectId}>
              <td>{capitalize.words(mapEffect)}</td>
              <td><Cross onClick={() => compose(dispatch, removeChannelEffect)({channelId, effectId})} /></td>
              <td>{effectId ? <Up onClick={() => compose(dispatch, moveEffectSourceUp)({channelId, effectId})} /> : ''}</td>
              <td>{effectId === effects.length - 1 ? '' : <Down onClick={() => compose(dispatch, moveEffectSourceDown)({channelId, effectId})} />}</td>
            </tr>, effects)}
          <tr key={effects.length}>
            <td><FullSelect defaultValue={selectedAddEffect}
                            onChange={compose(dispatch,
                                              updateSelectedAddEffect,
                                              value => ({channelId, selectedAddEffect: value}),
                                              targetValue)}
                            options={map(value => ({text: capitalize.words(value),
                                                    value}), appEffects)} /></td>
            <td><Plus onClick={() => console.log('add effect')} /></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>;
});

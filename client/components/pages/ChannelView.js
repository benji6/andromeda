import capitalize from 'capitalize';
import {compose, equals, identity, map, difference, reject} from 'ramda';
import React from 'react';
import {connect} from 'react-redux';
import {mapIndexed} from '../../tools/indexedIterators';
import Navigation from '../organisms/Navigation';
import FullSelect from '../atoms/FullSelect';
import {Cross, Down, Plus, Up} from '../atoms/IconButtons';
import {addChannelEffect,
        addChannelSource,
        moveChannelSourceDown,
        moveChannelSourceUp,
        moveChannelEffectDown,
        moveChannelEffectUp,
        removeChannelSource,
        removeChannelEffect,
        updateSelectedAddEffect,
        updateSelectedAddSource} from '../../actions';

const targetValue = e => e.target.value;

export default connect(identity)(({channels,
                                   dispatch,
                                   instruments,
                                   params: {channelId},
                                   ...props}) => {
  const appEffects = props.effects;
  const {effects,
         selectedAddEffect,
         selectedAddSource,
         sources} = channels[channelId];
  const availableSources = difference(instruments, sources);
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
                                          () => ({channelId, sourceId}))} /></td>
              <td>{sourceId ? <Up onClick={compose(dispatch,
                                           moveChannelSourceUp,
                                           () => ({channelId, sourceId}))} /> : ''}</td>
              <td>{sourceId === sources.length - 1 ? '' : <Down onClick={compose(dispatch,
                                                                         moveChannelSourceDown,
                                                                         () => ({channelId, sourceId}))} />}</td>
            </tr>, sources)}
            {availableSources.length ?
            <tr key={sources.length}>
              <td>
              <FullSelect defaultValue={selectedAddSource}
                          onChange={compose(dispatch,
                                            updateSelectedAddSource,
                                            value => ({channelId, selectedAddSource: value}),
                                            targetValue)}
                          options={map(value => ({text: capitalize.words(value),
                                                  value}), availableSources)} />
              </td>
            <td><Plus onClick={() => {
              compose(dispatch,
                      addChannelSource,
                      () => ({channelId,
                              source: selectedAddSource}))();
              compose(dispatch,
                      updateSelectedAddSource,
                      () => ({channelId,
                              selectedAddSource: reject(equals(selectedAddSource),
                                                        availableSources)[0]}))();
            }} /></td>
          </tr> :
          null}
        </tbody>
      </table>
      <h2>Effects</h2>
      <table className="table-center">
        <tbody>
          {mapIndexed((mapEffect, effectId) =>
            <tr key={effectId}>
              <td>{capitalize.words(mapEffect)}</td>
              <td><Cross onClick={compose(dispatch,
                                          removeChannelEffect,
                                          () => ({channelId, effectId}))} /></td>
              <td>{effectId ? <Up onClick={compose(dispatch,
                                                   moveChannelEffectUp,
                                                   () => ({channelId, effectId}))} /> : ''}</td>
              <td>{effectId === effects.length - 1 ? '' : <Down onClick={compose(dispatch,
                                                                                 moveChannelEffectDown,
                                                                                 () => ({channelId, effectId}))} />}</td>
            </tr>, effects)}
          <tr key={effects.length}>
            <td><FullSelect defaultValue={selectedAddEffect}
                            onChange={compose(dispatch,
                                              updateSelectedAddEffect,
                                              value => ({channelId, selectedAddEffect: value}),
                                              targetValue)}
                            options={map(value => ({text: capitalize.words(value),
                                                    value}), appEffects)} /></td>
            <td><Plus onClick={compose(dispatch,
                                       addChannelEffect,
                                       () => ({channelId,
                                               effect: selectedAddEffect}))} /></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>;
});

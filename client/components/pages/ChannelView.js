import capitalize from 'capitalize';
import {compose, identity} from 'ramda';
import React from 'react';
import {connect} from 'react-redux';
import {mapIndexed} from '../../tools/indexedIterators';
import Navigation from '../organisms/Navigation';
import Cross from '../atoms/icon-buttons/Cross';
import Down from '../atoms/icon-buttons/Down';
import Plus from '../atoms/icon-buttons/Plus';
import Up from '../atoms/icon-buttons/Up';
import {moveChannelSourceDown,
        moveChannelSourceUp,
        moveEffectSourceDown,
        moveEffectSourceUp,
        removeChannelSource,
        removeChannelEffect} from '../../actions';

export default connect(identity)(({channels, dispatch, params: {channelId}}) => {
  const {effects, sources} = channels[channelId];
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
            <td>drop down if options are available</td>
            <td><Plus onClick={() => console.log('add source')} /></td>
          </tr>
        </tbody>
      </table>
      <h2>Effects</h2>
      <table className="table-center">
        <tbody>
          {mapIndexed((effect, effectId) =>
            <tr key={effectId}>
              <td>{capitalize.words(effect)}</td>
              <td><Cross onClick={() => compose(dispatch, removeChannelEffect)({channelId, effectId})} /></td>
              <td>{effectId ? <Up onClick={() => compose(dispatch, moveEffectSourceUp)({channelId, effectId})} /> : ''}</td>
              <td>{effectId === effects.length - 1 ? '' : <Down onClick={() => compose(dispatch, moveEffectSourceDown)({channelId, effectId})} />}</td>
            </tr>, effects)}
          <tr key={effects.length}>
            <td>drop down if options are available</td>
            <td><Plus onClick={() => console.log('add effect')} /></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>;
});

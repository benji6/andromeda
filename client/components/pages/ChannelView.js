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
import {removeChannelSource,
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
            </tr>, sources)}
          <tr key={sources.length}>
            <td>Add Source</td>
            <td><Plus onClick={() => console.log('add')} /></td>
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
              <td><Up onClick={() => console.log('up', effectId)} /></td>
              <td><Down onClick={() => console.log('Down', effectId)} /></td>
            </tr>, effects)}
          <tr key={effects.length}>
            <td>Add Effect</td>
            <td><Plus onClick={() => console.log('add')} /></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>;
});

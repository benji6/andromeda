import React from 'react'; // eslint-disable-line
import {connect} from 'react-redux';
import {playNote, stopNote} from '../../noteController';
import store from '../../store';
import {updateActivePattern} from '../../actions';
import {forEachIndexed, mapIndexed} from '../../tools/indexedIterators';
import Pattern from '../organisms/Pattern';
import PlayButton from '../atoms/PlayButton';
import Navigation from '../organisms/Navigation';
import pitchFromScaleIndex from '../../tools/pitchFromScaleIndex';
import {compose, identity, filter, map, transduce} from 'ramda';

const playStopSubject = new Rx.Subject();

const stopAllNotes = forEachIndexed((row, rowIndex) =>
  forEachIndexed((cell, cellIndex) => stopNote({id: `pattern-editor-${rowIndex}${cellIndex}`}),
                 row));

const onPlay = dispatch =>
  Rx.Observable
    .generateWithRelativeTime(0,
                              () => true,
                              x => x + 1,
                              x => x,
                              () => 60000 / store.getState().bpm)
    .takeUntil(playStopSubject)
    .map(count => {
      const {patterns, scale} = store.getState();
      const pattern = patterns.patterns[patterns.activePattern];
      return {pattern, position: count % pattern.length, scale};
    })
    .do(({pattern, position}) =>
      dispatch(updateActivePattern(mapIndexed(row => mapIndexed((cell, y) => y === position ?
                                                            {...cell, active: true} :
                                                            {...cell, active: false},
                                                          row),
                                        pattern))))
    .do(compose(stopAllNotes, x => x.pattern))
    .subscribe(({pattern, position, scale}) =>
      transduce(compose(mapIndexed((row, rowIndex) => ({id: `pattern-editor-${rowIndex}${position}`,
                                                        pitch: pitchFromScaleIndex(scale.scales[scale.scaleName], pattern.length - 1 - rowIndex),
                                                        selected: row[position].selected})),
                                   filter(({selected}) => selected),
                                   map(playNote)),
                            () => {},
                            null,
                            pattern));

const onStop = dispatch => {
  const {patterns} = store.getState();
  const pattern = patterns.patterns[patterns.activePattern];
  stopAllNotes(pattern);
  playStopSubject.onNext();
  dispatch(updateActivePattern(mapIndexed(row => mapIndexed(cell => ({...cell, active: false}),
                                                      row),
                                    pattern)));
};

export default connect(identity)(({dispatch, patterns, rootNote, scale}) =>
  <div>
    <Navigation />
    <Pattern dispatch={dispatch}
             patterns={patterns}
             rootNote={rootNote}
             scale={scale} />
           <PlayButton onPlay={() => onPlay(dispatch)}
                onStop={() => onStop(dispatch)} />
  </div>);

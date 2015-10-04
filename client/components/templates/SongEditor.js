import React from 'react'; // eslint-disable-line
import {connect} from 'react-redux';
import {playNote, stopNote} from '../../noteController';
import store from '../../store';
import {updateSongNotes} from '../../actions';
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
      const {notes} = patterns.patterns[patterns.activePattern];
      return {notes, position: count % notes.length, scale};
    })
    .do(({notes, position}) =>
      dispatch(updateSongNotes(mapIndexed(row => mapIndexed((cell, y) => y === position ?
                                                            {...cell, active: true} :
                                                            {...cell, active: false},
                                                          row),
                                        notes))))
    .do(compose(stopAllNotes, x => x.notes))
    .subscribe(({notes, position, scale}) =>
      transduce(compose(mapIndexed((row, rowIndex) => ({id: `pattern-editor-${rowIndex}${position}`,
                                                        instrument: store.getState().patterns.patterns[store.getState().patterns.activePattern].instrument,
                                                        pitch: pitchFromScaleIndex(scale.scales[scale.scaleName], notes.length - 1 - rowIndex),
                                                        selected: row[position].selected})),
                                   filter(({selected}) => selected),
                                   map(playNote)),
                            () => {},
                            null,
                            notes));

const onStop = dispatch => {
  const {patterns} = store.getState();
  const {notes} = patterns.patterns[patterns.activePattern];
  stopAllNotes(notes);
  playStopSubject.onNext();
  dispatch(updateSongNotes(mapIndexed(row => mapIndexed(cell => ({...cell, active: false}),
                                                      row),
                                    notes)));
};

export default connect(identity)(({dispatch, song: {notes}, rootNote, scale}) => {
  const handleClick = (i, j) =>
    dispatch(updateSongNotes(mapIndexed((row, x) => mapIndexed((cell, y) => x === i && y === j ?
                                        {...cell, selected: !cell.selected} :
                                        cell,
                                                             row),
                                      notes)));
  return <div>
    <Navigation />
    <Pattern handleClick={handleClick}
             notes={notes}
             rootNote={rootNote}
             scale={scale}
             yLabel={i => i} />
    <PlayButton onPlay={() => onPlay(dispatch)}
                onStop={() => onStop(dispatch)} />
  </div>;
});

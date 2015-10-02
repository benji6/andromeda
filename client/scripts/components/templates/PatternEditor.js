import {compose, curry, identity, filter, map, transduce} from 'ramda';
import React from 'react'; // eslint-disable-line
import {connect} from 'react-redux';
import {playNote, stopNote} from '../../noteController';
import store from '../../store';
import {updateActivePatternNotes} from '../../actions';
import {forEachIndexed, mapIndexed} from '../../tools/indexedIterators';
import Pattern from '../organisms/Pattern';
import PlayButton from '../atoms/PlayButton';
import Navigation from '../organisms/Navigation';
import pitchFromScaleIndex from '../../tools/pitchFromScaleIndex';
import PatternOptions from '../organisms/PatternOptions';
import noteNameFromPitch from '../../tools/noteNameFromPitch';

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
      dispatch(updateActivePatternNotes(mapIndexed(row => mapIndexed((cell, y) => y === position ?
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
  dispatch(updateActivePatternNotes(mapIndexed(row => mapIndexed(cell => ({...cell, active: false}),
                                                      row),
                                    notes)));
};

const yLabel = curry((scale, length, rootNote, i) =>
  noteNameFromPitch(pitchFromScaleIndex(scale.scales[scale.scaleName],
                                        length - i - 1) + rootNote));

export default connect(identity)(({activePatternIndex, dispatch, instrument, patterns, rootNote, scale}) => {
  const activePattern = patterns[activePatternIndex];
  const {notes} = activePattern;
  const patternLength = 8;
  const handleClick = i => j => () =>
    dispatch(updateActivePatternNotes(mapIndexed((row, x) => mapIndexed((cell, y) => x === i && y === j ?
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
             xLength={8}
             yLength={8}
             yLabel={yLabel(scale, patternLength, rootNote)} />
    <PlayButton onPlay={() => onPlay(dispatch)}
                onStop={() => onStop(dispatch)} />
    <PatternOptions dispatch={dispatch}
                    instrument={instrument}
                    pattern={activePattern} />
  </div>;
});

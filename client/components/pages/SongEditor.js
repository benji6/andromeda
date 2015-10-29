import {compose, curry, filter, forEach, map,
  range, repeat, transduce} from 'ramda';
import React from 'react';
import {connect} from 'react-redux';
import {playNote, stopNote} from '../../noteController';
import store from '../../store';
import {activePatternCellClick,
        updateActivePatternActivePosition} from '../../actions';
import {mapIndexed} from '../../tools/indexedIterators';
import Pattern from '../organisms/Pattern';
import PlayButton from '../atoms/PlayButton';
import Navigation from '../organisms/Navigation';
import pitchFromScaleIndex from '../../tools/pitchFromScaleIndex';
import noteNameFromPitch from '../../tools/noteNameFromPitch';
import {noteExists} from '../../reducers/patterns';

const playStopSubject = new Rx.Subject();

const stopAllNotes = forEach(({x, y}) => stopNote({id: `pattern-editor-${x}-${y}`}));

const onPlay = dispatch =>
  Rx.Observable
    .generateWithRelativeTime(0,
                              () => true,
                              x => x + 1,
                              x => x,
                              () => 60000 / store.getState().bpm)
    .takeUntil(playStopSubject)
    .map(count => {
      const {activePatternIndex, patterns, scale} = store.getState();
      const {notes, patternLength} = patterns[activePatternIndex];
      return {notes, patternLength, position: count % patternLength, scale};
    })
    .do(({position}) => dispatch(updateActivePatternActivePosition(position)))
    .do(compose(stopAllNotes, ({notes}) => notes))
    .subscribe(({notes, patternLength, position, scale}) =>
      transduce(compose(filter(({y}) => y === position),
                        map(({x, y}) => ({id: `pattern-editor-${x}-${y}`,
                                          instrument: store.getState().patterns[store.getState().activePatternIndex].instrument,
                                          pitch: pitchFromScaleIndex(scale.scales[scale.scaleName], patternLength - 1 - x)})),
                        map(playNote)),
                () => {},
                null,
                notes));

const onStop = dispatch => {
  const {activePatternIndex, patterns} = store.getState();
  const {notes} = patterns[activePatternIndex];
  stopAllNotes(notes);
  playStopSubject.onNext();
  dispatch(updateActivePatternActivePosition(null));
};

const yLabel = curry((scale, length, rootNote, i) =>
  noteNameFromPitch(pitchFromScaleIndex(scale.scales[scale.scaleName],
                                        length - i + 7) + rootNote));

export default connect(x => x)(({dispatch, rootNote, scale, song}) => {
  const {activePosition, steps, xLength, yLength} = song;
  const emptyPatternData = map(range(0), repeat(xLength, yLength));
  const patternData = mapIndexed((x, i) => map(j => ({active: j === activePosition,
                                                      selected: noteExists(steps, i, j)}),
                                               x),
                                 emptyPatternData);
  const onClick = x => y => () => {
    stopNote({id: `pattern-editor-${x}-${y}`});
    dispatch(activePatternCellClick({x, y}));
  };
  return <div>
    <Navigation />
    <Pattern patternData={patternData}
             onClick={onClick}
             rootNote={rootNote}
             scale={scale}
             yLabel={yLabel(scale, length, rootNote)} />
    <PlayButton onPlay={() => onPlay(dispatch)}
                onStop={() => onStop(dispatch)} />
  </div>;
});

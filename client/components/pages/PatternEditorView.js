import {compose, curry, identity, filter, forEach, map,
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
import PatternMenu from '../organisms/PatternMenu';
import noteNameFromPitch from '../../tools/noteNameFromPitch';
import {noteExists} from '../../reducers/patterns';

const playStopSubject = new Rx.Subject;

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
      const {notes, octave, xLength, yLength} = patterns[activePatternIndex];
      return {notes, octave, yLength, position: count % xLength, scale};
    })
    .do(({position}) => dispatch(updateActivePatternActivePosition(position)))
    .do(compose(stopAllNotes, ({notes}) => notes))
    .subscribe(({notes, octave, yLength, position, scale}) =>
      transduce(compose(filter(({y}) => y === position),
                        map(({x, y}) => ({id: `pattern-editor-${x}-${y}`,
                                          instrument: store.getState().patterns[store.getState().activePatternIndex].instrument,
                                          pitch: pitchFromScaleIndex(scale.scales[scale.scaleName],
                                                                     yLength - 1 - x) + 12 * octave})),
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

const yLabel = curry((scale, yLength, rootNote, i) =>
  noteNameFromPitch(pitchFromScaleIndex(scale.scales[scale.scaleName],
                                        yLength - i - 1) + rootNote));

export default connect(identity)(({activePatternIndex, dispatch, instrument, patterns, rootNote, scale}) => {
  const activePattern = patterns[activePatternIndex];
  const {activePosition, notes, xLength, yLength} = activePattern;
  const emptyPatternData = map(range(0), repeat(xLength, yLength));
  const patternData = mapIndexed((x, i) => map(j => ({active: j === activePosition,
                                                      selected: noteExists(notes, i, j)}),
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
             yLabel={yLabel(scale, yLength, rootNote)} />
    <PlayButton onPlay={() => onPlay(dispatch)}
                onStop={() => onStop(dispatch)} />
    <PatternMenu dispatch={dispatch}
                 instrument={instrument}
                 pattern={activePattern} />
  </div>;
});

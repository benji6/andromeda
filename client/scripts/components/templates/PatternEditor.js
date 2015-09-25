import React from 'react'; // eslint-disable-line
import {connect} from 'react-redux';
import {playNote, stopNote} from '../../noteController';
import store from '../../store';
import {updatePattern} from '../../actions';
import {forEachIndexed, mapIndexed} from '../../tools/indexedIterators';
import Pattern from '../organisms/Pattern';
import PlayButton from '../atoms/PlayButton';
import Navigation from '../organisms/Navigation';
import pitchFromScaleIndex from '../../tools/pitchFromScaleIndex';
const {compose, identity, filter, map, transduce} = R;

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
      return {patterns, position: count % patterns.length, scale};
    })
    .do(({patterns, position}) =>
      dispatch(updatePattern(mapIndexed(row => mapIndexed((cell, y) => y === position ?
                                                            {...cell, active: true} :
                                                            {...cell, active: false},
                                                          row),
                                        patterns))))
    .do(compose(stopAllNotes, x => x.patterns))
    .subscribe(({patterns, position, scale}) =>
      transduce(compose(mapIndexed((row, rowIndex) => ({id: `pattern-editor-${rowIndex}${position}`,
                                                        pitch: pitchFromScaleIndex(scale.scales[scale.scaleName], patterns.length - 1 - rowIndex),
                                                        selected: row[position].selected})),
                                   filter(({selected}) => selected),
                                   map(playNote)),
                            () => {},
                            null,
                            patterns));

const onStop = dispatch => {
  const {patterns} = store.getState();
  stopAllNotes(patterns);
  playStopSubject.onNext();
  dispatch(updatePattern(mapIndexed(row => mapIndexed(cell => ({...cell, active: false}),
                                                      row),
                                    patterns)));
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

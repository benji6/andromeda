/* global R Rx*/
import React from 'react'; // eslint-disable-line
import {connect} from 'react-redux';
const {timer} = Rx.Observable;
import {playNote, stopNote} from '../../noteController';
import store from '../../store';
import {updatePattern} from '../../actions';
import {forEachIndexed, mapIndexed} from '../../tools/indexedIterators';
import Pattern from '../organisms/Pattern';
import PlayButton from '../atoms/PlayButton';
import Navigation from '../organisms/Navigation';
const {compose, identity, filter, map, transduce} = R;

const bpm = 140;
const timeInterval = 60000 / bpm;

const playStopSubject = new Rx.Subject();

const stopAllNotes = forEachIndexed((row, rowIndex) =>
  forEachIndexed((cell, cellIndex) => stopNote({id: `${rowIndex}${cellIndex}`}),
                 row));

const onPlay = dispatch =>
  timer(0, timeInterval)
    .takeUntil(playStopSubject)
    .map(count => {
      const {pattern} = store.getState();
      return {pattern, position: count % pattern.length};
    })
    .do(({pattern, position}) =>
      dispatch(updatePattern(mapIndexed(row => mapIndexed((cell, y) => y === position ?
                                                            {...cell, active: true} :
                                                            {...cell, active: false},
                                                          row),
                                        pattern))))
    .do(compose(stopAllNotes, x => x.pattern))
    .subscribe(({pattern, position}) =>
      transduce(compose(mapIndexed((row, rowIndex) => ({id: `${rowIndex}${position}`,
                                                        pitch: rowIndex,
                                                        selected: row[position].selected})),
                                   filter(({selected}) => selected),
                                   map(playNote)),
                            () => {},
                            null,
                            pattern));

const onStop = dispatch => {
  const {pattern} = store.getState();
  stopAllNotes(pattern);
  playStopSubject.onNext();
  dispatch(updatePattern(mapIndexed(row => mapIndexed(cell => ({...cell, active: false}),
                                                      row),
                                    pattern)));
};

export default connect(identity)(({dispatch, pattern}) =>
  <div>
    <Navigation />
    <Pattern dispatch={dispatch}
             pattern={pattern} />
    <PlayButton onPlay={() => onPlay(dispatch)}
                onStop={() => onStop(dispatch)} />
  </div>);

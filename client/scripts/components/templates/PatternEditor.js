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
import pitchFromScaleIndex from '../../tools/pitchFromScaleIndex';
const {compose, identity, filter, map, transduce} = R;

const playStopSubject = new Rx.Subject();

const stopAllNotes = forEachIndexed((row, rowIndex) =>
  forEachIndexed((cell, cellIndex) => stopNote({id: `pattern-editor-${rowIndex}${cellIndex}`}),
                 row));

const onPlay = (dispatch, bpm) =>
  timer(0, 60000 / bpm)
    .takeUntil(playStopSubject)
    .map(count => {
      const {pattern, scale} = store.getState();
      return {pattern, position: count % pattern.length, scale};
    })
    .do(({pattern, position}) =>
      dispatch(updatePattern(mapIndexed(row => mapIndexed((cell, y) => y === position ?
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
  const {pattern} = store.getState();
  stopAllNotes(pattern);
  playStopSubject.onNext();
  dispatch(updatePattern(mapIndexed(row => mapIndexed(cell => ({...cell, active: false}),
                                                      row),
                                    pattern)));
};

export default connect(identity)(({bpm, dispatch, pattern, rootNote, scale}) =>
  <div>
    <Navigation />
    <Pattern dispatch={dispatch}
             pattern={pattern}
             rootNote={rootNote}
             scale={scale} />
           <PlayButton onPlay={() => onPlay(dispatch, bpm)}
                onStop={() => onStop(dispatch)} />
  </div>);

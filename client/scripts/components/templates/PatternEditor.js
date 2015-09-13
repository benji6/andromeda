/* global R Rx*/
import React from 'react'; // eslint-disable-line
import {connect} from 'react-redux';
const {timer} = Rx.Observable;
import store from '../../store';
import {updatePattern} from '../../actions';
import mapIndexed from '../../tools/mapIndexed';
import Pattern from '../organisms/Pattern';
import PlayButton from '../atoms/PlayButton';
import Navigation from '../organisms/Navigation';
const {identity} = R;

const bpm = 140;
const timeInterval = 60000 / bpm;

const playStopSubject = new Rx.Subject();

const onPlay = dispatch =>
  timer(0, timeInterval)
    .takeUntil(playStopSubject)
    .subscribe(count => {
      const {pattern} = store.getState();
      dispatch(updatePattern(mapIndexed(row => mapIndexed((cell, y) => y === count % pattern.length ?
                                                            {...cell, active: true} :
                                                            {...cell, active: false},
                                                          row),
                                        pattern)));
                                      });

const onStop = dispatch => {
  playStopSubject.onNext();
  dispatch(updatePattern(mapIndexed(row => mapIndexed(cell => ({...cell, active: false}),
                                                      row),
                                    store.getState().pattern)));
};

export default connect(identity)(({dispatch, pattern}) =>
  <div>
    <Navigation />
    <Pattern dispatch={dispatch}
             pattern={pattern} />
    <PlayButton onPlay={() => onPlay(dispatch)}
                onStop={() => onStop(dispatch)} />
  </div>);

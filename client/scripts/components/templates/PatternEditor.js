/* global R Rx*/
import React from 'react'; // eslint-disable-line
import {connect} from 'react-redux';
const {timer} = Rx.Observable;
import store from '../../store';
import {updatePattern} from '../../actions';
import mapIndexed from '../../tools/mapIndexed';
import PlayButton from '../atoms/PlayButton';
import Navigation from '../organisms/Navigation';
const {identity} = R;

const handleOnClick = (dispatch, pattern, i, j) =>
  dispatch(updatePattern(mapIndexed((row, x) => mapIndexed((cell, y) => x === i && y === j ?
                                      {...cell, selected: !cell.selected} :
                                      cell,
                                                           row),
                                    pattern)));
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

const selectedClass = ({selected}) => selected === true ? 'selected' : '';
const activeClass = ({active}) => active === true ? 'active' : '';

export default connect(identity)(({dispatch, pattern}) =>
  <div>
    <Navigation />
    <div className="pattern-editor">
      {pattern.map((x, i) =>
        x.map((cell, j) =>
          <div className={`step ${selectedClass(cell)} ${activeClass(cell)}`}
               key={`${i}-${j}`}
               onClick={() => handleOnClick(dispatch, pattern, i, j)} />))}
    </div>
    <PlayButton onPlay={() => onPlay(dispatch)}
                onStop={() => onStop(dispatch)} />
  </div>);

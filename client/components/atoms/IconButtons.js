import React from 'react';

export const Cross = ({onClick}) => <button className="icon-button"
                                            onClick={onClick}>x</button>;

export const Down = ({onClick}) => <button className="icon-button"
                                           onClick={onClick}>&darr;</button>;

export const Plus = ({onClick}) => <button className="icon-button"
                                           onClick={onClick}>+</button>;

export const Up = ({onClick}) => <button className="icon-button"
                                         onClick={onClick}>&uarr;</button>;

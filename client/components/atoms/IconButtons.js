import React from 'react';

const createButton = text => ({onClick}) => <button className="icon-button"
                                                    onClick={onClick}>{text}</button>;

export const Cross = createButton('x');
export const Down = createButton('\u2193');
export const Plus = createButton('+');
export const Up = createButton('\u2191');

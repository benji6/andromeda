import React from 'react';

const createButton = text => ({...props}) => <button className="icon-button"
                                                    {...props}>{text}</button>;

export const Cross = createButton('x');
export const Down = createButton('\u2193');
export const Plus = createButton('+');
export const Up = createButton('\u2191');

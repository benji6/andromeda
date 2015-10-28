import React from 'react';
module.exports = ({checked,
                   disabled,
                   onChange}) => <input className="checkbox"
                                        defaultChecked={checked}
                                        disabled={disabled}
                                        onChange={onChange}
                                        type="checkbox" />;

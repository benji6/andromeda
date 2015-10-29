import React from 'react';
module.exports = ({checked,
                   disabled,
                   onChange}) => <input defaultChecked={checked}
                                        disabled={disabled}
                                        onChange={onChange}
                                        type="checkbox" />;

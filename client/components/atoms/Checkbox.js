import React from 'react'; // eslint-disable-line
module.exports = ({checked,
                   disabled,
                   onChange}) => <input defaultChecked={checked}
                                        disabled={disabled}
                                        onChange={onChange}
                                        type="checkbox" />;

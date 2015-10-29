import React from 'react';
import {Link} from 'react-router';
export default ({text, to}) => <Link className="hollow-button"
                                              to={to}>{text}</Link>;

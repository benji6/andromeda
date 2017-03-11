import {createElement, PropTypes} from 'react'

const StepVelocitySelector = ({color, onClick}) => createElement('button', {
  className: 'StepVelocitySelector',
  onClick,
  style: {
    backgroundColor: color,
  },
})

if (process.env.NODE_ENV !== 'production') {
  StepVelocitySelector.propTypes = {
    color: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }
}

export default StepVelocitySelector

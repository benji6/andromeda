import {createElement, PropTypes} from 'react'

const StepVelocitySelector = ({color, onClick}) => createElement('button', {
  className: 'StepVelocitySelector',
  onClick,
  style: {
    backgroundColor: color,
  },
})

StepVelocitySelector.propTypes = {
  color: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default StepVelocitySelector

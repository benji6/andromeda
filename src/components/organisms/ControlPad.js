import {clamp, isNil} from 'ramda'
import React, {PropTypes} from 'react'
import THREE from 'three'
import {randomMesh} from '../../utils/webGLHelpers'

const cameraZ = 16
const fallAwayVelocity = 1.2
const minZ = -160
const returnVelocity = 12

const sideLength = 1
const maxDepth = 3 * sideLength

let currentXYRatios = null
let controlPadElement = null
let renderLoopActive = null
let token = null
let renderer = null
let camera = null
let scene = null
let mouseInputEnabled = false
let controlPadActive = false

const setRendererSize = _ => {
  const rendererSize = window.innerWidth < window.innerHeight
    ? window.innerWidth
    : window.innerHeight * 0.8
  renderer.setSize(rendererSize, rendererSize)
}

const renderLoop = _ => {
  if (!renderLoopActive) return
  window.requestAnimationFrame(renderLoop)
  const controlPadHasNotBeenUsed = isNil(currentXYRatios)
  const {z} = token.position
  if (controlPadHasNotBeenUsed) return
  if (!controlPadActive) {
    if (z > minZ - maxDepth) token.position.z -= fallAwayVelocity
    renderer.render(scene, camera)
    return
  }
  const {xRatio, yRatio} = currentXYRatios
  const xMod = xRatio < 0.5
    ? -(xRatio - 0.5) ** 2
    : (xRatio - 0.5) ** 2
  const yMod = yRatio < 0.5
    ? -(yRatio - 0.5) ** 2
    : (yRatio - 0.5) ** 2
  const rotationBaseAmount = 0.01
  const rotationVelocityComponent = 0.8
  token.rotation.x += rotationBaseAmount + rotationVelocityComponent * xMod
  token.rotation.y += rotationBaseAmount + rotationVelocityComponent * yMod
  token.rotation.z += rotationBaseAmount + rotationVelocityComponent * xMod * yMod
  token.position.x = (xRatio - 0.5) * cameraZ
  token.position.y = (0.5 - yRatio) * cameraZ
  if (z < 0) token.position.z += z > -returnVelocity ? -z : returnVelocity
  renderer.render(scene, camera)
}

const validRatio = clamp(0, 1 - Number.EPSILON)

const calculateXAndYRatio = e => {
  const {top, right, bottom, left} = e.target.getBoundingClientRect()
  const [width, height] = [right - left, bottom - top]
  const {clientX, clientY} = e.changedTouches && e.changedTouches[0] || e
  const [x, y] = [clientX - left, clientY - top]
  return {xRatio: validRatio(x / width), yRatio: validRatio(y / height)}
}

export default class extends React.Component {
  static propTypes = {
    inputEndHandler: PropTypes.func,
    inputHandler: PropTypes.func
  };
  componentDidMount () {
    const {inputEndHandler, inputHandler} = this.props
    controlPadElement = document.querySelector('.control-pad')

    const inputCallback = e => {
      mouseInputEnabled = e.type === 'mousedown' ? true : mouseInputEnabled
      if (e instanceof window.MouseEvent && !mouseInputEnabled) return
      controlPadActive = true
      currentXYRatios = calculateXAndYRatio(e)
      inputHandler(currentXYRatios)
    }

    controlPadElement.addEventListener('touchstart', inputCallback)
    controlPadElement.addEventListener('touchmove', inputCallback)
    controlPadElement.addEventListener('mousedown', inputCallback)
    controlPadElement.addEventListener('mousemove', inputCallback)

    const inputEndCallback = e => {
      controlPadActive = false
      mouseInputEnabled = false
      currentXYRatios = calculateXAndYRatio(e)
      inputEndHandler(currentXYRatios)
    }

    controlPadElement.addEventListener('touchend', inputEndCallback)
    controlPadElement.addEventListener('mouseup', inputEndCallback)

    renderLoopActive = true
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(
      54,
      1,
      cameraZ - maxDepth,
      cameraZ - minZ
    )
    renderer = new THREE.WebGLRenderer({alpha: true, canvas: controlPadElement})
    const directionalLight = new THREE.DirectionalLight(0xffffff)
    token = randomMesh()
    token.position.z = minZ - maxDepth

    directionalLight.position.set(16, 16, 24).normalize()
    scene.add(new THREE.AmbientLight(0x333333))
      .add(directionalLight)
      .add(token)
    camera.position.z = cameraZ

    setRendererSize()
    window.onresize = setRendererSize

    controlPadElement.oncontextmenu = e => e.preventDefault()

    renderLoop()
  }

  componentWillUnmount () {
    renderLoopActive = false
    window.onresize = null
  }

  render () {
    return <canvas width='768' height='768' className='control-pad'></canvas>
  }
}

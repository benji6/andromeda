import {
  always,
  assoc,
  compose,
  concat,
  curry,
  identity,
  ifElse,
  isNil,
  map,
  reject,
  tap
} from 'ramda'
import {
  addAudioGraphSource,
  removeKeysFromAudioGraphContaining
} from '../../actions'
import React, {PropTypes} from 'react'
import {Observable} from 'rx'
import THREE from 'three'
import store, {dispatch} from '../../store'
import pitchToFrequency from '../../audioHelpers/pitchToFrequency'
import {startLoop, stopLoop} from '../../audioHelpers/loop'
import audioContext from '../../audioContext'
import {lazyMapIndexed} from '../../helpers'
const {fromEvent, merge} = Observable
const controlPadId = 'controlPad'
let currentlyPlayingPitch = null
let stopLastNoteOnNoteChange = true

const cameraZ = 16
const minZ = -128
const sideLength = 1
const maxDepth = 3 * sideLength

const validRatio = x => x < 0
  ? 0
  : x >= 1
    ? 1 - Number.EPSILON
    : x

const calculateXAndYRatio = e => {
  const {top, right, bottom, left} = e.target.getBoundingClientRect()
  const [width, height] = [right - left, bottom - top]
  const {clientX, clientY} = e.changedTouches && e.changedTouches[0] || e
  const [x, y] = [clientX - left, clientY - top]
  return {xRatio: validRatio(x / width),
          yRatio: validRatio(y / height)}
}

let mouseInputEnabled = false
let currentXYRatios = null
let controlPadElement = null
let renderLoopActive = null
let cube = null
let renderer = null
let camera = null
let scene = null

const setRendererSize = () => {
  const rendererSize = window.innerWidth < window.innerHeight
    ? window.innerWidth
    : window.innerHeight * 0.8
  renderer.setSize(rendererSize, rendererSize)
}

const renderLoop = _ => {
  if (!renderLoopActive) return
  window.requestAnimationFrame(renderLoop)
  const controlPadHasNotBeenUsed = isNil(currentXYRatios)
  const {z} = cube.position
  if (controlPadHasNotBeenUsed) return
  if (currentlyPlayingPitch === null) {
    if (z > minZ - maxDepth) cube.position.z -= 1
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
  cube.rotation.x += rotationBaseAmount + rotationVelocityComponent * xMod
  cube.rotation.y += rotationBaseAmount + rotationVelocityComponent * yMod
  cube.rotation.z += rotationBaseAmount + rotationVelocityComponent * xMod * yMod
  cube.position.x = (xRatio - 0.5) * cameraZ
  cube.position.y = (0.5 - yRatio) * cameraZ
  const returnVelocity = 8
  if (z < 0) cube.position.z += z > -returnVelocity ? -z : returnVelocity
  renderer.render(scene, camera)
}

const calculatePitch = ratio => {
  const {scaleName, scales} = store.getState().scale
  const scale = scales[scaleName]
  const {length} = scale
  stopLastNoteOnNoteChange = true
  const i = Math.floor((length + 1) * ratio)
  return scale[(i % length + length) % length] + 12 * Math.floor(i / length)
}

const xYRatiosToNote = ({range, xRatio, yRatio}) => ({
  pitch: calculatePitch(range * xRatio),
  modulation: yRatio
})
const xYRatiosToNoScaleNote = ({range, xRatio, yRatio}) => ({
  pitch: 12 * range * xRatio,
  modulation: yRatio
})

const createLoopAudioGraphFragment = curry((
  {instrument, octave, rootNote},
  {id, pitch, modulation}
) => {
  const {
    arpeggiatorPatterns,
    bpm,
    scale: {scales, scaleName},
    controlPad: {selectedArpeggiatorPattern}
  } = store.getState()
  const scale = scales[scaleName]
  const arpeggiatedScale = map(a => scale[a], [0, 2, 4])
  const twoOctaveArpeggiatedScale = concat(
    arpeggiatedScale,
    map(x => x + 12, arpeggiatedScale)
  )
  const noteDuration = 60 / bpm / 4
  const {currentTime} = audioContext
  return lazyMapIndexed((x, i) => ({
    id: `${id}-${i}`,
    instrument,
    params: {
      gain: (1 - modulation) / 2,
      frequency: pitchToFrequency(pitch + x + 12 * octave + rootNote),
      startTime: currentTime + i * noteDuration,
      stopTime: currentTime + (i + 1) * noteDuration
    }
  }),
  (arpeggiatorPatterns[selectedArpeggiatorPattern](twoOctaveArpeggiatedScale)))
})

const createSource = curry((
  {instrument, octave, rootNote},
  {id, pitch, modulation}
) => ({
  id,
  instrument,
  params: {
    frequency: pitchToFrequency(pitch + 12 * octave + rootNote),
    gain: (1 - modulation) / 2
  }
}))

export default class extends React.Component {
  static propTypes = {
    arpeggiatorIsOn: PropTypes.bool,
    instrument: PropTypes.string,
    noScale: PropTypes.bool,
    octave: PropTypes.number,
    portamento: PropTypes.bool,
    range: PropTypes.number,
    rootNote: PropTypes.number,
    selectedArpeggiatorPattern: PropTypes.string
  }
  componentDidMount () {
    const {
      arpeggiatorIsOn,
      instrument,
      noScale,
      octave,
      portamento,
      range,
      rootNote
    } = this.props
    controlPadElement = document.querySelector('.control-pad')
    const input$ = merge(
      fromEvent(controlPadElement, 'touchstart'),
      fromEvent(controlPadElement, 'touchmove'),
      fromEvent(controlPadElement, 'mousedown'),
      fromEvent(controlPadElement, 'mousemove')
    )
    const endInput$ = merge(
      fromEvent(controlPadElement, 'touchend'),
      fromEvent(controlPadElement, 'mouseup')
    )

    const inputTransducer = compose(
      map(tap(e => mouseInputEnabled = e.type === 'mousedown'
        ? true
        : mouseInputEnabled)),
      reject(e => e instanceof window.MouseEvent && !mouseInputEnabled),
      map(e => currentXYRatios = calculateXAndYRatio(e)),
      map(assoc('range', range)),
      map(ifElse(_ => noScale, xYRatiosToNoScaleNote, xYRatiosToNote)),
      map(assoc('id', controlPadId)),
      map(tap(({pitch}) => !noScale && !portamento && (
        currentlyPlayingPitch !== pitch &&
        currentlyPlayingPitch !== null &&
        stopLastNoteOnNoteChange
      ) && dispatch(removeKeysFromAudioGraphContaining(controlPadId)))),
      map(tap(({pitch}) => currentlyPlayingPitch = pitch)),
      map(ifElse(
        always(arpeggiatorIsOn),
        compose(startLoop, createLoopAudioGraphFragment({
          instrument,
          octave,
          rootNote
        })),
        compose(dispatch, addAudioGraphSource, createSource({
          instrument,
          octave,
          rootNote
        }))
      ))
    )

    const endInputTransducer = compose(
      map(tap(() => mouseInputEnabled = false)),
      map(tap(() => currentlyPlayingPitch = null)),
      map(e => currentXYRatios = calculateXAndYRatio(e)),
      map(_ => dispatch(removeKeysFromAudioGraphContaining(controlPadId))),
      map(stopLoop),
    )

    input$.transduce(inputTransducer).subscribe(identity, ::console.error)
    endInput$.transduce(endInputTransducer).subscribe(identity, ::console.error)

    renderLoopActive = true
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(
      54,
      1,
      cameraZ - maxDepth,
      cameraZ - minZ
    )
    renderer = new THREE.WebGLRenderer({canvas: controlPadElement})
    const geometry = new THREE.BoxGeometry(sideLength, sideLength, sideLength)
    const material = new THREE.MeshLambertMaterial({color: 'rgb(20, 200, 255)'})
    const directionalLight = new THREE.DirectionalLight(0xffffff)
    cube = new THREE.Mesh(geometry, material)
    cube.position.z = minZ - maxDepth

    directionalLight.position.set(16, 16, 24).normalize()
    scene.add(new THREE.AmbientLight(0x333333))
      .add(directionalLight)
      .add(cube)
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

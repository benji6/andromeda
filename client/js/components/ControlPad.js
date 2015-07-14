/* global THREE */
import React from 'react';
import {handleControlPadInput, handleControlPadInputEnd} from '../handleControlPadSignals';

const {EPSILON} = Number;
const {pow} = Math;

const cameraZ = 16;

const validRatio = (x) => x < 0 ?
  0 :
  x >= 1 ?
    1 - EPSILON :
    x;

const calculateXAndYRatio = (e) => {
  const {top, right, bottom, left} = e.target.getBoundingClientRect();
  const clientXAndClientYObj = e.changedTouches && e.changedTouches[0] || e;
  const {clientX, clientY} = clientXAndClientYObj;
  const x = clientX - left;
  const y = clientY - top;
  const width = right - left;
  const height = bottom - top;

  return {
    xRatio: validRatio(x / width),
    yRatio: validRatio(y / height),
  };
};

let mouseInputEnabled = false;
let controlPadActive = false;
let currentXYRatios = null;
let controlPadElement = null;
let renderLoopActive = null;
let cube = null;
let renderer = null;
let camera = null;
let scene = null;

const setRendererSize = () => {
  const rendererSize = innerWidth < innerHeight ?
    innerWidth :
    innerHeight * 0.8;
  renderer.setSize(rendererSize, rendererSize);
};

const renderLoop = function renderLoop () {
  if (!renderLoopActive) return;
  requestAnimationFrame(() => renderLoop());
  if (!controlPadActive) {
    cube.position.x = 64;
  } else {
    const {xRatio, yRatio} = currentXYRatios;
    const xMod = xRatio < 0.5 ?
     -pow(xRatio - 0.5, 2) :
     pow(xRatio - 0.5, 2);
    const yMod = yRatio < 0.5 ?
     -pow(yRatio - 0.5, 2) :
     pow(yRatio - 0.5, 2);
    const rotationBaseAmount = 0.01;
    const rotationVelocityComponent = 0.8;
    cube.rotation.x += rotationBaseAmount + rotationVelocityComponent * xMod;
    cube.rotation.y += rotationBaseAmount + rotationVelocityComponent * yMod;
    cube.rotation.z += rotationBaseAmount + rotationVelocityComponent * xMod * yMod;
    cube.position.x = (xRatio - 0.5) * cameraZ;
    cube.position.y = (0.5 - yRatio) * cameraZ;
  }
  renderer.render(scene, camera);
};

export default class ControlPad extends React.Component {
  componentDidMount () {
    controlPadElement = document.querySelector('.control-pad');
    const {width, height} = controlPadElement;
    const sideLength = 1;
    const maxDepth = pow(2 * pow(sideLength, 2), 0.5);
    renderLoopActive = true;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      54,
      1,
      cameraZ - maxDepth,
      cameraZ + maxDepth
    );
    renderer = new THREE.WebGLRenderer({canvas: controlPadElement});
    const geometry = new THREE.BoxGeometry(sideLength, sideLength, sideLength);
    const material = new THREE.MeshLambertMaterial({
      color: 'rgb(20, 200, 255)',
    });
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    cube = new THREE.Mesh(geometry, material);

    directionalLight.position.set(16, 16, 24).normalize();
    scene.add(new THREE.AmbientLight(0x333333));
    scene.add(directionalLight);
    scene.add(cube);
    camera.position.z = cameraZ;

    setRendererSize();
    window.onresize = setRendererSize;

    controlPadElement.oncontextmenu = (e) => e.preventDefault();

    renderLoop();
  }

  componentWillUnmount () {
    renderLoopActive = false;
    window.onresize = null;
  }

  handleInput (e) {
    mouseInputEnabled = e.type === 'mousedown' ? true : mouseInputEnabled;
    if (e.nativeEvent instanceof MouseEvent && !mouseInputEnabled) return;
    controlPadActive = true;
    currentXYRatios = calculateXAndYRatio(e);
    handleControlPadInput(currentXYRatios);
  }

  handleInputEnd (e) {
    mouseInputEnabled = false;
    controlPadActive = false;
    currentXYRatios = calculateXAndYRatio(e);
    handleControlPadInputEnd(currentXYRatios);
  }

  render () {
    return <div className="center">
      <canvas width="768" height="768" className="control-pad"
        onTouchStart={this.handleInput}
        onTouchMove={this.handleInput}
        onMouseDown={this.handleInput}
        onMouseMove={this.handleInput}
        onTouchEnd={this.handleInputEnd}
        onMouseUp={this.handleInputEnd}>
      </canvas>
    </div>;
  }
}

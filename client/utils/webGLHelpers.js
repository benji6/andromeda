import THREE from 'three'
import randomcolor from 'randomcolor'
import {randomElement} from './helpers'

const sideLength = 1
const randomMaterialParams = _ => ({color: randomcolor({luminosity: 'bright'})})

const geometries = [
  new THREE.BoxGeometry(sideLength, sideLength, sideLength),
  new THREE.DodecahedronGeometry(sideLength * 0.75),
  new THREE.CylinderGeometry(
    sideLength * 0.3, sideLength * 0.3, sideLength * 1.25, 16
  ),
  new THREE.IcosahedronGeometry(sideLength * 0.75),
  new THREE.OctahedronGeometry(sideLength * 0.8),
  new THREE.SphereGeometry(sideLength),
  new THREE.TetrahedronGeometry(sideLength),
  new THREE.TorusGeometry(sideLength * 0.67, sideLength * 0.25, 24, 16),
  new THREE.TorusKnotGeometry(sideLength * 0.5, sideLength * 0.2, 32, 24)
]

const materials = [
  new THREE.MeshLambertMaterial(randomMaterialParams()),
  new THREE.MeshPhongMaterial(randomMaterialParams())
]

const randomGeometry = _ => randomElement(geometries)
const randomMaterial = _ => randomElement(materials)

export const randomMesh = _ => new THREE.Mesh(randomGeometry(), randomMaterial())

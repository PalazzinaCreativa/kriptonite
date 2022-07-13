import * as THREE from 'three'
import { FLOOR_DEPTH } from '@/dataset/defaultConfiguratorValues'

export const setupCamera = ({ width, height }, domEl, room) => {
  const cameraSpecs = [
    { type: 'attic', depth: 450 }
  ]

  var depth = FLOOR_DEPTH
  depth = cameraSpecs.find((spec) => spec.type === room.type)?.depth || depth

  const camera = new THREE.PerspectiveCamera( 45, domEl.offsetWidth / domEl.offsetHeight, 6, 60000 )
  camera.position.set( width / 2, height / 2, depth )

  return camera
}
import * as THREE from 'three'
import { FLOOR_DEPTH } from '@/dataset/defaultConfiguratorValues'

export const setupCamera = ({ width, height }, domEl) => {
  const camera = new THREE.PerspectiveCamera( 45, domEl.offsetWidth / domEl.offsetHeight, 6, 60000 )
  camera.position.set( width / 2, height / 2, FLOOR_DEPTH  )
  return camera
}
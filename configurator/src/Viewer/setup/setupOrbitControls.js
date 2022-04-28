import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FLOOR_DEPTH } from '@/dataset/defaultConfiguratorValues';

export const setupOrbitControls = (camera, renderer, dimensions) => {
  const controls = new OrbitControls( camera, renderer.domElement)
  // Limite zoom
  controls.minDistance = 50
  controls.maxDistance = FLOOR_DEPTH

  // Limite di rotazione verticale
  controls.minPolarAngle = 0
  controls.maxPolarAngle = Math.PI / 2

  // Limite di rotazione orizzontale
  controls.minAzimuthAngle = -Math.PI / 2.1
  controls.maxAzimuthAngle = Math.PI / 2.1

  controls.target.set(dimensions.width / 2, dimensions.height / 2, 0)
  return controls
}
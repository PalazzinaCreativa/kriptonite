import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FLOOR_DEPTH } from '@/dataset/defaultConfiguratorValues';

export const setupOrbitControls = (camera, renderer, dimensions) => {
  const controls = new OrbitControls( camera, renderer.domElement)
  controls.minDistance = 10
  controls.maxDistance = FLOOR_DEPTH

  controls.minPolarAngle = 0
  controls.maxPolarAngle =  Math.PI * 0.5

  controls.target.set(dimensions.width / 2, dimensions.height / 2, 0)
  controls.maxPolarAngle = Math.PI / 2
  return controls
}
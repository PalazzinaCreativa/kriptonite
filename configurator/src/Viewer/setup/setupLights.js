import * as THREE from 'three'
import { FLOOR_DEPTH } from '@/dataset/defaultConfiguratorValues'

export const setupLights = ({ width, height }) => {
  const ambientLight = new THREE.AmbientLight( 0xffffff, 1 )

  const spotLight = new THREE.SpotLight( 0xffffff, 0.4, 0, Math.PI / 2 )
  spotLight.position.set( width / 2, height, FLOOR_DEPTH )
  spotLight.castShadow = true
  spotLight.target.position.set(width / 2, height / 2, 0)
  spotLight.shadow.mapSize.width = 1024
  spotLight.shadow.mapSize.height = 1024
  spotLight.shadow.camera.near = 0.5
  spotLight.shadow.camera.far = 500
  spotLight.shadow.focus = 10
  spotLight.shadow.bias = 0.0001

  // const helper = new THREE.SpotLightHelper(spotLight)

  return [
    ambientLight,
    spotLight,
    // helper
  ]
}
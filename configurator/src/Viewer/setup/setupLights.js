import * as THREE from 'three'
import { FLOOR_DEPTH } from '@/dataset/defaultConfiguratorValues'

export const setupLights = ({ width, height }) => {
  const ambientLight = new THREE.AmbientLight( 0xffffff, 0.6 )

  // const spotLight = new THREE.SpotLight( 0xffffff, 0.8, 0, Math.PI / 2 )
  // spotLight.position.set( width / 2, height, FLOOR_DEPTH )
  // spotLight.castShadow = true
  // spotLight.target.position.set(width / 2, height / 2, 0)
  // spotLight.shadow.mapSize.width = 1024
  // spotLight.shadow.mapSize.height = 1024
  // spotLight.shadow.camera.near = 0.5
  // spotLight.shadow.camera.far = 500
  // spotLight.shadow.focus = 10
  // spotLight.shadow.bias = 0.0001

  // const spotLight2 = new THREE.SpotLight( 0xffffff, 0.2, 0, Math.PI / 2 )
  // spotLight2.position.set(width / 6, height / 2, FLOOR_DEPTH )
  // spotLight2.castShadow = true
  // spotLight2.target.position.set(width / 6, height / 2, 0)
  // spotLight2.shadow.mapSize.width = 1024
  // spotLight2.shadow.mapSize.height = 1024
  // spotLight2.shadow.camera.near = 0.5
  // spotLight2.shadow.camera.far = 500
  // spotLight2.shadow.focus = 10
  // spotLight2.shadow.bias = 0.0001

  // const spotLight3 = new THREE.SpotLight( 0xffffff, 0.2, 0, Math.PI / 2 )
  // spotLight3.position.set( width / 6 * 5, height / 2, FLOOR_DEPTH )
  // spotLight3.castShadow = true
  // spotLight3.target.position.set(width / 6 * 5, height / 2, 0)
  // spotLight3.shadow.mapSize.width = 1024
  // spotLight3.shadow.mapSize.height = 1024
  // spotLight3.shadow.camera.near = 0.5
  // spotLight3.shadow.camera.far = 500
  // spotLight3.shadow.focus = 10
  // spotLight3.shadow.bias = 0.0001

  // const helper2 = new THREE.SpotLightHelper(spotLight2)
  // const helper3 = new THREE.SpotLightHelper(spotLight3)

  const pointLight = new THREE.PointLight(0xffffff, 0.75, 0, 1)

  pointLight.position.set(width / 2, height - 5, FLOOR_DEPTH / 2)

  const rectAreaLight = new THREE.RectAreaLight(0xffffff, 0.4, width, FLOOR_DEPTH)
  rectAreaLight.position.set(width / 2, height - 0.1, FLOOR_DEPTH / 2)
  rectAreaLight.lookAt(width / 2, height, FLOOR_DEPTH / 2)
  return [
    ambientLight,
    // spotLight,
    // spotLight2,
    // spotLight3,
    // helper2,
    // helper3
    pointLight,
    rectAreaLight
  ]
}
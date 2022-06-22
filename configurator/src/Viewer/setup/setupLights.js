import * as THREE from 'three'
import { FLOOR_DEPTH } from '@/dataset/defaultConfiguratorValues'

export const setupLights = ({ width, height }) => {
  const ambientLight = new THREE.AmbientLight( 0xffffff, 0.6 )

  const spotLight = new THREE.SpotLight( 0xffffff, 0.7, 0, Math.PI / 2 )
  spotLight.position.set(width / 2, 5, FLOOR_DEPTH)
  spotLight.target.position.set(width / 2, 5, 0)
  spotLight.castShadow = true
  spotLight.shadow.mapSize.width = 1024
  spotLight.shadow.mapSize.height = 1024
  spotLight.shadow.camera.near = 0.5
  spotLight.shadow.camera.far = 500
  spotLight.shadow.focus = 10
  spotLight.shadow.bias = 0.0001

  const spotLight2 = new THREE.SpotLight( 0xffffff, 0.05, 0, Math.PI / 2 )
  spotLight2.position.set(width / 6, height / 2, FLOOR_DEPTH )
  spotLight2.target.position.set(width / 6, height / 2, 0)
  spotLight2.castShadow = true
  spotLight2.shadow.mapSize.width = 1024
  spotLight2.shadow.mapSize.height = 1024
  spotLight2.shadow.camera.near = 0.5
  spotLight2.shadow.camera.far = 500
  spotLight2.shadow.focus = 10
  spotLight2.shadow.bias = 0.0001

  const spotLight3 = new THREE.SpotLight( 0xffffff, 0.05, 0, Math.PI / 2 )
  spotLight3.position.set( width / 6 * 5, height / 2, FLOOR_DEPTH )
  spotLight3.castShadow = true
  spotLight3.target.position.set(width / 6 * 5, height / 2, 0)
  spotLight3.shadow.mapSize.width = 1024
  spotLight3.shadow.mapSize.height = 1024
  spotLight3.shadow.camera.near = 0.5
  spotLight3.shadow.camera.far = 500
  spotLight3.shadow.focus = 10
  spotLight3.shadow.bias = 0.0001

  const spotLight4 = new THREE.SpotLight( 0xffffff, 0.5, 0, Math.PI / 2 )
  spotLight4.position.set(width / 2, 0, FLOOR_DEPTH / 2.5)
  spotLight4.target.position.set(width / 2, height / 2, 0)
  spotLight4.castShadow = true
  spotLight4.shadow.mapSize.width = 1024
  spotLight4.shadow.mapSize.height = 1024
  spotLight4.shadow.camera.near = 0.5
  spotLight4.shadow.camera.far = 500
  spotLight4.shadow.focus = 10
  spotLight4.shadow.bias = 0.0001

  const helper = new THREE.SpotLightHelper(spotLight, 0xff0000)
  const helper2 = new THREE.SpotLightHelper(spotLight2, 0xff0000)
  const helper3 = new THREE.SpotLightHelper(spotLight3, 0xff0000)
  const helper4 = new THREE.SpotLightHelper(spotLight4, 0x0000ff)

  const pointLight = new THREE.PointLight(0xffffff, 0.75, 0, 1)

  pointLight.position.set(width / 2, height - 5, FLOOR_DEPTH / 2)

  const rectAreaLight = new THREE.RectAreaLight(0xffffff, 0.4, width, FLOOR_DEPTH)
  rectAreaLight.position.set(width / 2, height - 0.1, FLOOR_DEPTH / 2)
  rectAreaLight.lookAt(width / 2, height, FLOOR_DEPTH / 2)
  return {
    classic: [ambientLight, /*spotLight*/, spotLight2, spotLight3, /*helper2*/, /*helper3*/, pointLight, rectAreaLight ],
    attic: [ambientLight, /*spotLight*/, spotLight2, spotLight3, spotLight4, /*helper*/, /*helper2*/, /*helper3*/, pointLight, rectAreaLight ]
  }
}
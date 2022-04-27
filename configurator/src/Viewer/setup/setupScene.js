import * as THREE from 'three'

export const setupScene = () => {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color( 0xf0f0f0 )
  return scene
}
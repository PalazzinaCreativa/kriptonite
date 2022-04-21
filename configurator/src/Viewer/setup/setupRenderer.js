import * as THREE from 'three'

export const setupRenderer = (domEl) => {
  const renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.setSize( domEl.offsetWidth, domEl.offsetHeight )
  renderer.shadowMap.enabled = true
  renderer.shadowMapSoft = true
  renderer.shadowMap.type = THREE.PCFShadowMap

  return renderer
}
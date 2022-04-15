import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'

export const setupPostProcessing = (scene, camera, renderer) => {
  const width = renderer.domElement.offsetWidth
  const height = renderer.domElement.offsetHeight

  const composer = new EffectComposer(renderer)
  const renderPass = new RenderPass(scene, camera)

  composer.addPass(renderPass)

  const outlinePass = new OutlinePass(new THREE.Vector2( width, height ), scene, camera)
  outlinePass.visibleEdgeColor.set(0xe01010)
  outlinePass.hiddenEdgeColor.set(0xf0b6b6)
  outlinePass.edgeStrength = Number(6)
  outlinePass.edgeGrow = Number(0.2)
  outlinePass.edgeThickness = Number(2)
  outlinePass.renderToScreen = true
  outlinePass.overlayMaterial.blending = THREE.NormalBlending
  outlinePass.overlayMaterial.transparent = true
  outlinePass.overlayMaterial.opacity = 0.6

  composer.addPass(outlinePass)

  camera.aspect = width / height
  camera.updateProjectionMatrix()

  return {
    composer,
    outlinePass
  }
}
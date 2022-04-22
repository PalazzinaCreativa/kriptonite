import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'

export const setupPostprocessing = (scene, camera, renderer) => {
  const width = renderer.domElement.offsetWidth
  const height = renderer.domElement.offsetHeight

  const composer = new EffectComposer(renderer)
  const renderPass = new RenderPass(scene, camera)

  composer.addPass(renderPass)

  const errorOutlinePass = new OutlinePass(new THREE.Vector2( width, height ), scene, camera)
  const hoverOutlinePass = new OutlinePass(new THREE.Vector2( width, height ), scene, camera)
  const selectOutlinePass = new OutlinePass(new THREE.Vector2( width, height ), scene, camera)

  errorOutlinePass.visibleEdgeColor.set(0xfa4c4c)
  errorOutlinePass.hiddenEdgeColor.set(0xf0b6b6)
  errorOutlinePass.edgeStrength = Number(2)
  errorOutlinePass.edgeGrow = Number(1)
  errorOutlinePass.edgeThickness = Number(0.2)
  errorOutlinePass.renderToScreen = true
  errorOutlinePass.overlayMaterial.blending = THREE.NormalBlending
  composer.addPass(errorOutlinePass)

  hoverOutlinePass.visibleEdgeColor.set(0xededed)
  hoverOutlinePass.hiddenEdgeColor.set(0xf0b6b6)
  hoverOutlinePass.edgeStrength = Number(2)
  hoverOutlinePass.edgeGrow = Number(1)
  hoverOutlinePass.edgeThickness = Number(0.2)
  hoverOutlinePass.renderToScreen = true
  hoverOutlinePass.overlayMaterial.blending = THREE.NormalBlending
  composer.addPass(hoverOutlinePass)

  selectOutlinePass.visibleEdgeColor.set(0xffcc67)
  selectOutlinePass.hiddenEdgeColor.set(0xf0b6b6)
  selectOutlinePass.edgeStrength = Number(2)
  selectOutlinePass.edgeGrow = Number(1)
  selectOutlinePass.edgeThickness = Number(0.2)
  selectOutlinePass.renderToScreen = true
  selectOutlinePass.overlayMaterial.blending = THREE.NormalBlending
  composer.addPass(selectOutlinePass)

  camera.aspect = width / height
  camera.updateProjectionMatrix()

  return {
    composer,
    outlinePass: {
      error: errorOutlinePass,
      hover: hoverOutlinePass,
      select: selectOutlinePass
    }
  }
}
import { FLOOR_DEPTH, NICHE_PADDING } from "@/dataset/defaultConfiguratorValues";
import { addTexture } from "../utils/addTexture";
import * as THREE from 'three'

export const setupFloor = async ({ width, roomType, type}) => {
  const floorMaterial = new THREE.MeshStandardMaterial( {
    roughness: 0.95
  })

  const normalizeWidth = roomType === 'niche' // Se è una nicchia bisogna calcolare la dimensione del pavimento
    ? width + NICHE_PADDING * 2
    : width

  const floorGeometry = new THREE.PlaneGeometry(normalizeWidth, FLOOR_DEPTH)
  const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial)

  floorMesh.receiveShadow = true
  floorMesh.rotation.x = - Math.PI / 2

  const xPosition = roomType === 'niche' // Posizionamento più a sinistra se è una nicchia
    ? normalizeWidth / 2 - NICHE_PADDING
    : normalizeWidth / 2

  floorMesh.position.set(xPosition, 1, FLOOR_DEPTH / 2)
  floorMesh.name = 'floor'

  return floorMesh
}
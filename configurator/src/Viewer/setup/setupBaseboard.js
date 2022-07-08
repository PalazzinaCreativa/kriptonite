import * as THREE from 'three'
import { FLOOR_DEPTH } from "@/dataset/defaultConfiguratorValues"
import { NICHE_PADDING } from '../../dataset/defaultConfiguratorValues'

export const setupBaseboard = async ({ type, dimensions }, { width }) => {
  const baseboard = new THREE.Group()

  // Creazione del battiscopa: una mesh per ogni lato della stanza
  const baseboardWidth = 1.5
  const baseboardHeight = 10
  const nicheDepth = type === 'niche' ? dimensions.depth : 0
  const roomWidth = type === 'niche' ? width + (NICHE_PADDING) : width
  const startingXPoint = type === 'niche' ? -NICHE_PADDING + baseboardWidth : 0

  Array.from({ length: 4 }, (_, i) => i + 1).forEach(f => {
    const face = new THREE.Mesh(
      new THREE.BoxGeometry(f % 2 === 0 ? roomWidth : FLOOR_DEPTH, baseboardHeight, baseboardWidth),
      new THREE.MeshStandardMaterial({ color: 0xbababa, name: 'baseboard' })
    )

    face.position.set(
      f % 2 === 0 ? roomWidth / 2 : f === 1 ? startingXPoint : roomWidth,
      0.75,
      f % 2 === 0 ? FLOOR_DEPTH / 2 : f === 2 ? 0 : FLOOR_DEPTH,
    )

    if (f % 2 !== 0) face.rotation.y = Math.PI / 2

    face.name = 'baseboard'

    baseboard.add(face)
  })

  // Se la stanza ha una nicchia vengono aggiunti 4 battiscopa in più agli angoli
  if(type === 'niche') {
    Array.from({ length: 4 }, (_, i) => i + 1).forEach(f => {
      const nicheFace = new THREE.Mesh(
        new THREE.BoxGeometry(f % 2 === 0 ? NICHE_PADDING : nicheDepth, baseboardHeight, baseboardWidth),
        new THREE.MeshStandardMaterial({ color: 0xbababa, name: 'baseboard' })
      )
  
      nicheFace.position.set(
        f === 1 ? 0 : f === 2 ? -NICHE_PADDING / 2 : f === 3 ? width : f === 4 ? roomWidth - (NICHE_PADDING / 2) : 0,
        0.75,
        f % 2 !== 0 ? FLOOR_DEPTH / 2 + NICHE_PADDING / 2 : FLOOR_DEPTH / 2 + nicheDepth
      )

      if (f % 2 !== 0) nicheFace.rotation.y = Math.PI / 2

      nicheFace.name = 'baseboard'
      
      baseboard.add(nicheFace)
    })
  }

  baseboard.position.set(0, 0, -FLOOR_DEPTH / 2)
  return baseboard
}

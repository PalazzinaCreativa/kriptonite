import * as THREE from 'three'
import { FLOOR_DEPTH } from "@/dataset/defaultConfiguratorValues"

export const setupBaseboard = async ({ width }) => {
  const baseboard = new THREE.Group()

  // Creo una mesh per ogni lato della stanza
  Array.from({length: 4}, (_, i) => i + 1)
    .forEach(f => {
      const face = new THREE.Mesh(
        new THREE.BoxGeometry(f % 2 === 0 ? width : FLOOR_DEPTH, 10, 1.5),
        new THREE.MeshStandardMaterial({ color: 0xbababa  })
      )

      face.position.set(
        f % 2 === 0 ? width / 2 : f === 1 ? 0 : width,
        0.75,
        f % 2 === 0 ? FLOOR_DEPTH / 2 : f === 2 ? 0 : FLOOR_DEPTH,
      )

      if (f % 2 !== 0) face.rotation.y = Math.PI / 2

      baseboard.add(face)
    })

  baseboard.position.set(0, 0, -FLOOR_DEPTH / 2)
  return baseboard
}

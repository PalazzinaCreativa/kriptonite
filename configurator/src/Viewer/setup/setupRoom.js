import { addTexture } from "../utils/addTexture"
import * as THREE from 'three'
import { FLOOR_DEPTH, NICHE_PADDING } from "@/dataset/defaultConfiguratorValues"
import { CSG } from 'three-csg-ts'

export const setupRoom = async ({ type, dimensions, color }) => {
  const wallMaterial = new THREE.MeshStandardMaterial({
    roughness: 1,
    color,
    metalness: 0,
    side: THREE.BackSide // Per mostrare il materiale nella parte interna della geometria
  })

  /* await addTexture(wallMaterial,
    {
      name: 'plaster',
      isStatic: true,
      repeat: 16,
      maps: ['map', 'aoMap', 'bumpMap', 'alphaMap', 'normalMap', 'metalnessMap']
    }
  ) */

  wallMaterial.receiveShadow = true
  wallMaterial.toneMapped = false
  wallMaterial.envMapIntensity = 0 // Non riflette un eventuale hdri

  return createMesh(type, dimensions, wallMaterial)
}

const createMesh = (type, {width, height, leftHeight, rightHeight, depth }, material) => {
  let room, config

  if (type === 'classic') {
    room = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, FLOOR_DEPTH),
      material
    )

    room.position.set(width / 2, height / 2, FLOOR_DEPTH / 2)
  }

  if (type === 'attic') {
    // Geometria di partenza
    const main = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, FLOOR_DEPTH)
    )

    // Geometria da sottrarre
    const subtractMesh = new THREE.Mesh(
      new THREE.BoxGeometry(width * 2, height, FLOOR_DEPTH)
    )

    // Calcolo dell'angolo che avrà la mansarda
    const atticAngle = Math.atan((height - Math.min(leftHeight, rightHeight)) / width)

    // Posiziono gli elementi per la sottrazione
    main.position.set(width / 2, height / 2, FLOOR_DEPTH / 2)

    subtractMesh.rotation.z = leftHeight > rightHeight
      ? Math.PI * 2 - atticAngle
      : Math.PI * 2 + atticAngle

    subtractMesh.position.set(
      width / 2,
      height / 2 + (height - (width / 2 * (Math.tan(atticAngle)))),
      FLOOR_DEPTH / 2
    )

    main.updateMatrix()
    subtractMesh.updateMatrix()

    room = new THREE.Mesh(
      CSG.subtract(main, subtractMesh).geometry,
      material
    )

    room.position.set(width / 2, height / 2, FLOOR_DEPTH / 2)

    config = { atticAngle }
  }

  if (type === 'niche') {
    // Cubo principale. Le dimensioni sono calcolate aggiungendo un padding alle dimensioni della nicchia
    const main = new THREE.Mesh(
      new THREE.BoxGeometry(width + NICHE_PADDING * 2, height + NICHE_PADDING, FLOOR_DEPTH - depth)
    )

    // Nicchia
    const niche = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth)
    )

    // Posizionamento della nicchia adiacente al cubo
    niche.position.set(0, - NICHE_PADDING / 2, -FLOOR_DEPTH / 2)

    main.updateMatrix()
    niche.updateMatrix()

    room = new THREE.Mesh(
      CSG.union(main, niche).geometry,
      material
    )

    room.position.set(((width + NICHE_PADDING * 2) / 2) - NICHE_PADDING, (height + NICHE_PADDING) / 2, FLOOR_DEPTH / 2 + depth / 2)

  }

  room.name = 'room'

  return {
    room,
    config
  }
}

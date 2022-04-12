import { addTexture } from "../utils/addTexture"
import * as THREE from 'three'
import { FLOOR_DEPTH, NICHE_PADDING } from "@/dataset/defaultConfiguratorValues"
import { CSG } from 'three-csg-ts'

export const setupRoom = async (type, dimensions) => {
  const wallMaterial = new THREE.MeshStandardMaterial({
    roughness: 1,
    color: 0xffffff,
    metalness: 0,
    side: THREE.BackSide // Per mostrare il materiale nella parte interna della geometria
  })

  await addTexture(wallMaterial,
    {
      name: 'plaster',
      repeat: 16,
      maps: ['map', 'aoMap', 'bumpMap', 'roughnessMap', 'alphaMap', 'metalnessMap', 'normalMap']
    }
  )

  wallMaterial.receiveShadow = true
  wallMaterial.toneMapped = false
  wallMaterial.envMapIntensity = 0 // Non riflette un eventuale hdri

  const roomGeometry = geometries[type](dimensions) // Crea una geometria diversa in base alla tipologia di stanza
  const room = new THREE.Mesh(roomGeometry, wallMaterial)

  setup[type](room, dimensions) // Posiziona la mesh creata nella stanza in base alla tipologia

  room.name = 'room'
  return room
}

// Creazione geometrie per tipo di stanza
const geometries = {
  classic: ({ width, height}) => {
    return new THREE.BoxGeometry(width, height, FLOOR_DEPTH)
  },
  attic: ({ width, height, leftHeight, rightHeight}) => {
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

    return CSG.subtract(main, subtractMesh).geometry // Metodo di Three CSG per la sottrazione di Mesh. Doc -> https://github.com/Jiro-Digital/three-csg-ts
  },
  niche: ({ width, height, depth }) => { // Per creare questa stanza viene eseguita l'unione di due forme
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
    return CSG.union(main, niche).geometry // Metodo di Three CSG per l'unione di Mesh. Doc -> https://github.com/Jiro-Digital/three-csg-ts
  }
}

const setup = {
  classic: (mesh, { width, height }) => {
    mesh.position.set(width / 2, height / 2, FLOOR_DEPTH / 2)
  },
  attic: (mesh, { width, height }) => {
    mesh.position.set(width / 2, height / 2, FLOOR_DEPTH / 2)
  },
  niche: (mesh, { width, height, depth }) => {
    // mesh.rotation.y = Math.PI / 2
    mesh.position.set(((width + NICHE_PADDING * 2) / 2) - NICHE_PADDING, (height + NICHE_PADDING) / 2, FLOOR_DEPTH / 2 + depth / 2) // Calcolo posizionamento per avere la nicchia nel punto 0, 0, 0
  },
}
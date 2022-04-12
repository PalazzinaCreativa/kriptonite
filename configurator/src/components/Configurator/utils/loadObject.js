import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Funzione che riceve un percorso di partenza e torna un modello in formato gltf da includere nella scena
export const loadObject = (path, id) => {
  const loader = new GLTFLoader()

  return new Promise((resolve, reject) => {
    loader.load(
      path,
      (gltf) => {
        const obj = new THREE.Object3D
        obj.add(gltf.scene)
        obj.traverse(child => child.name = id)
        resolve(obj)
      },
      undefined,
      (error) => {
        reject(error)
      }
    )
  })
}
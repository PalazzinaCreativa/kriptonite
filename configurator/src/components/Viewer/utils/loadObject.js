import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

// Funzione che riceve un percorso di partenza e torna un modello in formato gltf da includere nella scena
export const loadObject = (path, id) => {
  let loader

  const extension = path.split('.').pop()
  if (extension === 'gltf') {
    loader = new GLTFLoader()
  } else if (extension === 'obj') {
    loader = new OBJLoader()
  }

  if (!loader) return

  return new Promise((resolve, reject) => {
    loader.load(
      path,
      (model) => {
        let obj
        if (extension === 'gltf') {
          obj = new THREE.Object3D
          obj.add(model.scene)
        } else {
          obj = model
        }
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
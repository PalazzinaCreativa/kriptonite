import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export const createText = (string, params) => {
  return new Promise((resolve) => {
    const loader = new FontLoader()
    const textToWrite = string
    const textParams = params
    loader.load('/assets/fonts/helvetiker_regular.typeface.json', (font) => {
      let params = { ...textParams, font }
      console.log(params)
      const text = new TextGeometry(textToWrite, params)
      resolve(text)
    })
  })
}
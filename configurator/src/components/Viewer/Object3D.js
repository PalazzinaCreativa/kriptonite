import * as THREE from 'three'
import { loadObject } from "./utils/loadObject"

const fixedY = { // Mostra gli elementi che hanno una posizione y fissa (es: Divano sta sempre a terra)
  sofa: 0
}

export default class Object3D {
  constructor ({ id, type, path, dimensions, variantId }) {
    this.config = {}

    this.config.path = path
    this.config.dimensions = dimensions
    this.type = type
    this.id = id
    this.variantId = variantId
  }

  async init () {
    this.object = await loadObject(this.config.path)
    if (!this.config.dimensions) return
    this.setSize(this.config.dimensions)
  }

  getSize () {
    const boundingBox = new THREE.Box3().setFromObject(this.object)
    return {
      width: boundingBox.max.x - boundingBox.min.x,
      height: boundingBox.max.y - boundingBox.min.y,
      depth: boundingBox.max.z - boundingBox.min.z
    }
  }

  getPosition () {
    return this.object.position
  }

  setPosition ({ x, y, z }) {
    // Calcolo la posizione negli assi in base ai parametri ricevuti
    const normalizeX = !x
      ? this.getPosition().x
      : x

    const normalizeY = !y
      ? this.getPosition().y
      : typeof fixedY[this.type] !== 'undefined'
        ? fixedY[this.type] + this.getSize().height / 2
        : y

    const normalizeZ = !z
      ? this.getPosition().z
      : z

    this.object.position.set(normalizeX, normalizeY, normalizeZ)
  }

  setSize (dimensions) {
    const { width, height, depth } = this.getSize()

    const scale = {
      x: dimensions.width ? dimensions.width / (width / this.object.scale.x) : 1,
      y: dimensions.height ? dimensions.height / (height / this.object.scale.y) : 1,
      z: dimensions.depth ? dimensions.depth / (depth / this.object.scale.z) : 1
    }

    this.object.scale.set(scale.x, scale.y, scale.z)
  }

  setColor () {
    // TODO
  }

  setMaterial () {
    // TODO
  }
}
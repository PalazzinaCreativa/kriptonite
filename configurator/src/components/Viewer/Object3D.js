import * as THREE from 'three'
import { loadObject } from "./utils/loadObject"

const fixedY = { // Mostra gli elementi che hanno una posizione y fissa (es: Divano sta sempre a terra)
  sofa: 0
}

export default class Object3D {
  constructor ({ type, path, dimensions }) {
    this.config = {}

    this.config.path = path
    this.config.dimensions = dimensions
    this.type = type
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

  setId (id) {
    this.id = id
  }

  setPosition (x, y, z) {
    const normalizeY = typeof fixedY[this.type] !== 'undefined'
      ? fixedY[this.type] + this.getSize().height / 2
      : y
    this.object.position.set(x, normalizeY, z)
  }

  setSize (dimensions) {
    const { width, height, depth } = this.getSize()

    const scale = {
      x: dimensions.width ? dimensions.width / width : 1,
      y: dimensions.height ? dimensions.height / height : 1,
      z: dimensions.depth ? dimensions.depth / depth : 1
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
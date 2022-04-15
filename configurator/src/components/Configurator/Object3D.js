import { loadObject } from "./utils/loadObject"
import * as THREE from 'three'

export default class Object3D {
  constructor (path, { dimensions, name, id }, callback) {
    console.log('object3d')
    this.path = path
    this.dimensions = dimensions
    this.name = name
    this.id = id
    this.init()
    this.callback = callback
  }

  async init () {
    this.object = await loadObject(this.path)
    if (!this.dimensions) return
    const { width, height, depth } = this.getSize(this.object)
    this.object.scale.set(
      this.dimensions.width / width,
      this.dimensions.height / height,
      this.dimensions.depth / depth
    )
    if (this.callback) this.callback(this.object)
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

  setPosition (x, y, z) {
    this.object.position.set(x, y, z)
  }
}
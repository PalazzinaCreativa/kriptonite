import * as THREE from 'three'
export default class Product {
  constructor (viewer, { inRoomPosition, uprightsPosition }) {
    this.shelves = []
    this.uprights = []

    this.viewer = viewer

    this.object = new THREE.Object3D()
    this.viewer.scene.add(this.object)
    this.inRoomPosition = inRoomPosition
    this.uprightsPosition = uprightsPosition
    this.id = 'product'
  }

  addShelf (shelf, update = true) {
    this.object.add(shelf.object)
    this.shelves.push(shelf)
  }

  addUpright (upright, update = true) {
    this.object.add(upright.object)
    this.uprights.push(upright)
    this.removeWireframes()
  }

  // Rimuovo le guide
  removeWireframes () {
    this.object.remove(this.object.children.find(c => c.name === 'uprights_wireframe'))
  }

  reset () {
    this.uprights.forEach(u => this.object.remove(u.object))
    this.shelves.forEach(s => this.object.remove(s.object))

    this.uprights = []
    this.shelves = []
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
    const normalizeX = !x
      ? this.getPosition().x
      : x

    const normalizeY = !y
      ? this.getPosition().y
      : this.uprightsPosition === 'ground'
        ? this.getSize().height / 2
        : y

    const normalizeZ = !z
      ? this.getPosition().z
      : z

    console.table({ normalizeX, normalizeY, normalizeZ})
    this.object.position.set(normalizeX, normalizeY, normalizeZ)
  }
}
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
}
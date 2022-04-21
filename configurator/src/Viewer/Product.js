import * as THREE from 'three'
import { FLOOR_DEPTH } from '@/dataset/defaultConfiguratorValues'
export default class Product {
  constructor ({ inRoomPosition, uprightsPosition }) {
    this.shelves = []
    this.uprights = []

    this.group = new THREE.Group()
    this.group.position.z = inRoomPosition === 'standalone' ? FLOOR_DEPTH / 3 : 0.1
    this.uprightsPosition = uprightsPosition
  }


  addShelf (shelf) {
    this.group.add(shelf.object)
    this.shelves.push(shelf)
  }

  addUpright (upright) {
    this.group.add(upright.object)
    this.uprights.push(upright)

    this.removeWireframes()
  }

  // Rimuovo le guide
  removeWireframes () {
    this.group.remove(this.group.children.find(c => c.name === 'uprights_wireframe'))
  }
}
import * as THREE from 'three'
import { STANDALONE_Z } from '@/dataset/defaultConfiguratorValues'
export default class Product {
  constructor ({ inRoomPosition, uprightsPosition }) {
    this.shelves = []
    this.uprights = []

    this.group = new THREE.Group()
    this.inRoomPosition = inRoomPosition
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

  reset () {
    this.uprights.forEach(u => this.group.remove(u.object))
    this.shelves.forEach(s => this.group.remove(s.object))

    this.uprights = []
    this.shelves = []
  }
}
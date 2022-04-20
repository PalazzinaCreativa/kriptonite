import * as THREE from 'three'
export default class Product {
  constructor () {
    this.shelves = []
    this.uprights = []

    this.group = new THREE.Group()
  }


  addShelf (shelf) {
    this.group.add(shelf.object)
    this.shelves.push(shelf)
  }

  addUpright (upright) {
    this.group.add(upright.object)
    this.uprights.push(upright)

    // Rimuovo le guide
    this.group.remove(this.group.children.find(c => c.name === 'uprights_wireframe'))
  }
}
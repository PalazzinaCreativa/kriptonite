import * as THREE from 'three'
import { createLine } from './utils/createLine'
import { createMeasure } from './utils/createMeasure'
export default class Product {
  constructor (viewer, { inRoomPosition, uprightsPosition }) {
    this.uprights = []
    this.shelves = []
    this.cases = []

    this.viewer = viewer

    this.object = new THREE.Object3D()
    this.object.name = 'Product'
    this.viewer.scene.add(this.object)
    this.inRoomPosition = inRoomPosition
    this.uprightsPosition = uprightsPosition
    this.id = 'product'
  }

  addUpright (upright) {
    this.object.add(upright.object)
    this.uprights.push(upright)
    this.removeWireframes()
  }

  addShelf (shelf) {
    this.object.add(shelf.object)
    this.shelves.push(shelf)
  }

  addCase (item) {
    this.object.add(item.object)
    this.cases.push(item)
  }

  // Rimuovo le guide
  removeWireframes () {
    this.object.remove(this.object.children.find(c => c.name === 'uprights_wireframe'))
  }

  getSize () {
    const boundingBox = new THREE.Box3().setFromObject(this.object)
    return {
      width: boundingBox.max.x - boundingBox.min.x,
      height: boundingBox.max.y - boundingBox.min.y,
      depth: boundingBox.max.z - boundingBox.min.z
    }
  }

  reset () {
    this.uprights.forEach(u => this.object.remove(u.object))
    this.shelves.forEach(s => this.object.remove(s.object))
    this.cases.forEach(c => this.object.remove(s.object))

    this.uprights = []
    this.shelves = []
    this.cases = []
  }

  toggleMeasures () {
    if (this._visibleMeasures) {
      this._visibleMeasures = false
      this.measures.visible = false
      this.viewer.room.main.visible = true
      return
    }
    this.viewer.room.main.visible = false // TODO: Provare parete e pavimento in trasparenza
    this._createMeasures()
  }

  async _createMeasures () {
    this._visibleMeasures = true
    const DIMENSIONS_GUTTER = 5 // Distacco delle misure dal prodotto
    if (this.measures) {
      this.object.remove(this.measures)
    }
    this.measures = new THREE.Object3D()
    this.measures.name = 'Measures'
    this.object.add(this.measures)

    const size = this.getSize()

    const width = await createMeasure('horizontal', size.width) // Larghezza totale
    const height = await createMeasure('vertical', size.height) // Altezza totale

    width.position.x = DIMENSIONS_GUTTER
    width.position.y = -DIMENSIONS_GUTTER * 3
    height.position.y = DIMENSIONS_GUTTER
    height.position.x = -DIMENSIONS_GUTTER

    // Cerco il montante più a sinistra
    const leftmostUpright = this.uprights
      .filter(u => u.index === 0)
      .reduce((acc, curr) => (acc.getPosition().y > curr.getPosition().y) ? acc : curr, this.uprights[0])

    // Cerco il montante più basso
    const lowestUpright = this.uprights
      .reduce((acc, curr) => (acc.getPosition().y + acc.getSize().height / 2 < curr.getPosition().y + curr.getSize().height / 2) ? acc : curr)

    // Calcolo la posizione del gruppo principale
    const measuresPosition = {
      x: leftmostUpright.getPosition().x + leftmostUpright.getSize().width - DIMENSIONS_GUTTER,
      y: lowestUpright.getPosition().y - lowestUpright.getSize().height / 2 - DIMENSIONS_GUTTER,
      z: 50
    }
    this.measures.position.copy(measuresPosition)

    this.measures.add(width)
    this.measures.add(height)

    // Distanze tra i montanti
    const uprightsMeasures = new THREE.Group()
    uprightsMeasures.name = 'UprightsMeasures'
    this.measures.add(uprightsMeasures)

    const maxIndex = Math.max.apply(Math, this.uprights.map(_ => _.index)) // Indice più alto tra i montanti
    let latestIndex

    this.uprights
      .forEach(async upright => {
        if (upright.index === maxIndex || upright.index === latestIndex) return // Se è l'ultimo montante o ho già calcolato le misure per quell'indice
        // Cerco il suo montante più vicino a destra
        const nearestUpright = this.uprights.find(_ => _.index === upright.index + 1)
        const distance = nearestUpright.getPosition().x - upright.getPosition().x // Distanza tra i due montanti

        const measure = await createMeasure('horizontal', distance, 5)

        // Calcolo la posizione della misura
        measure.position.x = uprightsMeasures
          .children
          .reduce((acc, curr) => {
            const box = new THREE.Box3().setFromObject(curr)
            return acc + box.max.x - box.min.x + 10
          }, upright.getSize().width / 2)

        measure.position.y = DIMENSIONS_GUTTER
        uprightsMeasures.add(measure)
      })

    // Distanze tra gli scaffali
    const shelvesMeasures = new THREE.Group()
    shelvesMeasures.name = 'ShelvesMeasures'
    this.measures.add(shelvesMeasures)

    // Raggruppo gli scaffali della stessa campata
    const groupShelves = this.shelves
      .reduce((acc, curr) => {
        const accPosition = acc[parseInt(curr.getPosition().x)] || []
        return Object.assign(acc, { [parseInt(curr.getPosition().x)]: [...accPosition, curr]}, {})
      }, {})

    Object.values(groupShelves)
      .forEach(group => {
        const maxY = parseInt(Math.max.apply(Math, group.map(_ => _.getPosition().y))) // Trovo la posizione più alta tra gli scaffali della campata

        group
          .forEach(async shelf => {
            if (parseInt(shelf.getPosition().y) === maxY) return // Se è lo scaffale più in alto esco dal ciclo
            // Cerco lo scaffale più vicino nell'asse y
            const nearestShelf = group
              .filter(_ => _.getPosition().y > shelf.getPosition().y && shelf._uid !== _._uid)
              .reduce((acc, curr) => (acc.getPosition().y > curr.getPosition().y) ? curr : acc)
            // Creo due bounding box per i due scaffali per trovare i loro punti minimi
            const currBox = new THREE.Box3().setFromObject(shelf.object)
            const nearestBox = new THREE.Box3().setFromObject(nearestShelf.object)
            const distance = nearestBox.min.y - currBox.min.y

            const measure = await createMeasure('vertical', distance, 2)

            // Cerco la posizione del gruppo relativa alla scena
            const positionInScene = new THREE.Vector3()
            positionInScene.copy(shelvesMeasures.position)
            shelvesMeasures.localToWorld(positionInScene)
            this.viewer.scene.worldToLocal(positionInScene)

            measure.position.x = currBox.max.x - positionInScene.x - 5
            measure.position.y = currBox.min.y - positionInScene.y + 2

            shelvesMeasures.add(measure)
          })
      })
  }
}
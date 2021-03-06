import * as THREE from 'three'
import { STANDALONE_Z, elementDistances } from '@/dataset/defaultConfiguratorValues'
import { createLine } from './utils/createLine'
import { createMeasure } from './utils/createMeasure'
export default class Product {
  constructor (viewer, { type, inRoomPosition, uprightsPosition }) {
    this.uprights = []
    this.shelves = []
    this.cases = []

    this.viewer = viewer

    this.object = new THREE.Object3D()
    this.object.name = 'Product'
    this.viewer.scene.add(this.object)
    this.type = type
    this.inRoomPosition = inRoomPosition
    this.uprightsPosition = uprightsPosition
    this.id = 'product'

    this.elementConfig = this.type ? elementDistances.find((product) => product.type === this.type && product.inRoomPosition === this.inRoomPosition && product.uprightsPosition === this.uprightsPosition) : null
    this.attachPoint = this.elementConfig ? this.elementConfig.attachPoint : 0
    this.distanceFromWall = this.elementConfig ? this.elementConfig.distance : 0.1
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
    this.object.remove(this.object.children.find(c => c.name === 'wireframe_distance'))
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
    this.cases.forEach(c => this.object.remove(c.object))

    this.uprights = []
    this.shelves = []
    this.cases = []
  }

  toggleMeasures () {
    if (this._visibleMeasures) {
      this._visibleMeasures = false
      this.measures.visible = false
      this.viewer.room.main.traverse(child => {
        if (child.material) {
          child.material.opacity = 1
          child.material.alphaTest = 1
          child.material.transparent = false
          child.material.depthWrite = true
        }
      })
      this.viewer.updateConfig()
      // console.log(this.viewer.room.main)
      return
    }
    this.viewer.room.main.traverse(child => {
      if (child.material) {
        child.material.opacity = 0.1
        child.material.alphaTest = 0.1
        child.material.transparent = true
        child.material.depthWrite = false
      }
    })
    this.viewer.updateConfig()
    this._createMeasures()
  }

  async _createMeasures () {
    this._visibleMeasures = true
    // Distacco delle quote dagli elementi
    const DIMENSIONS_GUTTER = 7.5
    // Funzione di toggle
    if (this.measures) {
      this.object.remove(this.measures)
    }
    // Istanza delle quote
    this.measures = new THREE.Object3D()
    this.measures.name = 'Measures'
    this.object.add(this.measures)

    // Se non ci sono almeno 2 montanti le quote non verranno calcolate
    if(this.uprights.length < 2) return

    // Cerco il montante pi?? a destra
    const latestUpright = this.uprights.reduce((prev, current) => (prev.realIndex > current.realIndex) ? prev : current)

    // Cerco il montante pi?? a sinistra
    const leftmostUpright = this.uprights
      .filter(u => u.realIndex === 0)
      .reduce((acc, curr) => (acc.getPosition().y > curr.getPosition().y) ? acc : curr, this.uprights[0])

    // Cerco il montante pi?? basso
    const lowestUpright = this.uprights
      .reduce((acc, curr) => (acc.getPosition().y + acc.getSize().height / 2 < curr.getPosition().y + curr.getSize().height / 2) ? acc : curr)

    // Quote totali
    const size = this.getSize()
    const width = await createMeasure('horizontal', size.width)
    const height = await createMeasure('vertical', size.height)

    width.position.x = -(leftmostUpright.getSize().width / 2)
    width.position.y = -DIMENSIONS_GUTTER * 3
    height.position.y = DIMENSIONS_GUTTER
    height.position.x = latestUpright.getPosition().x + DIMENSIONS_GUTTER // Sinistra: -DIMENSIONS_GUTTER * 2.5

    // Posizione delle quote totali
    const measuresZPosition = this.distanceFromWall
    const measuresPosition = {
      x: leftmostUpright.getPosition().x,
      y: lowestUpright.getPosition().y - lowestUpright.getSize().height / 2 - DIMENSIONS_GUTTER,
      z: measuresZPosition
    }
    
    this.measures.position.copy(measuresPosition)

    this.measures.add(width)
    this.measures.add(height)

    // Distanze tra i montanti
    const uprightsMeasuresX = new THREE.Group()
    const uprightsMeasuresY = new THREE.Group()
    uprightsMeasuresX.name = 'UprightsMeasuresX'
    uprightsMeasuresY.name = 'UprightsMeasuresY'
    this.measures.add(uprightsMeasuresX)
    this.measures.add(uprightsMeasuresY)

    // Il montante pi?? a destra
    const maxIndex = Math.max.apply(Math, this.uprights.map(upright => upright.realIndex))
    let latestIndex

    this.uprights.map(async (upright, index) => {
      // measuresGapY
      // Se si vogliono mettere le quote vicino al relativo montante: upright.getPosition().x - DIMENSIONS_GUTTER * 5
      // Se si vogliono le quote tutte a sinistra: -DIMENSIONS_GUTTER * 2.5 * (upright.index + 1)
      // Se si deve posizionare a sinistra aggiungere: - DIMENSIONS_GUTTER * 2.5
      const measuresGapY = -DIMENSIONS_GUTTER * 2.5 * (upright.index + 1)
      const uprightHeight = upright.getSize().height
      const measureVertical = await createMeasure('vertical', uprightHeight)

      // Posizione della quota verticale
      measureVertical.position.x = measuresGapY
      measureVertical.position.y = this.uprightsPosition === 'standalone' ? DIMENSIONS_GUTTER : upright.getPosition().y - upright.getSize().height / 2 - DIMENSIONS_GUTTER - 2 // "2" ?? lo spessore della linea
      uprightsMeasuresY.add(measureVertical)

      // Se ?? l'ultimo montante oppure sono gi?? state calcolate le misure per quell'indice
      if (upright.realIndex === maxIndex || upright.realIndex === latestIndex) return
      // Montante alla destra del montante corrente
      const nearestUpright = this.uprights.find(item => item.realIndex === upright.realIndex + 1)
      // Distanza tra i due montanti
      const distance = nearestUpright.getPosition().x - upright.getPosition().x - this.attachPoint
      // Se la distanza ?? 0 vuol dire che il montante in questione ?? incolonnato ed ha quindi lo stesso indice
      if(distance) {
        const measure = await createMeasure('horizontal', distance)
        
        // Posizione della quota orizzontale
        measure.position.x = uprightsMeasuresX.children.reduce((acc, curr) => {
          const box = new THREE.Box3().setFromObject(curr)

          return acc + this.attachPoint + box.max.x - box.min.x
        }, this.attachPoint / 2)
  
        uprightsMeasuresX.add(measure)
      }
    })

    // Distanze tra gli scaffali
    /* const shelvesMeasures = new THREE.Group()
    shelvesMeasures.name = 'ShelvesMeasures'
    this.measures.add(shelvesMeasures)

    // Unisco ripiani e contenitori
    const shelvesAndCases = [...this.shelves, ...this.cases]

    // Raggruppamento ripiani e contenitori attaccati alla stessa coppia di montanti
    const groupShelves = shelvesAndCases
      .reduce((acc, curr) => {
        const accPosition = acc[parseInt(curr.getPosition().x)] || []
        return Object.assign(acc, { [parseInt(curr.getPosition().x)]: [...accPosition, curr]}, {})
      }, {})

      //console.log(groupShelves)

    Object.values(groupShelves)
      .forEach(group => {
        const maxY = parseInt(Math.max.apply(Math, group.map(_ => _.getPosition().y))) // Trovo la posizione pi?? alta tra gli scaffali della campata

        group
          .forEach(async shelf => {
            if (parseInt(shelf.getPosition().y) === maxY) return // Se ?? lo scaffale pi?? in alto esco dal ciclo
            // Cerco lo scaffale pi?? vicino nell'asse y
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
      }) */
  }
}
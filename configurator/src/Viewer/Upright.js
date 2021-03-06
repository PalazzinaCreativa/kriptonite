import * as THREE from 'three'
import { STANDALONE_Z, GUTTER, RESTING_ON_THE_GROUND, elementDistances } from '@/dataset/defaultConfiguratorValues'
import Object3D from "./Object3D"
import { stringToThreeColor } from "./utils/stringToThreeColor"
import { createText } from "./utils/createText"
import Client from '../utils/client';

const c = new Client({
  baseURL: 'https://kriptonite-cms-i6snh.ondigitalocean.app'
})

// Ricavo le finiture dal Database
const getColors = async() => await c.getColors()
var colors = getColors()
colors = colors.length ? colors.sort((a, b) => a.id - b.id) : colors

// Distanza tra i montanti
const defaultGap = 6.4

const currentProductUprightsDistance = {
  k1: [0, 40, 60, 75, 90], //[0, 40, 60, 75, 90, 120, 151, 180]
  k2: [60, 90, 120]
}

export default class Upright extends Object3D {

  constructor (config, product) {
    super(config)
    this.product = product
    this._cantBePositioned = false
    this.config.type = 'upright'
    this.bases = [
      { id: 5, childName: 'object_6', center: { x: this.product.viewer.config.room.dimensions.width / 6.22 , y: 0, z: 12.5 }, rotationAxis: { x: 0, y: 1, z: 0 }}
    ]

    // "index" è il numero delle colonne dei montanti sull'asse X, se ci sono 2 montanti uno sotto l'altro avranno lo stesso "index", ma diversi "realIndex"
    if (typeof config.index !== 'undefined') this.index = config.index
    // "realIndex" è l'indice di immissione, ovvero il numero del montante in ordine di inserimento
    if (typeof config.realIndex !== 'undefined') this.realIndex = config.realIndex
  }

  async init () {
    await super.init()
    super.getElementConfig()
    this.setSize()
    // Settaggio della prima finitura dell'elemento in fase di inserimento:
    // Verrà scelta la finitura impostata dall'utente oppure il primo risultato proveniente dal Database.
    let firstColor = colors.length ? colors[0] : { color: '#a1a1a1' }
    super.setMaterial(this.config.material || { color: '#a1a1a0', opacity: 1, roughness: 5 }, false)
    //this.setBases()
  }

  setBases () {
    // Rotazione dei piedini
    if(this.bases.some(base => base.id === this.config.id)) {
      var atticOrientationFactor = this.product.viewer.config.room.dimensions.leftHeight > this.product.viewer.config.room.dimensions.rightHeight ? -1 : 1
      this.object.traverse(child => {
        var translateData = this.bases.find(base => base.id === this.config.id)
        if (child.userData?.name === translateData.childName) {
          child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(translateData.center.x * atticOrientationFactor, translateData.center.y, translateData.center.z))
          child.rotateOnAxis(new THREE.Vector3(translateData.rotationAxis.x, translateData.rotationAxis.y, translateData.rotationAxis.z), this.product.viewer.config.room.atticAngle * atticOrientationFactor)
        }
      })
    }
  }

  multipleDeletionAlert(state) {
    window.dispatchEvent(new Event('alert'))
    // Ascolto dell'evento di conferma per l'alert per l'eliminazione di più elementi relativi al montante in fase di eliminazione
    window.addEventListener('confirmModal', (event) => {
      this.confirmDestroy()
    })
  }

  setSize (dimensions) {
    const { width, height, depth } = this.getSize()
    const { x, y, z } = this.getPosition()

    // Se il prodotto è un montante K2 cielo-terra, la sua altezza dev'essere pari a quella della stanza
    var roomHeightScaleFactor = 1
    if(this.product.uprightsPosition === 'standalone' && this.product.type === 'k2') {
      var currentRoomHeight = this.product.viewer.config.room.dimensions.height

      if(this.product.viewer?.room?.config?.type === 'attic') {
        // Calcolo della base del triangolo dello spazio rimanente
        const triangleBase = this.product.viewer.config.room.dimensions.leftHeight > this.product.viewer.config.room.dimensions.rightHeight
        ? this.product.viewer.config.room.dimensions.width - this.getPosition().x - (GUTTER * 1)
        : this.getPosition().x - (GUTTER * 1)

        // Calcolo dell'altezza della stanza alla posizione del mouse
        currentRoomHeight = triangleBase * Math.tan(this.product.viewer.config.room.atticAngle) + Math.min(this.product.viewer.config.room.dimensions.leftHeight, this.product.viewer.config.room.dimensions.rightHeight)
      }
      // Passaggio dell'altezza ricalcolata al componente
      this.config.adaptiveHeight = currentRoomHeight
      // Utilizzo di un evento custom per ricalcolare la variabile nel componente
      window.dispatchEvent(new Event('changeAdaptiveHeight'))
      // Altezza della mansarda alla posizione del mouse
      roomHeightScaleFactor = currentRoomHeight / this.config.height
    }

    const scale = {
      x: dimensions?.width ? dimensions.width / (width / this.object.scale.x) : 1,
      y: roomHeightScaleFactor,
      z: dimensions?.depth ? dimensions.depth / (depth / this.object.scale.z) : 1,
    }
    
    this.object.scale.set(scale.x, scale.y, scale.z)
  }

  setPosition ({ x, y, z }) {
    // Calcolo dell'altezza in base alla distanza tra i fori dei montanti per allineare questi ultimi
    const currentGap = this.config.slot_space || defaultGap
    const gridY = Math.floor(y / currentGap) * currentGap
    const groundY = this.getSize().height / 2
    super.setPosition({ x, y: this.config.grounded ? groundY : gridY, z })
    this._checkPosition({ x, y, z })
  }

  _setIndex () {
    // Indicazione del montante come "in fase di inserimento"
    this.isPlaced = true
    // Se è il primo montante in fase di inserimento setto gli indici a 0
    if (!this.product.uprights.length) {
      this.index = 0
      this.realIndex = 0
      return
    }
    // Impostazione dell'indice dei montanti in base al montante più a destra.
    // Se ci sono più montanti in colonna avranno lo stesso "index"
    const latestUpright = this.product.uprights.reduce((prev, current) => (prev.index > current.index) ? prev : current)
    this.index = latestUpright.getPosition().x === this.getPosition().x ? latestUpright.index : latestUpright.index + 1
    this.realIndex = this.product.uprights.length
  }

  _checkPosition ({ x, y }) {
    let cantBePositioned = false

    // Controllo che il montante non vada oltre l'altezza della stanza
    cantBePositioned = this.getSize().height > this.product.viewer.config.room.dimensions.height

    const wireframes = this.product.object.children.find(c => c.name === 'uprights_wireframe')?.children
    if (wireframes) {
      cantBePositioned = !wireframes.some((w, i) => {
        // SNAP: Controllo che sia vicino a un wireframe
        const snap = 20
        const isIn = x > w.position.x - snap && x < w.position.x + snap
        // In caso positivo lo metto nella stessa posizione x ed esco dal ciclo
        if (isIn) this.object.position.x = w.position.x
        return isIn
      })
    }

    const isGroundToCeilingUpright = this.product.uprightsPosition === 'standalone' && this.product.type === 'k2'

    if (this.product.viewer.config.room.type === 'attic' && !cantBePositioned) {
      // Controllo la posizione e altezza del montante rispetto all'altezza della parete. Per farlo uso la formula per calcolare la dimensione di un cateto dati un cateto e un angolo del triangolo rettangolo.
      const sideWidth = this.product.viewer.config.room.dimensions.leftHeight > this.product.viewer.config.room.dimensions.rightHeight // Larghezza del cateto inferiore
        ? this.product.viewer.config.room.dimensions.width - x
        : x

      const unknownSideWidth = sideWidth * Math.tan(this.product.viewer.config.room.atticAngle)

      // Altezza della mansarda al punto x richiesto
      const availableYSpace = unknownSideWidth + Math.min(this.product.viewer.config.room.dimensions.leftHeight, this.product.viewer.config.room.dimensions.rightHeight)
      cantBePositioned = isGroundToCeilingUpright ? false : (y + this.getSize().height / 2) > (availableYSpace - GUTTER)
    }

    this._cantBePositioned = cantBePositioned
    this._setState()
  }

  _setState() {
    this.object.traverse(child => {
      if (child.material) {
        child.material.transparent = true
        child.material.opacity = this._cantBePositioned ? 0.2 : 1
      }
    })
  }

  // Genera le guide sulle quali potrà essere posizionato il montante
  _generateSiblingWireframe (roomWidth, roomHeight) {
    if (!this.product.uprights.length) return

    const latestUpright = this.product.uprights.reduce((prev, current) => (prev.index > current.index) ? prev : current)

    const wireframes = new THREE.Group()
    const distances = new THREE.Group()
    wireframes.name = 'uprights_wireframe'
    distances.name = 'wireframe_distance'
    this.product.object.add(wireframes)
    this.product.object.add(distances)

    // Creazione delle guide per ogni possibile distanza
    currentProductUprightsDistance[this.product.type]
      .forEach(async (x) => {
        // Controllo che il wireframe ci stia all'interno della stanza
        if (latestUpright.object.position.x + x > roomWidth) return

        // Mesh della guida
        const wireframe = new THREE.Mesh(
          new THREE.BoxGeometry(this.getSize().width + 2, roomHeight, this.getSize().depth + 2),
          new THREE.MeshStandardMaterial({ color: 0x707070, transparent: true, opacity: 0.2, roughness: 0 }),
        )

        wireframe.position.z = this.distanceFromWall
        wireframe.position.y = roomHeight / 2
        wireframe.position.x = latestUpright.object.position.x + x + this.attachPoint
        wireframes.add(wireframe)

        // Distanze tra i montanti
        const distance = x ? new THREE.Mesh(
          await createText(`${x}`, { size: 4, depth: 0.1, amount: 0.1 }),
          new THREE.MeshLambertMaterial({ color: 0x000000, transparent: false, opacity: 1 })
        ) : 0

        const distanceUnit = x ? new THREE.Mesh(
          await createText('cm', { size: 2.5, depth: 0.1, amount: 0.1 }),
          new THREE.MeshLambertMaterial({ color: 0x000000, transparent: false, opacity: 1 })
        ) : 0

        if(distance) {
          var distanceBox = new THREE.Box3().setFromObject(distance);
          var distanceWidth = distanceBox.max.x - distanceBox.min.x

          distance.geometry.center()
          distance.position.z = this.product.inRoomPosition === 'standalone' ? STANDALONE_Z + 7 : 7
          distance.position.y = 50
          distance.position.x = latestUpright.object.position.x + x
          distances.add(distance)

          // Unità di misura
          if(distanceUnit) {
            distanceUnit.geometry.center()
            distanceUnit.position.z = this.product.inRoomPosition === 'standalone' ? STANDALONE_Z + 7 : 7
            distanceUnit.position.y = 49
            distanceUnit.position.x = latestUpright.object.position.x + x + distanceWidth / 2 + 3.5
            distances.add(distanceUnit)
          }
        }
      })
  }

  destroy(isDestroying = false) {
    // Cancello tutti i montanti alla sua destra e tutti i ripiani ad esso collegati
    if (this.getSiblings().some(sibling => sibling.index > this.index) && !isDestroying) {
      // Se ci sono montanti alla sua destra, viene sollevato un evento di alert per avvisare l'utente dell'eliminazione multipla
      this.multipleDeletionAlert()
    } else {
      // Eliminazione degli elementi associati al montante
      this.destroyAttachedElements()
      // Eliminazione del montante
      super.destroy()
    }
  }

  async confirmDestroy() {
    // Variabile per evitare "Maximuum call stack exceeded" nella funzione ricorsiva, se si stanno eliminando altri elementi
    // this.product._isDestroying = true
    
    // Chiamata alla funzione ricorsiva di eliminazione
    const uprightsToDelete = this.product.uprights.filter(u => u.index >= this.index && u.realIndex >= this.realIndex)
    
    if(uprightsToDelete.length) {
      uprightsToDelete.map(async (upright) => {
        await upright.destroy(true)
      })
    }

    this.destroyAttachedElements()
    //this.product._isDestroying = false
    return
  }

  destroyAttachedElements() {
    // Eliminazione dei ripiani e dei contenitori associati
    // Partenza dal montante alla sinistra di quello in fase di eliminazione per verificare che ci siano ripiani o contenitori attaccati a quest'ultimo
    const nearestUpright = this.product.uprights.find(p => p.index === this.index - 1) || null

    // Eliminazione di eventuali elementi attaccati ai ripiani in fase di eliminazione
    const elementsOnTheRoom = [...this.product.shelves, ...this.product.cases]

    const elementsToDelete = nearestUpright ? elementsOnTheRoom.filter((item) => {
      return item.getPosition().x >= nearestUpright.getPosition().x
    }) : elementsOnTheRoom

    if(elementsToDelete.length) {
      elementsToDelete.map(async (element) =>  await element.destroy())
    }
  }
}